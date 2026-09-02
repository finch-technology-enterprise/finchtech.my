import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ContactSchema } from '@/lib/contact';

// ---------------------------------------------------------------------------
// ContactSchema
// ---------------------------------------------------------------------------
describe('ContactSchema', () => {
  it('accepts valid email contact', () => {
    expect(
      ContactSchema.safeParse({
        name: 'A',
        contact: 'a@b.com',
        message: 'Hello world!!',
        turnstileToken: 'tok',
      }).success,
    ).toBe(true);
  });

  it('accepts valid phone contact', () => {
    expect(
      ContactSchema.safeParse({
        name: 'Ahmad',
        contact: '+60123456789',
        message: 'Hello world!! This is a valid message.',
        turnstileToken: 'tok',
      }).success,
    ).toBe(true);
  });

  it('accepts phone with spaces and dashes', () => {
    expect(
      ContactSchema.safeParse({
        name: 'A',
        contact: '+60 12-345 6789',
        message: 'Hello world!!',
        turnstileToken: 'tok',
      }).success,
    ).toBe(true);
  });

  it('rejects short message', () => {
    expect(
      ContactSchema.safeParse({ name: 'A', contact: 'a@b.com', message: 'hi', turnstileToken: 'tok' })
        .success,
    ).toBe(false);
  });

  it('rejects empty name', () => {
    expect(
      ContactSchema.safeParse({
        name: '',
        contact: 'a@b.com',
        message: 'Hello world!!',
        turnstileToken: 'tok',
      }).success,
    ).toBe(false);
  });

  it('rejects invalid contact (neither email nor phone)', () => {
    expect(
      ContactSchema.safeParse({
        name: 'A',
        contact: 'not-an-email-or-phone',
        message: 'Hello world!!',
        turnstileToken: 'tok',
      }).success,
    ).toBe(false);
  });

  it('accepts a missing turnstileToken so the form cannot deadlock', () => {
    // Deliberate behaviour change. Requiring a token client-side meant that
    // when the Turnstile site key was absent in production the widget never
    // rendered, the token was always empty, and nobody could submit the form.
    // Verification is now enforced server-side, where the secret actually lives
    // (app/api/contact/route.ts).
    expect(
      ContactSchema.safeParse({ name: 'A', contact: 'a@b.com', message: 'Hello world!!', turnstileToken: '' })
        .success,
    ).toBe(true);
  });

  it('allows optional honeypot website field', () => {
    expect(
      ContactSchema.safeParse({
        name: 'A',
        contact: 'a@b.com',
        message: 'Hello world!!',
        turnstileToken: 'tok',
        website: '',
      }).success,
    ).toBe(true);
  });

  it('trims name and contact', () => {
    const res = ContactSchema.safeParse({
      name: '  A  ',
      contact: '  a@b.com  ',
      message: 'Hello world!!',
      turnstileToken: 'tok',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.name).toBe('A');
      expect(res.data.contact).toBe('a@b.com');
    }
  });

  it('rejects name over 100 chars', () => {
    expect(
      ContactSchema.safeParse({
        name: 'a'.repeat(101),
        contact: 'a@b.com',
        message: 'Hello world!!',
        turnstileToken: 'tok',
      }).success,
    ).toBe(false);
  });

  it('rejects message over 2000 chars', () => {
    expect(
      ContactSchema.safeParse({
        name: 'A',
        contact: 'a@b.com',
        message: 'a'.repeat(2001),
        turnstileToken: 'tok',
      }).success,
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// verifyTurnstile
// ---------------------------------------------------------------------------
describe('verifyTurnstile', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  it('calls siteverify with FormData and returns true on success', async () => {
    const { verifyTurnstile } = await import('@/lib/turnstile');
    const result = await verifyTurnstile('tok123', '1.2.3.4');
    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body.get('secret')).toBe('test-secret');
    expect(body.get('response')).toBe('tok123');
    expect(body.get('remoteip')).toBe('1.2.3.4');
  });

  it('omits remoteip when ip not provided', async () => {
    const { verifyTurnstile } = await import('@/lib/turnstile');
    await verifyTurnstile('tok123');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;
    expect(body.get('remoteip')).toBeNull();
  });

  it('returns false when siteverify says failure', async () => {
    fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { verifyTurnstile } = await import('@/lib/turnstile');
    const result = await verifyTurnstile('bad');
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checkRateLimit
// ---------------------------------------------------------------------------
describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('allows first 5 requests per minute', async () => {
    const { checkRateLimit, _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();
    const ip = `test-ip-min-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
  });

  it('blocks 6th request within same minute with retryAfter', async () => {
    const { checkRateLimit, _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();
    const ip = `test-ip-block-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(ip);
    const res = checkRateLimit(ip);
    expect(res.allowed).toBe(false);
    expect(res.retryAfter).toBeDefined();
    expect(typeof res.retryAfter).toBe('number');
  });

  it('allows after minute window passes', async () => {
    const { checkRateLimit, _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();
    const ip = `test-ip-window-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(false);
    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  it('enforces 20 per hour limit', async () => {
    const { checkRateLimit, _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();
    const ip = `test-ip-hour-${Date.now()}-${Math.random()}`;
    // 20 requests spaced 3 minutes apart to avoid hitting 5/min but hitting 20/hour
    for (let i = 0; i < 20; i++) {
      const r = checkRateLimit(ip);
      expect(r.allowed).toBe(true);
      vi.advanceTimersByTime(3 * 60_000);
    }
    // 21st within hour should be blocked
    const blocked = checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sendTelegram / sendEmail
// ---------------------------------------------------------------------------
describe('sendTelegram', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('posts to telegram with correct payload shape', async () => {
    const { sendTelegram } = await import('@/lib/contact');
    await sendTelegram({
      name: 'Ahmad',
      contact: 'ahmad@example.com',
      message: 'Hello world!! Need a website.',
      topic: 'general',
      turnstileToken: 'tok',
    }, { verified: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.telegram.org/bottest-token/sendMessage');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.chat_id).toBe('test-chat');
    expect(body.parse_mode).toBe('HTML');
    const text = body.text as string;
    // Keep ContactController.php:16 shape: Name / Contact / Message
    expect(text).toContain('Ahmad');
    expect(text).toContain('ahmad@example.com');
    expect(text).toContain('Hello world!! Need a website.');
    expect(text).toContain('New finchtech.my enquiry');
  });

  it('throws on non-ok telegram response', async () => {
    fetchMock = vi.fn(async () => new Response('err', { status: 500 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { sendTelegram } = await import('@/lib/contact');
    await expect(
      sendTelegram({ name: 'A', contact: 'a@b.com', message: 'Hello world!!', topic: 'general', turnstileToken: 'tok' }, { verified: true }),
    ).rejects.toThrow(/telegram/);
  });
});

describe('sendEmail', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ messageId: 'x' }), { status: 201 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.BREVO_API_KEY = 'brevo-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@finchtech.my';
    process.env.CONTACT_TO_EMAIL = 'support@finchtech.my';
    delete process.env.SENDER_API_KEY;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.BREVO_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.SENDER_API_KEY;
  });

  it('posts to Brevo with correct shape when BREVO_API_KEY set', async () => {
    const { sendEmail } = await import('@/lib/contact');
    await sendEmail({
      name: 'Ahmad',
      contact: 'ahmad@example.com',
      message: 'Hello world!! Need a website.',
      topic: 'general',
      turnstileToken: 'tok',
    }, { verified: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['api-key'] ?? (init.headers as Headers)?.get?.('api-key')).toBeTruthy();
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect((body.sender as Record<string, string>).email).toBe('noreply@finchtech.my');
    const to = body.to as Array<Record<string, string>>;
    expect(to[0].email).toBe('support@finchtech.my');
    expect(body.subject).toContain('Ahmad');
    expect(body.htmlContent).toBeDefined();
    expect(body.textContent).toBeDefined();
    // html and text should contain contact + message
    expect(body.htmlContent as string).toContain('ahmad@example.com');
    expect(body.textContent as string).toContain('Hello world!!');
  });

  it('falls back to Sender.net when SENDER_API_KEY set and BREVO_API_KEY absent', async () => {
    delete process.env.BREVO_API_KEY;
    process.env.SENDER_API_KEY = 'sender-key';
    // Need fresh import to re-evaluate? sendEmail reads env at call time, so same module works
    const { sendEmail } = await import('@/lib/contact');
    await sendEmail({
      name: 'Ahmad',
      contact: 'ahmad@example.com',
      message: 'Hello world!! Need a website.',
      topic: 'general',
      turnstileToken: 'tok',
    }, { verified: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('sender.net');
  });

  it('throws on Brevo non-ok', async () => {
    fetchMock = vi.fn(async () => new Response('err', { status: 400 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { sendEmail } = await import('@/lib/contact');
    await expect(
      sendEmail({ name: 'A', contact: 'a@b.com', message: 'Hello world!!', topic: 'general', turnstileToken: 'tok' }, { verified: true }),
    ).rejects.toThrow();
  });
});

