// --- File: types.ts ---
export type LeadStatus = 'captured' | 'contact' | 'response' | 'Done';
export type Lead = {
  id: string;
  fullname: string;
  email: string;
  company_name: string;
  detail: string;
  status: LeadStatus;
};
