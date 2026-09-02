import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * First-party conversion event sink.
 *
 * Writes a single structured log line per business action. No cookies, no
 * identifiers, no cross-site state, no third-party requests — consistent with
 * the site's Privacy Policy ("only essential cookies", "no advertising
 * cookies"). Events are readable through Cloudflare Workers Observability,
 * which is already enabled for this Worker.
 *
 * Deliberately minimal: this answers "how many people clicked the NexMenu demo
 * this week", not "who". Attributing a specific visitor across a session would
 * require a real analytics product and a privacy-policy update.
 */

const ALLOWED_EVENTS = new Set([
  'nexmenu_demo',
  'nexmenu_signup',
  'nexmenu_pricing',
  'nexmenu_product',
  'nexmenu_outbound',
  'geraiku_outbound',
  'whatsapp_click',
  'email_click',
  'contact_submit_success',
  'contact_submit_failure',
]);

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const body = payload as Record<string, unknown>;
  const event = typeof body.event === 'string' ? body.event : null;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return new NextResponse(null, { status: 204 });
  }

  const placement = typeof body.placement === 'string' ? body.placement.slice(0, 64) : null;
  const path = typeof body.path === 'string' ? body.path.slice(0, 128) : null;

  console.log(
    JSON.stringify({
      kind: 'conversion',
      event,
      placement,
      path,
      // Country only — coarse enough to be non-identifying, useful for knowing
      // whether traffic is actually Malaysian.
      country: req.headers.get('cf-ipcountry') ?? null,
      referer: req.headers.get('referer')?.slice(0, 128) ?? null,
    }),
  );

  return new NextResponse(null, { status: 204 });
}
