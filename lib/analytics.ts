/**
 * Conversion measurement without a third-party analytics provider.
 *
 * Context: the site's published Privacy Policy states it uses "only essential
 * cookies" and "no advertising cookies". Adding GA4 / Meta Pixel would
 * contradict that, so this module deliberately does not.
 *
 * What it does instead:
 *  1. Emits a `navigator.sendBeacon` to a first-party endpoint (`/api/event`)
 *     for the handful of business actions that matter. No cookies, no device
 *     identifiers, no cross-site state — the Worker logs an aggregate line that
 *     is queryable through Workers Observability.
 *  2. Forwards UTM parameters to product domains so NexMenu can attribute
 *     signups that originated on finchtech.my.
 *
 * The full funnel view (session stitching, campaign ROI) still needs a real
 * analytics product; see the completion report for the recommended next step.
 */

export type ConversionEvent =
  | 'nexmenu_demo'
  | 'nexmenu_signup'
  | 'nexmenu_pricing'
  | 'nexmenu_product'
  | 'nexmenu_outbound'
  | 'geraiku_outbound'
  | 'whatsapp_click'
  | 'email_click'
  | 'contact_submit_success'
  | 'contact_submit_failure';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

/** Capture inbound campaign params so they survive an outbound product handoff. */
export function currentUtmParams(search?: string): Record<string, string> {
  if (typeof window === 'undefined' && !search) return {};
  const params = new URLSearchParams(search ?? window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

/**
 * Append campaign attribution to an outbound product URL.
 * Always stamps utm_source=finchtech.my so NexMenu/GeraiKu can see that the
 * visitor arrived from the corporate site, then preserves any inbound campaign.
 */
export function withAttribution(url: string, placement: string): string {
  try {
    const target = new URL(url);
    const inbound = currentUtmParams();
    target.searchParams.set('utm_source', inbound.utm_source ?? 'finchtech.my');
    target.searchParams.set('utm_medium', inbound.utm_medium ?? 'referral');
    target.searchParams.set('utm_campaign', inbound.utm_campaign ?? 'corporate_site');
    target.searchParams.set('utm_content', placement);
    for (const [key, value] of Object.entries(inbound)) {
      if (key === 'utm_source' || key === 'utm_medium' || key === 'utm_campaign') continue;
      target.searchParams.set(key, value);
    }
    return target.toString();
  } catch {
    return url;
  }
}

/** Fire-and-forget conversion signal. Never blocks navigation. */
export function trackConversion(event: ConversionEvent, placement?: string): void {
  if (typeof navigator === 'undefined') return;
  try {
    const body = JSON.stringify({
      event,
      placement: placement ?? null,
      path: window.location.pathname,
      ts: Date.now(),
    });
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
      return;
    }
    void fetch('/api/event', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Measurement must never break a user journey.
  }
}
