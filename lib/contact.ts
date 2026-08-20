import { z } from 'zod';

/**
 * Contact form schema — shared between client and Route Handler.
 * Mirrors ContactController.php:12 bounds (name 255→100, contact 255, message 2000)
 * tightened with turnstileToken + honeypot website.
 */
export const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z
    .string()
    .trim()
    .min(5)
    .max(255)
    .refine(
      (v) => z.string().email().safeParse(v).success || /^\+?[\d\s\-()]{8,20}$/.test(v),
      'Enter a valid email or WhatsApp number',
    ),
  message: z.string().trim().min(10).max(2000),
  turnstileToken: z.string().min(1, 'Complete the verification'),
  website: z.string().optional(), // honeypot — if filled, silently succeed without delivery
});

export type ContactInput = z.infer<typeof ContactSchema>;

// ---------------------------------------------------------------------------
// Delivery — Telegram + Email (Brevo primary, Sender.net fallback)
// ---------------------------------------------------------------------------

/**
 * Provider choice: Brevo is primary (BREVO_API_KEY). If SENDER_API_KEY is set
 * and BREVO_API_KEY is absent, fallback to Sender.net. Document choice:
 * Brevo preferred for transactional SMTP deliverability + EU infra; Sender.net
 * is a drop-in alternative for teams already on that platform. Switch by
 * setting only one of the two keys in env/.dev.vars.
 */
export async function sendTelegram(input: ContactInput): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('telegram not configured');
  const text =
    `📩 <b>New Contact</b>\n\n` +
    `👤 <b>Name:</b> ${escapeHtml(input.name)}\n` +
    `📱 <b>Contact:</b> ${escapeHtml(input.contact)}\n` +
    `💬 <b>Message:</b>\n${escapeHtml(input.message)}`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

export async function sendEmail(input: ContactInput): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!fromEmail || !toEmail) throw new Error('email not configured');

  const subject = `New finchtech.my enquiry — ${input.name}`;
  const textContent =
    `New contact enquiry\n\n` +
    `Name: ${input.name}\n` +
    `Contact: ${input.contact}\n\n` +
    `Message:\n${input.message}\n`;
  const htmlContent =
    `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>` +
    `<p><strong>Contact:</strong> ${escapeHtml(input.contact)}</p>` +
    `<p><strong>Message:</strong></p><p>${escapeHtml(input.message).replace(/\n/g, '<br />')}</p>`;

  // Brevo primary
  if (process.env.BREVO_API_KEY) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: fromEmail },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
        textContent,
      }),
    });
    if (!res.ok) throw new Error(`brevo ${res.status}`);
    return;
  }

  // Sender.net fallback — same logical payload, Sender.net endpoint/shape
  if (process.env.SENDER_API_KEY) {
    const res = await fetch('https://api.sender.net/v2/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
      },
      body: JSON.stringify({
        from: { email: fromEmail },
        recipients: [{ email: toEmail }],
        to: [{ email: toEmail }],
        subject,
        html: htmlContent,
        text: textContent,
        htmlContent,
        textContent,
      }),
    });
    if (!res.ok) throw new Error(`sender ${res.status}`);
    return;
  }

  throw new Error('no email provider configured (set BREVO_API_KEY or SENDER_API_KEY)');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
