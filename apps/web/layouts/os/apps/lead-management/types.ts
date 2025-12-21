export type Lead = {
  id: string;
  name: string;
  company?: string;
  value?: number;
  notes?: string;
  email?: string;
  phone?: string;
  owner?: string;
  source?: string;
};

export type PipelineColumn = {
  id: string;
  title: string;
  color: string;
  dotColor: string;
};

export type BoardState = Record<string, Lead[]>;
