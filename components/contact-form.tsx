'use client';

import * as React from 'react';
import Script from 'next/script';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContactSchema, ENQUIRY_TOPICS, type EnquiryTopic } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import { TrackedLink } from '@/components/ui/tracked-link';
import { COMPANY, MAILTO, whatsappUrl } from '@/lib/company';
import { trackConversion } from '@/lib/analytics';

/** Frames the WhatsApp fallback around whatever the visitor selected. */
const TOPIC_CONTEXT: Record<EnquiryTopic, string> = {
  nexmenu: 'NexMenu',
  support: 'product support',
  integration: 'an integration',
  partnership: 'a partnership',
  general: undefined as unknown as string,
};

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
  /**
   * True when the anti-bot challenge cannot run at all — blocked host, failed
   * script, or a widget that errored. The server requires a verified token
   * whenever it holds a secret, so in this state the form genuinely cannot be
   * submitted and we must say so and offer a route that works, rather than
   * letting the customer retry into a permanent 400.
   */
  const [challengeUnavailable, setChallengeUnavailable] = React.useState(false);
  /** Challenge is available but the visitor has not completed it yet. */
  const [challengeIncomplete, setChallengeIncomplete] = React.useState(false);

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
    if (!el || !api?.render) {
      setChallengeUnavailable(true);
      return;
    }
    try {
      widgetIdRef.current = api.render(el, {
        sitekey: siteKey,
        callback: (t: string) => {
          setToken(t);
          setChallengeUnavailable(false);
          setChallengeIncomplete(false);
        },
        'expired-callback': () => setToken(''),
        'error-callback': () => {
          setToken('');
          setChallengeUnavailable(true);
        },
      });
    } catch {
      setChallengeUnavailable(true);
    }
  }, [siteKey, scriptReady]);

  // If the challenge script never loads (blocked host, offline, blocker), stop
  // waiting and surface the alternative channels.
  React.useEffect(() => {
    if (!siteKey || scriptReady) return;
    const timer = window.setTimeout(() => {
      if (!window.turnstile?.render) setChallengeUnavailable(true);
    }, 8000);
    return () => window.clearTimeout(timer);
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

    // The challenge is present but not yet solved. That is a different problem
    // from the challenge being unreachable: the visitor can fix it by
    // completing the check, so ask them to — do not send them to WhatsApp, and
    // do not spend a request on a submission the server will reject.
    if (siteKey && !challengeUnavailable && !token) {
      setChallengeIncomplete(true);
      widgetRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setChallengeIncomplete(false);

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
        challengeFailed?: boolean;
        fieldErrors?: { fieldErrors?: FieldErrors };
      };

      if (!res.ok || !json.success) {
        if (json.fieldErrors?.fieldErrors) setErrors(json.fieldErrors.fieldErrors);
        // A challenge rejection is not something the customer can fix by
        // retrying — surface the persistent fallback panel instead of a toast
        // that disappears after a few seconds.
        if (res.status === 400 && json.challengeFailed) {
          setChallengeUnavailable(true);
        } else {
          toast.error(json.message || 'Something went wrong. Please try again.');
        }
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

      {/* Anti-bot widget. Never surfaces configuration details to the visitor. */}
      {siteKey ? (
        <div>
          <div ref={widgetRef} className={challengeUnavailable ? 'hidden' : 'min-h-[65px]'} />
          {challengeIncomplete ? (
            <p role="alert" className="mt-2 text-sm text-danger">
              Please complete the spam check above, then send your enquiry.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Challenge cannot run — the server will reject any submission, so give
          the customer an honest explanation and a channel that actually works
          instead of a "please try again" they can never satisfy. */}
      {challengeUnavailable ? (
        <div
          role="alert"
          className="rounded-lg border border-border bg-surface-sunken p-5 text-sm"
        >
          <p className="font-semibold text-fg">This form can&apos;t be sent from your connection</p>
          <p className="mt-2 leading-relaxed text-fg-muted">
            Our spam check could not load — this is usually a browser extension, a company network
            or an ad blocker. Please reach us directly instead. We reply to both.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <TrackedLink
              href={whatsappUrl(TOPIC_CONTEXT[form.topic])}
              event="whatsapp_click"
              placement="contact_form_fallback"
              attribute={false}
              variant="whatsapp"
              size="md"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp us
            </TrackedLink>
            <TrackedLink
              href={MAILTO}
              event="email_click"
              placement="contact_form_fallback"
              attribute={false}
              variant="secondary"
              size="md"
              target={undefined}
              rel={undefined}
            >
              {COMPANY.email}
            </TrackedLink>
          </div>
        </div>
      ) : null}

      <Button type="submit" size="lg" full disabled={pending || challengeUnavailable}>
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
