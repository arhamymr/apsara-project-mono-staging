import type { PipelineColumn, BoardState } from './types';

export const COLUMN_COLORS = [
  { name: 'Blue', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
  { name: 'Purple', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
  { name: 'Amber', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
  { name: 'Emerald', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  { name: 'Rose', color: 'bg-rose-500/10', dotColor: 'bg-rose-500' },
  { name: 'Cyan', color: 'bg-cyan-500/10', dotColor: 'bg-cyan-500' },
  { name: 'Pink', color: 'bg-pink-500/10', dotColor: 'bg-pink-500' },
  { name: 'Indigo', color: 'bg-indigo-500/10', dotColor: 'bg-indigo-500' },
];

export const PIPELINE_TEMPLATES: { name: string; description: string; columns: Omit<PipelineColumn, 'id'>[] }[] = [
  {
    name: 'Sales Funnel',
    description: 'Classic sales pipeline stages',
    columns: [
      { title: 'Lead', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
      { title: 'Contacted', color: 'bg-cyan-500/10', dotColor: 'bg-cyan-500' },
      { title: 'Qualified', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
      { title: 'Proposal', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
      { title: 'Negotiation', color: 'bg-pink-500/10', dotColor: 'bg-pink-500' },
      { title: 'Closed Won', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
      { title: 'Closed Lost', color: 'bg-rose-500/10', dotColor: 'bg-rose-500' },
    ],
  },
  {
    name: 'Simple Pipeline',
    description: 'Basic 5-stage pipeline',
    columns: [
      { title: 'New', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
      { title: 'Qualified', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
      { title: 'Proposal', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
      { title: 'Won', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
      { title: 'Lost', color: 'bg-rose-500/10', dotColor: 'bg-rose-500' },
    ],
  },
  {
    name: 'B2B Enterprise',
    description: 'For complex B2B sales cycles',
    columns: [
      { title: 'Prospect', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
      { title: 'Discovery', color: 'bg-cyan-500/10', dotColor: 'bg-cyan-500' },
      { title: 'Demo', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
      { title: 'Evaluation', color: 'bg-indigo-500/10', dotColor: 'bg-indigo-500' },
      { title: 'Proposal', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
      { title: 'Contract', color: 'bg-pink-500/10', dotColor: 'bg-pink-500' },
      { title: 'Closed', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
    ],
  },
  {
    name: 'Real Estate',
    description: 'Property sales pipeline',
    columns: [
      { title: 'Inquiry', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
      { title: 'Viewing', color: 'bg-cyan-500/10', dotColor: 'bg-cyan-500' },
      { title: 'Interested', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
      { title: 'Offer Made', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
      { title: 'Under Contract', color: 'bg-pink-500/10', dotColor: 'bg-pink-500' },
      { title: 'Sold', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
    ],
  },
  {
    name: 'Recruitment',
    description: 'Hiring pipeline stages',
    columns: [
      { title: 'Applied', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
      { title: 'Screening', color: 'bg-cyan-500/10', dotColor: 'bg-cyan-500' },
      { title: 'Interview', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
      { title: 'Assessment', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
      { title: 'Offer', color: 'bg-pink-500/10', dotColor: 'bg-pink-500' },
      { title: 'Hired', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
      { title: 'Rejected', color: 'bg-rose-500/10', dotColor: 'bg-rose-500' },
    ],
  },
];

export const DEFAULT_COLUMNS: PipelineColumn[] = [
  { id: 'new', title: 'New', color: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
  { id: 'won', title: 'Won', color: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  { id: 'lost', title: 'Lost', color: 'bg-rose-500/10', dotColor: 'bg-rose-500' },
];

export const initialLeads: BoardState = {
  new: [
    { id: 'l-101', name: 'Rafi – Landing Revamp', company: 'Kopi Kuning', source: 'Website' },
    { id: 'l-102', name: 'Ani – Branding Kit', company: 'Sweet & Co', source: 'Referral' },
  ],
  qualified: [
    { id: 'l-201', name: 'Dina – Web App', company: 'DigiMart', value: 25_000_000, email: 'dina@digimart.id' },
  ],
  proposal: [
    { id: 'l-301', name: 'Budi – SEO Retainer', company: 'Rumah Baja', value: 8_000_000, owner: 'Arham' },
  ],
  won: [{ id: 'l-401', name: 'Tel-U – Microsite', value: 15_000_000, source: 'Ads' }],
  lost: [{ id: 'l-501', name: 'Andi – Rebrand', notes: 'Budget mismatch' }],
};
