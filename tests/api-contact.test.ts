import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Contact API coverage.
 *
 * Core behaviours under test:
 *  - Turnstile is enforced only when the server is configured for it (the audit
 *    found the reverse: enforced client-side while unconfigured server-side,
 *    which made the form unsubmittable).
 *  - The honeypot silently absorbs bots.
 *  - Rate limiting protects the endpoint.
 *  - Delivery is best-effort across Telegram, email and a durable KV sink, so a
 *    single misconfiguration cannot lose a lead.
 */

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://test/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  }) as unknown as import('next/server').NextRequest;
}

const validBody = {
  name: 'Ahmad',
  contact: 'ahmad@example.com',
  message: 'Hello — I need a QR ordering system for my cafe.',
  topic: 'nexmenu',
  turnstileToken: 'tok-valid',
};

const kvPut = vi.fn(async () => {});
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: async () => ({ env: { CONTACT_INBOX: { put: kvPut } } }),
}));

describe('POST /api/contact', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const { _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();

    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat';
    process.env.BREVO_API_KEY = 'brevo-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@finchtech.my';
    process.env.CONTACT_TO_EMAIL = 'support@finchtech.my';
    delete process.env.SENDER_API_KEY;

    fetchMock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('challenges.cloudflare.com/turnstile')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (u.includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true }), { status: 200 });
      if (u.includes('api.brevo.com')) return new Response(JSON.stringify({ messageId: 'x' }), { status: 201 });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('accepts a valid verified submission', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    const json = (await res.json()) as { success: boolean; message: string };
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it('rejects an invalid payload with field errors', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req({ name: '', contact: 'x', message: 'short' }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { fieldErrors?: { fieldErrors: Record<string, string[]> } };
    expect(json.fieldErrors?.fieldErrors.name).toBeDefined();
  });

  it('silently absorbs honeypot submissions without delivering', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req({ ...validBody, website: 'http://spam.example' }));
    const json = (await res.json()) as { success: boolean };
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(kvPut).not.toHaveBeenCalled();
  });

  it('flags challenge rejections so the client can show a working fallback', async () => {
    fetchMock.mockImplementation(async (url: string | URL | Request) => {
      if (String(url).includes('turnstile')) {
        return new Response(JSON.stringify({ success: false }), { status: 200 });
      }
      return new Response('{}', { status: 200 });
    });
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    const json = (await res.json()) as { challengeFailed?: boolean; message: string };
    expect(res.status).toBe(400);
    expect(json.challengeFailed).toBe(true);
    // Must point at a channel that works, not tell the user to retry forever.
    expect(json.message).toMatch(/WhatsApp|email/i);
  });

  it('never accepts an unverified submission while a secret is configured', async () => {
    // Guards against "fix" the graceful-degradation path by simply accepting
    // missing tokens, which would be a trivial anti-spam bypass.
    const { POST } = await import('@/app/api/contact/route');
    for (const token of ['', 'forged', undefined]) {
      const body = { ...validBody, turnstileToken: token };
      if (token === undefined) delete (body as Record<string, unknown>).turnstileToken;
      fetchMock.mockImplementation(async (url: string | URL | Request) =>
        String(url).includes('turnstile')
          ? new Response(JSON.stringify({ success: false }), { status: 200 })
          : new Response('{}', { status: 200 }),
      );
      const res = await POST(req(body));
      expect(res.status, `token=${String(token)} must be rejected`).toBe(400);
    }
    expect(kvPut).not.toHaveBeenCalled();
  });

  it('rejects a failed challenge when verification is configured', async () => {
    fetchMock.mockImplementation(async (url: string | URL | Request) => {
      if (String(url).includes('turnstile')) {
        return new Response(JSON.stringify({ success: false }), { status: 200 });
      }
      return new Response('{}', { status: 200 });
    });
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    expect(res.status).toBe(400);
  });

  it('accepts submissions when no challenge secret is configured', async () => {
    // This is the production failure the audit found: no secret was set, so the
    // form must not deadlock. Delivery still proceeds.
    delete process.env.TURNSTILE_SECRET_KEY;
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req({ ...validBody, turnstileToken: '' }));
    const json = (await res.json()) as { success: boolean };
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // No token was verified, so siteverify must not have been called.
    const calls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(calls.some((u) => u.includes('turnstile'))).toBe(false);
  });

  it('persists the enquiry to the durable sink', async () => {
    const { POST } = await import('@/app/api/contact/route');
    await POST(req(validBody));
    expect(kvPut).toHaveBeenCalledTimes(1);
    const [, storedValue] = kvPut.mock.calls[0] as unknown as [string, string];
    const stored = JSON.parse(storedValue) as { name: string; topic: string };
    expect(stored.name).toBe('Ahmad');
    expect(stored.topic).toBe('nexmenu');
  });

  it('still succeeds when notification channels are unconfigured, via the sink', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.BREVO_API_KEY;
    delete process.env.SENDER_API_KEY;
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(kvPut).toHaveBeenCalledTimes(1);
  });

  it('succeeds when only one delivery channel works', async () => {
    fetchMock.mockImplementation(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('turnstile')) return new Response(JSON.stringify({ success: true }), { status: 200 });
      if (u.includes('telegram')) return new Response('fail', { status: 500 });
      if (u.includes('brevo')) return new Response(JSON.stringify({ ok: true }), { status: 201 });
      return new Response('{}', { status: 200 });
    });
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
  });

  it('rate limits repeated submissions from one address', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const headers = { 'cf-connecting-ip': '203.0.113.9' };
    for (let i = 0; i < 5; i++) {
      const ok = await POST(req(validBody, headers));
      expect(ok.status).toBe(200);
    }
    const limited = await POST(req(validBody, headers));
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).toBeTruthy();
  });

  it('handles malformed JSON without throwing', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const bad = new Request('http://test/api/contact', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    }) as unknown as import('next/server').NextRequest;
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });

  it('never leaks configuration details in responses', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.BREVO_API_KEY;
    delete process.env.SENDER_API_KEY;
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody));
    const text = await res.text();
    expect(text).not.toMatch(/API_KEY|SECRET|TURNSTILE|BREVO|TELEGRAM/i);
  });
});
