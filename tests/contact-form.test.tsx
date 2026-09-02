import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact-form';

/**
 * Contact form coverage — this is the audit's P0-2.
 *
 * The critical case is "Turnstile unavailable". Previously the widget failed to
 * render without a site key, yet the client schema demanded a token, so nobody
 * could submit. The form must now degrade gracefully instead.
 */

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({ toast: { success: (m: string) => toastSuccess(m), error: (m: string) => toastError(m) } }));
vi.mock('next/script', () => ({ default: () => null }));

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), 'Siti Rahman');
  await user.type(screen.getByLabelText(/email or whatsapp/i), 'siti@example.com');
  await user.type(screen.getByLabelText(/how can we help/i), 'I run a cafe in Puchong and want to try NexMenu.');
}

describe('ContactForm', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: true, message: 'Thank you — your enquiry has been sent.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('submits successfully when the anti-bot widget is unavailable', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(toastSuccess).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('never renders an environment variable name to the visitor', () => {
    const { container } = render(<ContactForm />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/NEXT_PUBLIC/);
    expect(text).not.toMatch(/TURNSTILE/i);
    expect(text).not.toMatch(/not configured/i);
  });

  it('blocks submission and reports accessible errors when fields are invalid', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(globalThis.fetch).not.toHaveBeenCalled();

    const nameField = screen.getByLabelText(/your name/i);
    await waitFor(() => expect(nameField).toHaveAttribute('aria-invalid', 'true'));
    expect(nameField).toHaveAttribute('aria-describedby', 'contact-name-error');
    expect(document.getElementById('contact-name-error')).toBeInTheDocument();
  });

  it('rejects a message that is too short', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), 'Ali');
    await user.type(screen.getByLabelText(/email or whatsapp/i), 'ali@example.com');
    await user.type(screen.getByLabelText(/how can we help/i), 'hi');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(globalThis.fetch).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByLabelText(/how can we help/i)).toHaveAttribute('aria-invalid', 'true'),
    );
  });

  it('accepts a Malaysian phone number as the contact field', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), 'Ahmad');
    await user.type(screen.getByLabelText(/email or whatsapp/i), '+60 12-345 6789');
    await user.type(screen.getByLabelText(/how can we help/i), 'Please call me about NexMenu pricing.');
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
  });

  it('surfaces a server failure without losing what the user typed', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, message: 'Could not deliver.' }), { status: 502 }),
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Could not deliver.'));
    expect(screen.getByLabelText(/your name/i)).toHaveValue('Siti Rahman');
  });

  it('handles a network error by pointing at WhatsApp', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastError.mock.calls[0][0]).toMatch(/WhatsApp/i);
  });

  it('sends the selected enquiry topic', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.selectOptions(screen.getByLabelText(/what is this about/i), 'partnership');
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.topic).toBe('partnership');
  });

  it('exposes a polite live region for status updates', () => {
    render(<ContactForm />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  /**
   * The production defect this guards:
   *
   * With TURNSTILE_SECRET_KEY configured, the server correctly rejects any
   * submission without a verified token. But if the challenge host is blocked
   * (corporate network, ad blocker), the widget never renders — so the customer
   * saw a 4-second toast saying "please try again" against a check they could
   * never complete, with the form still enabled. A permanent dead end.
   *
   * The form must now explain the situation persistently and offer channels
   * that work.
   */
  it('shows a persistent fallback with WhatsApp and email when the challenge is rejected', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({
          success: false,
          challengeFailed: true,
          message: 'We could not complete the spam check. Please message us on WhatsApp or email instead.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      ),
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    // A persistent alert, not a transient toast.
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toMatch(/can't be sent from your connection/i);

    // Both working channels are offered.
    const whatsapp = within(alert).getByRole('link', { name: /whatsapp/i });
    expect(whatsapp.getAttribute('href')).toContain('wa.me/');
    const email = within(alert).getByRole('link', { name: /finchtech\.my/i });
    expect(email.getAttribute('href')).toContain('mailto:');

    // Submitting again cannot succeed, so the button is disabled.
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeDisabled();

    // Never blames the visitor or leaks configuration.
    expect(alert.textContent).not.toMatch(/TURNSTILE|NEXT_PUBLIC/i);
  });

  /**
   * "Challenge not completed yet" and "challenge cannot load" are different
   * problems with different remedies. Conflating them would either send a
   * solvable case to WhatsApp, or tell an unreachable case to keep retrying.
   * Without a site key configured (as in this test env) neither prompt applies
   * and the form submits normally.
   */
  it('submits without a challenge prompt when no site key is configured', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/complete the spam check above/i)).toBeNull();
    expect(screen.queryByText(/can't be sent from your connection/i)).toBeNull();
  });

  it('does not show the fallback for an ordinary server error', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, message: 'Could not deliver.' }), { status: 502 }),
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Could not deliver.'));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: /send enquiry/i })).not.toBeDisabled();
  });
});
