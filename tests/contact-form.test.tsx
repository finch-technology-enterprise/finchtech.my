import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
});
