import { CreditCard, Cloud, FileText, Printer, Store, Workflow } from 'lucide-react';

/**
 * Capability catalogue — shared by the homepage summary and /capabilities.
 *
 * Constraint applied strictly: every claim here is substantiated by something
 * that actually exists in the Finch product estate. Where a specific integration
 * is named, it is because the NexMenu codebase implements it (payment gateway
 * settings, printing/ESC-POS surfaces, e-Invoice export, Cloudflare runtime).
 *
 * No "world-class", "enterprise-grade", "industry-leading", "99.99%" or SLA
 * claims — the audit found those unsupported, and they remain unsupported.
 */

export interface Capability {
  icon: typeof CreditCard;
  title: string;
  summary: string;
  detail: string;
  points: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    icon: CreditCard,
    title: 'Payments and gateways',
    summary: 'Malaysian payment gateways wired into real checkout flows.',
    detail:
      'Our products take payment through Malaysian gateways licensed or registered with Bank Negara Malaysia. Merchants connect their own gateway account, so settlement goes directly to them and we never hold customer order funds.',
    points: [
      'Gateway integration and webhook handling',
      'Merchant-owned gateway credentials, encrypted at rest',
      'Counter settlement and payment reconciliation',
      'No commission taken on customer orders',
    ],
  },
  {
    icon: Printer,
    title: 'Hardware and printing',
    summary: 'Thermal receipt and kitchen printing that works on real hardware.',
    detail:
      'Restaurant software fails at the printer more often than anywhere else. We run ESC/POS thermal printing for receipts and kitchen dockets, with a dedicated print station surface and routing per kitchen station.',
    points: [
      'ESC/POS thermal receipt and docket printing',
      'Per-station kitchen routing',
      'Dedicated print station display',
      'Network and local printer setups',
    ],
  },
  {
    icon: Store,
    title: 'Restaurant operations',
    summary: 'The full floor-to-kitchen workflow, not just a digital menu.',
    detail:
      'QR ordering is the visible part. The work is in what happens after: table sessions, order state, kitchen and runner displays, reservations, stock and reporting — all staying consistent while a busy service is running.',
    points: [
      'QR ordering, dine-in, takeaway and delivery',
      'Point of sale and table sessions',
      'Kitchen (NexKitchen) and runner (NexRunner) displays',
      'Reservations, inventory and sales reporting',
    ],
  },
  {
    icon: FileText,
    title: 'Malaysian compliance',
    summary: 'e-Invoice export and PDPA-aware data handling.',
    detail:
      'Local requirements are built into the products rather than bolted on. Merchants can export invoice data for LHDN e-Invoice submission, and personal data is handled in line with the Personal Data Protection Act 2010.',
    points: [
      'e-Invoice export from sales records',
      'Tax configuration per merchant',
      'PDPA-aligned privacy practices',
      'Ringgit pricing and local billing',
    ],
  },
  {
    icon: Cloud,
    title: 'Cloud platform engineering',
    summary: 'Products built and operated on Cloudflare’s edge platform.',
    detail:
      'Our software runs on Cloudflare Workers with D1, R2, KV and Durable Objects. We build, deploy and operate it ourselves, which means the team that writes the code is the team that keeps it running.',
    points: [
      'Cloudflare Workers, D1, R2, KV, Durable Objects',
      'Multi-tenant application architecture',
      'Realtime order and display synchronisation',
      'Deployment and production operations',
    ],
  },
  {
    icon: Workflow,
    title: 'Integrations and interfaces',
    summary: 'Connecting business systems that were not designed to talk.',
    detail:
      'Where a business already runs other systems, we build the connective work: authenticated APIs, webhooks, scheduled jobs and messaging integrations that move data between them reliably.',
    points: [
      'REST APIs and API key management',
      'Webhook producers and consumers',
      'WhatsApp and messaging notifications',
      'Scheduled and event-driven jobs',
    ],
  },
];
