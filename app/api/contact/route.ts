import { NextRequest, NextResponse } from 'next/server';
import { ContactSchema, sendTelegram, sendEmail } from '@/lib/contact';
import { verifyTurnstile } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SUCCESS_MESSAGE = 'Your message has been sent successfully. We will get back to you soon!';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Check your input', fieldErrors: { formErrors: [], fieldErrors: {} } },
      { status: 400 },
    );
  }

  const raw = body as Record<string, unknown>;

  // Honeypot — silent success, no delivery, no rate-limit/turnstile
  if (typeof raw.website === 'string' && raw.website.trim().length > 0) {
    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Check your input', fieldErrors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || undefined;
  const rl = checkRateLimit(ip || 'anon');
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Try again soon.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } },
    );
  }

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Verification failed. Try again.' }, { status: 400 });
  }

  const warnings: string[] = [];
  const results = await Promise.allSettled([sendTelegram(parsed.data), sendEmail(parsed.data)]);
  if (results.every((r) => r.status === 'rejected')) {
    return NextResponse.json({ success: false, message: 'Could not deliver — try WhatsApp.' }, { status: 502 });
  }
  for (const r of results) {
    if (r.status === 'rejected') warnings.push(String((r.reason as Error).message));
  }
  return NextResponse.json({
    success: true,
    message: SUCCESS_MESSAGE,
    ...(warnings.length ? { warnings } : {}),
  });
}
