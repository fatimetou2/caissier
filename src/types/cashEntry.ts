export type EntryType = "in" | "out";

export interface CashEntry {
  id: string;
  date: string;
  type: EntryType;
  amount: number;
  party: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashEntryInput {
  date: string;
  type: EntryType;
  amount: number;
  party?: string | null;
  reason?: string | null;
  notes?: string | null;
}

export interface DayTotals {
  income: number;
  expense: number;
  net: number;
}
