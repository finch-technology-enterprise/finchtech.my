import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper to build a NextRequest-like Request
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
  message: 'Hello world!! Need a website for my shop.',
  turnstileToken: 'tok-valid',
};

describe('POST /api/contact', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    // clean rate-limit buckets between tests
    const { _resetRateLimit } = await import('@/lib/rate-limit');
    _resetRateLimit();

    // Default env for delivery + turnstile (so sendTelegram/sendEmail reach fetch instead of throwing "not configured")
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat';
    process.env.BREVO_API_KEY = 'brevo-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@finchtech.my';
    process.env.CONTACT_TO_EMAIL = 'support@finchtech.my';
    delete process.env.SENDER_API_KEY;

    // Default fetch mock: turnstile success + telegram + brevo success
    fetchMock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('challenges.cloudflare.com/turnstile')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (u.includes('api.telegram.org')) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      if (u.includes('api.brevo.com')) {
        return new Response(JSON.stringify({ messageId: 'x' }), { status: 201 });
      }
      if (u.includes('api.sender.net')) {
        return new Response(JSON.stringify({ messageId: 'x' }), { status: 202 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    delete process.env.BREVO_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.SENDER_API_KEY;
  });

  it('400 on invalid body', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req({}));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { success: boolean; fieldErrors?: unknown };
    expect(json.success).toBe(false);
    expect(json.fieldErrors).toBeDefined();
  });

  it('honeypot website → silent 200 without delivery', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req({ ...validBody, website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(true);
    expect(json.message).toBe('Your message has been sent successfully. We will get back to you soon!');
    // honeypot must not call delivery (no telegram/brevo/turnstile fetch)
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('429 on rate limit', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const ip = `test-ip-429-${Date.now()}-${Math.random()}`;
    const headers = { 'x-forwarded-for': ip };
    // Fill 5/min bucket
    for (let i = 0; i < 5; i++) {
      const r = await POST(req(validBody, headers));
      expect(r.status).toBe(200);
    }
    const blocked = await POST(req(validBody, headers));
    expect(blocked.status).toBe(429);
    const json = (await blocked.json()) as { success: boolean };
    expect(json.success).toBe(false);
    expect(blocked.headers.get('Retry-After')).toBeDefined();
  });

  it('400 when Turnstile verification fails', async () => {
    fetchMock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('challenges.cloudflare.com/turnstile')) {
        return new Response(JSON.stringify({ success: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody, { 'x-forwarded-for': `turnstile-fail-${Date.now()}` }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Verification failed/i);
  });

  it('200 with warnings when one channel fails', async () => {
    fetchMock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('challenges.cloudflare.com/turnstile')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (u.includes('api.telegram.org')) {
        return new Response('err', { status: 500 });
      }
      if (u.includes('api.brevo.com')) {
        return new Response(JSON.stringify({ messageId: 'x' }), { status: 201 });
      }
      return new Response('err', { status: 500 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody, { 'x-forwarded-for': `warnings-${Date.now()}` }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean; warnings?: string[] };
    expect(json.success).toBe(true);
    expect(json.warnings).toBeDefined();
    expect(json.warnings!.length).toBeGreaterThan(0);
  });

  it('502 when both channels fail', async () => {
    fetchMock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes('challenges.cloudflare.com/turnstile')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // both telegram + brevo fail
      return new Response('err', { status: 500 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody, { 'x-forwarded-for': `both-fail-${Date.now()}` }));
    expect(res.status).toBe(502);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Could not deliver/i);
  });

  it('200 on valid body → delivers and returns success copy', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(req(validBody, { 'x-forwarded-for': `ok-${Date.now()}-${Math.random()}` }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(true);
    expect(json.message).toBe('Your message has been sent successfully. We will get back to you soon!');
  });
});

describe('GET /api/health', () => {
  it('returns {ok:true, at: ISO string}', async () => {
    const { GET } = await import('@/app/api/health/route');
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; at: string };
    expect(json.ok).toBe(true);
    expect(typeof json.at).toBe('string');
    expect(() => new Date(json.at).toISOString()).not.toThrow();
  });
});
