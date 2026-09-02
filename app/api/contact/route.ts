import { NextRequest, NextResponse } from 'next/server';
import { ContactSchema, sendEmail, sendTelegram, topicLabel } from '@/lib/contact';
import { verifyTurnstile } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SUCCESS_MESSAGE = 'Thank you — your enquiry has been sent. We usually reply within one business day.';
const FAILURE_MESSAGE = 'We could not send your enquiry right now. Please WhatsApp or email us instead.';

/**
 * Contact intake.
 *
 * Delivery is best-effort across three independent sinks so a single
 * misconfiguration cannot lose a lead:
 *   1. Telegram (instant notification)
 *   2. Email via Brevo or Sender.net
 *   3. Durable KV write — the safety net. If neither notification channel is
 *      configured, the enquiry is still persisted and recoverable rather than
 *      being dropped. The audit found the site silently losing every lead; this
 *      makes that failure mode impossible.
 *
 * Verification policy: if TURNSTILE_SECRET_KEY is configured, a token is
 * required and must verify. If it is not configured, the request proceeds as
 * unverified and relies on the honeypot plus rate limiting — the user is never
 * blocked by server-side configuration they cannot influence.
 */

interface ContactEnv {
  CONTACT_INBOX?: KVNamespace;
}

type KVNamespace = {
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
};

async function getKv(): Promise<KVNamespace | undefined> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as unknown as ContactEnv)?.CONTACT_INBOX;
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'We could not read that submission. Please try again.' },
      { status: 400 },
    );
  }

  const body = (raw ?? {}) as Record<string, unknown>;

  // Honeypot: respond exactly like a success, deliver nothing.
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please check the highlighted fields.',
        fieldErrors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anon';

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many messages from this connection. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } },
    );
  }

  // Verification is enforced only when the server is actually configured for it.
  const challengeConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY);
  let verified = false;

  if (challengeConfigured) {
    verified = await verifyTurnstile(parsed.data.turnstileToken, ip);
    if (!verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'We could not complete the anti-spam check. Please try again.',
        },
        { status: 400 },
      );
    }
  }

  const ctx = { verified };
  const [telegram, email] = await Promise.allSettled([
    sendTelegram(parsed.data, ctx),
    sendEmail(parsed.data, ctx),
  ]);

  const notified = telegram.status === 'fulfilled' || email.status === 'fulfilled';

  // Durable fallback so an enquiry is never lost to configuration drift.
  let persisted = false;
  const kv = await getKv();
  if (kv) {
    try {
      await kv.put(
        `enquiry:${new Date().toISOString()}:${crypto.randomUUID()}`,
        JSON.stringify({
          receivedAt: new Date().toISOString(),
          topic: parsed.data.topic,
          topicLabel: topicLabel(parsed.data.topic),
          name: parsed.data.name,
          contact: parsed.data.contact,
          message: parsed.data.message,
          verified,
          notified,
          country: req.headers.get('cf-ipcountry') ?? null,
        }),
        { expirationTtl: 60 * 60 * 24 * 180 },
      );
      persisted = true;
    } catch {
      persisted = false;
    }
  }

  if (!notified && !persisted) {
    console.error(
      JSON.stringify({
        kind: 'contact_delivery_failure',
        telegram: telegram.status === 'rejected' ? String(telegram.reason) : 'ok',
        email: email.status === 'rejected' ? String(email.reason) : 'ok',
        kv: kv ? 'write_failed' : 'unbound',
      }),
    );
    return NextResponse.json({ success: false, message: FAILURE_MESSAGE }, { status: 502 });
  }

  console.log(
    JSON.stringify({
      kind: 'contact_received',
      topic: parsed.data.topic,
      verified,
      notified,
      persisted,
      country: req.headers.get('cf-ipcountry') ?? null,
    }),
  );

  return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
}
