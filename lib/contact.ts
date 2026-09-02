import { z } from 'zod';

/**
 * Contact enquiry schema — shared by the client form and the Route Handler.
 *
 * `turnstileToken` is intentionally OPTIONAL here.
 *
 * The previous version required a non-empty token on the client. When the
 * Turnstile site key was absent in production the widget never rendered, so the
 * token was always empty and every submission was rejected client-side against
 * a control the user could not see or complete. The form was unsubmittable by
 * anyone, silently, for the entire time it was deployed.
 *
 * Verification policy now lives on the server (see app/api/contact/route.ts):
 * if the server has a secret configured it verifies the token and rejects
 * failures; if it does not, it accepts the submission and marks it unverified,
 * relying on the honeypot and rate limiter. The user is never blocked by a
 * misconfiguration they cannot act on.
 */

export const ENQUIRY_TOPICS = [
  { value: 'nexmenu', label: 'NexMenu — restaurant system' },
  { value: 'support', label: 'Product support' },
  { value: 'integration', label: 'Integration enquiry' },
  { value: 'partnership', label: 'Partnership or payment provider' },
  { value: 'general', label: 'Something else' },
] as const;

export type EnquiryTopic = (typeof ENQUIRY_TOPICS)[number]['value'];

const TOPIC_VALUES = ENQUIRY_TOPICS.map((t) => t.value) as [EnquiryTopic, ...EnquiryTopic[]];

export const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name').max(100),
  contact: z
    .string()
    .trim()
    .min(5, 'Please add an email or phone number')
    .max(255)
    .refine(
      (v) => z.string().email().safeParse(v).success || /^\+?[\d\s\-()]{8,20}$/.test(v),
      'Enter a valid email address or Malaysian phone number',
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a little more detail (at least 10 characters)')
    .max(2000, 'Please keep this under 2000 characters'),
  topic: z.enum(TOPIC_VALUES).default('general'),
  /** Optional by design — see note above. */
  turnstileToken: z.string().optional().default(''),
  /** Honeypot. Bots fill it; humans never see it. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export function topicLabel(topic: string): string {
  return ENQUIRY_TOPICS.find((t) => t.value === topic)?.label ?? 'General enquiry';
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

export interface DeliveryContext {
  verified: boolean;
}

export async function sendTelegram(input: ContactInput, ctx: DeliveryContext): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('telegram not configured');

  const text =
    `<b>New finchtech.my enquiry</b>\n\n` +
    `<b>Topic:</b> ${escapeHtml(topicLabel(input.topic))}\n` +
    `<b>Name:</b> ${escapeHtml(input.name)}\n` +
    `<b>Contact:</b> ${escapeHtml(input.contact)}\n` +
    `<b>Verified:</b> ${ctx.verified ? 'yes' : 'no (challenge unavailable)'}\n\n` +
    `<b>Message:</b>\n${escapeHtml(input.message)}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

export async function sendEmail(input: ContactInput, ctx: DeliveryContext): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!fromEmail || !toEmail) throw new Error('email not configured');

  const subject = `[${topicLabel(input.topic)}] Enquiry from ${input.name}`;
  const textContent =
    `New enquiry from finchtech.my\n\n` +
    `Topic: ${topicLabel(input.topic)}\n` +
    `Name: ${input.name}\n` +
    `Contact: ${input.contact}\n` +
    `Challenge verified: ${ctx.verified ? 'yes' : 'no'}\n\n` +
    `Message:\n${input.message}\n`;
  const htmlContent =
    `<p><strong>Topic:</strong> ${escapeHtml(topicLabel(input.topic))}</p>` +
    `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>` +
    `<p><strong>Contact:</strong> ${escapeHtml(input.contact)}</p>` +
    `<p><strong>Challenge verified:</strong> ${ctx.verified ? 'yes' : 'no'}</p>` +
    `<p><strong>Message:</strong></p><p>${escapeHtml(input.message).replace(/\n/g, '<br />')}</p>`;

  if (process.env.BREVO_API_KEY) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { email: fromEmail, name: 'finchtech.my' },
        to: [{ email: toEmail }],
        replyTo: looksLikeEmail(input.contact) ? { email: input.contact } : undefined,
        subject,
        htmlContent,
        textContent,
      }),
    });
    if (!res.ok) throw new Error(`brevo ${res.status}`);
    return;
  }

  if (process.env.SENDER_API_KEY) {
    const res = await fetch('https://api.sender.net/v2/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
      },
      body: JSON.stringify({
        from: { email: fromEmail },
        to: [{ email: toEmail }],
        subject,
        html: htmlContent,
        text: textContent,
      }),
    });
    if (!res.ok) throw new Error(`sender ${res.status}`);
    return;
  }

  throw new Error('no email provider configured');
}

function looksLikeEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
