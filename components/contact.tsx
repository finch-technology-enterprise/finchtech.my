'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ContactSchema } from '@/lib/contact';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type FieldErrors = { name?: string[]; contact?: string[]; message?: string[]; turnstileToken?: string[] };

const INITIAL = { name: '', contact: '', message: '', website: '', turnstileToken: '' };

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
      getResponse: (id?: string) => string;
    };
    onTurnstileCallback?: (token: string) => void;
  }
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  const onVerify = useCallback((token: string) => {
    setForm((f) => ({ ...f, turnstileToken: token }));
    setErrors((e) => ({ ...e, turnstileToken: undefined }));
  }, []);

  // Expose global callback for Turnstile script (raw div mode uses data-callback)
  useEffect(() => {
    window.onTurnstileCallback = onVerify;
    return () => {
      window.onTurnstileCallback = undefined;
    };
  }, [onVerify]);

  // Render Turnstile widget via explicit render when script is ready.
  // Uses raw cf-turnstile API: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
  // Env: NEXT_PUBLIC_TURNSTILE_SITE_KEY (public site key). Secret is TURNSTILE_SECRET_KEY (server, never exposed).
  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    const tryRender = () => {
      if (!turnstileRef.current || widgetIdRef.current) return;
      const w = window.turnstile;
      if (!w?.render) return;
      // Clear any previous fallback content
      try {
        widgetIdRef.current = w.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'expired-callback': () => setForm((f) => ({ ...f, turnstileToken: '' })),
          'error-callback': () => setForm((f) => ({ ...f, turnstileToken: '' })),
        });
      } catch {
        // turnstile may throw if already rendered
      }
    };

    // If script already loaded
    tryRender();

    // Watch for script load: poll briefly and also listen for load event on the script tag
    const script = document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]');
    const onLoad = () => tryRender();
    script?.addEventListener('load', onLoad);

    // Fallback poll for async script injection (up to ~3s)
    let tries = 0;
    const poll = window.setInterval(() => {
      if (widgetIdRef.current || tries++ > 15) {
        window.clearInterval(poll);
        return;
      }
      tryRender();
    }, 200);

    return () => {
      script?.removeEventListener('load', onLoad);
      window.clearInterval(poll);
    };
  }, [siteKey, onVerify]);

  const resetTurnstile = useCallback(() => {
    try {
      window.turnstile?.reset(widgetIdRef.current ?? undefined);
    } catch {
      // ignore
    }
    // Also clear token; expired/error callbacks will also fire but be explicit
    setForm((f) => ({ ...f, turnstileToken: '' }));
  }, []);

  function validate(): boolean {
    const res = ContactSchema.safeParse({
      name: form.name,
      contact: form.contact,
      message: form.message,
      turnstileToken: form.turnstileToken,
      website: form.website,
    });
    if (res.success) {
      setErrors({});
      return true;
    }
    const flat = res.error.flatten();
    setErrors(flat.fieldErrors as FieldErrors);
    return false;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setPending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          message: form.message,
          turnstileToken: form.turnstileToken,
          website: form.website,
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        message: string;
        fieldErrors?: { fieldErrors: FieldErrors };
        warnings?: string[];
      };
      if (!res.ok || !json.success) {
        if (json.fieldErrors?.fieldErrors) {
          setErrors(json.fieldErrors.fieldErrors as FieldErrors);
        }
        toast.error(json.message || 'Something went wrong. Try again.');
        // Turnstile token is single-use; reset so user can retry
        resetTurnstile();
        return;
      }
      toast.success(json.message);
      if (json.warnings?.length) {
        toast.warning(json.warnings.join(' '));
      }
      setForm(INITIAL);
      setErrors({});
      setSuccess(true);
      resetTurnstile();
    } catch {
      toast.error('Network error. Please try again or reach us on WhatsApp.');
      resetTurnstile();
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" aria-label="Contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Tell us about your project. We usually respond within one business day.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left column — keep index.blade.php:430 copy targets */}
        <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div>
            <h3 className="text-sm font-semibold">Get in touch</h3>
            <p className="mt-1 text-sm text-slate-600">Prefer email or WhatsApp? Reach us directly — no form needed.</p>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</div>
              <a
                href="mailto:support@finchtech.my"
                className="font-medium text-slate-900 hover:underline"
              >
                support@finchtech.my
              </a>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">WhatsApp</div>
              <a
                href="https://wa.me/60164525797"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 hover:underline"
              >
                wa.me/60164525797
              </a>
            </div>
            <div className="pt-2 text-xs leading-relaxed text-slate-500">
              Operations Center: 5B, Jalan BPU 5, Bandar Puchong Utama, 47100 Puchong, Selangor.
            </div>
          </div>
        </div>

        {/* Right — form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Honeypot — hidden from users, bots fill it */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              disabled={pending}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1 text-xs text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-contact" className="mb-1.5 block text-sm font-medium">
              Email or WhatsApp
            </label>
            <Input
              id="contact-contact"
              name="contact"
              autoComplete="email"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="you@example.com or +60 1X-XXXX XXXX"
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? 'contact-contact-error' : undefined}
              disabled={pending}
            />
            {errors.contact && (
              <p id="contact-contact-error" className="mt-1 text-xs text-red-400">
                {errors.contact[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <Textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="How can we help?"
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              disabled={pending}
            />
            {errors.message && (
              <p id="contact-message-error" className="mt-1 text-xs text-red-400">
                {errors.message[0]}
              </p>
            )}
          </div>

          {/* Turnstile — raw cf-turnstile div + script (no @marsidev/react-turnstile).
              Public site key via NEXT_PUBLIC_TURNSTILE_SITE_KEY; secret stays server-only.
              Script is injected in app/layout or here; we render explicitly so we can reset on success. */}
          <div>
            {siteKey ? (
              <div
                ref={turnstileRef}
                className="cf-turnstile min-h-[65px]"
                data-sitekey={siteKey}
                data-callback="onTurnstileCallback"
              />
            ) : (
              <p className="text-xs opacity-50">Verification not configured (set NEXT_PUBLIC_TURNSTILE_SITE_KEY).</p>
            )}
            {errors.turnstileToken && (
              <p id="contact-turnstile-error" className="mt-1 text-xs text-red-400" role="alert">
                {errors.turnstileToken[0]}
              </p>
            )}
          </div>

          {/* Load Turnstile script once */}
          {siteKey && (
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer />
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Sending…' : 'Send message'}
          </Button>

          {success && (
            <p className="text-center text-sm text-emerald-400" role="status">
              Your message has been sent successfully. We will get back to you soon!
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
