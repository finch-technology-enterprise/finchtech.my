/**
 * In-memory token bucket rate limiter for the contact endpoint.
 *
 * Limits: 5 requests / minute / IP, 20 requests / hour / IP.
 * Implemented as a sliding-window counter stored in the Workers isolate
 * memory — fine for landing volume (low traffic, edge isolates recycle).
 *
 * KV upgrade path: if abuse grows or you need global limits, replace the
 * Map with a KV binding. Pseudo:
 *   // if (env.RATE_LIMIT) {
 *   //   const key = `rl:${ip}:${bucket}`; await env.RATE_LIMIT.get(key) ...
 *   //   // use KV atomic increment + TTL (60s / 3600s)
 *   // }
 * Bind as `RATE_LIMIT` (KV namespace) in wrangler.toml and pass `env`
 * into `checkRateLimit`. Keep the same `{allowed, retryAfter}` shape so
 * `app/api/contact/route.ts` does not change.
 */

const MINUTE_WINDOW_MS = 60_000;
const HOUR_WINDOW_MS = 60 * 60_000;
const MINUTE_LIMIT = 5;
const HOUR_LIMIT = 20;

// ip -> timestamps (ms) of allowed requests
const store = new Map<string, number[]>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = store.get(ip) ?? [];

  // Prune entries outside the hour window (anything older than 1h is irrelevant)
  const hourRelevant = timestamps.filter((t) => now - t <= HOUR_WINDOW_MS);
  const minuteRelevant = hourRelevant.filter((t) => now - t <= MINUTE_WINDOW_MS);

  if (minuteRelevant.length >= MINUTE_LIMIT) {
    const oldest = Math.min(...minuteRelevant);
    const retryAfter = Math.ceil((oldest + MINUTE_WINDOW_MS - now) / 1000);
    // Persist pruned list even when blocked (do not push current attempt)
    store.set(ip, hourRelevant);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  if (hourRelevant.length >= HOUR_LIMIT) {
    const oldest = Math.min(...hourRelevant);
    const retryAfter = Math.ceil((oldest + HOUR_WINDOW_MS - now) / 1000);
    store.set(ip, hourRelevant);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  hourRelevant.push(now);
  store.set(ip, hourRelevant);
  return { allowed: true };
}

/** Test helper — clears all buckets. Not for production use. */
export function _resetRateLimit(): void {
  store.clear();
}
