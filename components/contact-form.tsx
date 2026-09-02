'use client';

import * as React from 'react';
import Script from 'next/script';
import { toast } from 'sonner';
import { ContactSchema, ENQUIRY_TOPICS, type EnquiryTopic } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import { trackConversion } from '@/lib/analytics';

/**
 * Contact form.
 *
 * Fixes the audit's P0-2. Previously:
 *  - The Turnstile widget only rendered when NEXT_PUBLIC_TURNSTILE_SITE_KEY was
 *    set, but the schema required a token unconditionally. With the key missing
 *    in production, every submission failed with "Complete the verification"
 *    against a widget that was never displayed.
 *  - When the key was absent the UI printed the literal environment variable
 *    name to visitors.
 *
 * Now:
 *  - The token is optional in the shared schema. The server decides whether
 *    verification is required based on its own configuration, so the client can
 *    never deadlock against a control that does not exist.
 *  - If the widget is unavailable the form still submits; the server applies
 *    rate limiting and honeypot checks, and flags the submission as unverified.
 *  - No environment variable name is ever rendered.
 */

type FieldErrors = Partial<Record<'name' | 'contact' | 'message' | 'topic', string[]>>;

const INITIAL = {
  name: '',
  contact: '',
  message: '',
  topic: 'nexmenu' as EnquiryTopic,
  website: '',
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const FIELD =
  'flex w-full rounded-lg border border-border bg-surface px-4 text-base text-fg shadow-card transition-[border-color,box-shadow] duration-200 placeholder:text-fg-subtle hover:border-border-strong focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/25 disabled:cursor-not-allowed disabled:opacity-60';

export function ContactForm() {
  const [form, setForm] = React.useState(INITIAL);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [pending, setPending] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [scriptReady, setScriptReady] = React.useState(false);

  const widgetRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const statusRef = React.useRef<HTMLParagraphElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  // Render the widget once the script signals readiness. No polling: next/script
  // gives us a deterministic onLoad, which the previous 15-attempt interval
  // fallback was working around.
  React.useEffect(() => {
    if (!siteKey || !scriptReady || widgetIdRef.current) return;
    const el = widgetRef.current;
    const api = window.turnstile;
    if (!el || !api?.render) return;
    try {
      widgetIdRef.current = api.render(el, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    } catch {
      // Widget already rendered, or the challenge could not initialise. The
      // form remains submittable; the server decides how to treat it.
    }
  }, [siteKey, scriptReady]);

  const resetWidget = React.useCallback(() => {
    setToken('');
    try {
      window.turnstile?.reset(widgetIdRef.current ?? undefined);
    } catch {
      /* non-fatal */
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = ContactSchema.safeParse({
      name: form.name,
      contact: form.contact,
      message: form.message,
      topic: form.topic,
      turnstileToken: token,
      website: form.website,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as FieldErrors;
      setErrors(fieldErrors);
      // Move focus to the first invalid field for keyboard/screen-reader users.
      const firstKey = (['name', 'contact', 'message'] as const).find((k) => fieldErrors[k]);
      if (firstKey) document.getElementById(`contact-${firstKey}`)?.focus();
      return;
    }

    setErrors({});
    setPending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        success: boolean;
        message: string;
        fieldErrors?: { fieldErrors?: FieldErrors };
      };

      if (!res.ok || !json.success) {
        if (json.fieldErrors?.fieldErrors) setErrors(json.fieldErrors.fieldErrors);
        toast.error(json.message || 'Something went wrong. Please try again.');
        trackConversion('contact_submit_failure', form.topic);
        resetWidget();
        return;
      }

      toast.success(json.message);
      trackConversion('contact_submit_success', form.topic);
      setForm(INITIAL);
      resetWidget();
      statusRef.current?.focus();
    } catch {
      toast.error('Network problem — please try again, or message us on WhatsApp.');
      trackConversion('contact_submit_failure', form.topic);
      resetWidget();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-2 block text-sm font-semibold text-fg">
          What is this about?
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={form.topic}
          onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value as EnquiryTopic }))}
          disabled={pending}
          className={`${FIELD} h-12 appearance-none bg-[length:1.25rem] pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.85rem center',
          }}
        >
          {ENQUIRY_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-fg">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          disabled={pending}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className={`${FIELD} h-12`}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-2 text-sm text-danger">
            {errors.name[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-contact" className="mb-2 block text-sm font-semibold text-fg">
          Email or WhatsApp number
        </label>
        <input
          id="contact-contact"
          name="contact"
          autoComplete="email"
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          placeholder="you@example.com or +60 1X-XXX XXXX"
          disabled={pending}
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? 'contact-contact-error' : undefined}
          className={`${FIELD} h-12`}
        />
        {errors.contact ? (
          <p id="contact-contact-error" className="mt-2 text-sm text-danger">
            {errors.contact[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-fg">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us a little about your business and what you need."
          disabled={pending}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${FIELD} min-h-[140px] py-3`}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-2 text-sm text-danger">
            {errors.message[0]}
          </p>
        ) : null}
      </div>

      {/* Anti-bot widget. When unavailable this area simply stays empty — it
          never surfaces configuration details, and never blocks submission. */}
      {siteKey ? <div ref={widgetRef} className="min-h-[65px]" /> : null}

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? 'Sending…' : 'Send enquiry'}
      </Button>

      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="text-sm text-fg-subtle"
      >
        We usually reply within one business day.
      </p>
    </form>
  );
}
