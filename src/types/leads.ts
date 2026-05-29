export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "archived";

export interface Lead {
  id: string;
  account_id: string;
  site_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: LeadStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  account_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface LeadsFilters {
  status: LeadStatus | "all";
  search: string;
  dateFrom: string;
  dateTo: string;
  siteId: string | "all";
}

export interface LeadsStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  archived: number;
  conversionRate: number;
}

export interface CreateLeadPayload {
  site_id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}
