'use client';

import { COMPANY, GERAIKU, MAILTO, NEXMENU, whatsappUrl } from '@/lib/company';
import { TrackedLink } from '@/components/ui/tracked-link';

const LINK = 'inline-flex min-h-[24px] items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

/** Email + WhatsApp in the footer brand column — both tracked. */
export function FooterContactLinks() {
  // gap-3 keeps a 24px clear circle around each target (WCAG 2.5.8 spacing
  // exception) — gap-2 left only 8px between these two adjacent links.
  return (
    <div className="mt-5 flex flex-col gap-3 text-sm">
      <TrackedLink
        href={MAILTO}
        event="email_click"
        placement="footer"
        attribute={false}
        unstyled
        className={LINK}
        target={undefined}
        rel={undefined}
      >
        {COMPANY.email}
      </TrackedLink>
      <TrackedLink
        href={whatsappUrl()}
        event="whatsapp_click"
        placement="footer"
        attribute={false}
        unstyled
        className={LINK}
      >
        WhatsApp us
      </TrackedLink>
    </div>
  );
}

/** Product column — outbound product links carry attribution. */
export function FooterProductLinks() {
  return (
    <nav aria-label="Products">
      <h2 className="text-eyebrow font-semibold uppercase text-white">Products</h2>
      <ul className="mt-4 space-y-3 text-sm" role="list">
        <li>
          <a href="/products/nexmenu" className={LINK}>
            NexMenu
          </a>
        </li>
        <li>
          <TrackedLink
            href={NEXMENU.demo}
            event="nexmenu_demo"
            placement="footer"
            unstyled
            className={LINK}
          >
            NexMenu demo
          </TrackedLink>
        </li>
        <li>
          <TrackedLink
            href={NEXMENU.pricing}
            event="nexmenu_pricing"
            placement="footer"
            unstyled
            className={LINK}
          >
            NexMenu pricing
          </TrackedLink>
        </li>
        <li>
          <a href="/products/geraiku" className={LINK}>
            GeraiKu
          </a>
        </li>
        <li>
          <TrackedLink
            href={GERAIKU.home}
            event="geraiku_outbound"
            placement="footer"
            unstyled
            className={LINK}
          >
            Visit GeraiKu
          </TrackedLink>
        </li>
      </ul>
    </nav>
  );
}
