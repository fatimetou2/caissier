import { supabase } from "../lib/supabase";
import type { CashEntry, CashEntryInput } from "../types/cashEntry";
import { encodeCancelledNotes, isCancelledRecord, parseCancelledNotes } from "../utils/cancelMeta";

function mapEntry(row: Record<string, unknown>): CashEntry {
  const encoded = parseCancelledNotes((row.notes as string | null) ?? null);
  const cancelled = isCancelledRecord(row);

  return {
    id: String(row.id),
    date: String(row.date),
    type: row.type === "out" ? "out" : "in",
    amount: Number(row.amount),
    party: (row.party as string | null) ?? null,
    reason: (row.reason as string | null) ?? null,
    notes: encoded?.notes ?? ((row.notes as string | null) ?? null),
    status: cancelled ? "cancelled" : "active",
    cancelled_at: (row.cancelled_at as string | null) ?? encoded?.at ?? null,
    cancel_reason:
      (row.cancel_reason as string | null) ?? encoded?.reason ?? null,
    user_id: (row.user_id as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function emptyToNull(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function getEntries(): Promise<CashEntry[]> {
  const { data, error } = await supabase
    .from("cash_entries")
    .select("*")
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapEntry);
}

export async function getEntriesByDate(date: string): Promise<CashEntry[]> {
  const { data, error } = await supabase
    .from("cash_entries")
    .select("*")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapEntry);
}

export async function getEntriesByMonth(month: string): Promise<CashEntry[]> {
  const start = `${month}-01`;
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth =
    monthNumber === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(monthNumber + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("cash_entries")
    .select("*")
    .gte("date", start)
    .lt("date", nextMonth)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapEntry);
}

export async function createEntry(entry: CashEntryInput): Promise<CashEntry> {
  const payload = {
    date: entry.date,
    type: entry.type,
    amount: entry.amount,
    party: emptyToNull(entry.party),
    reason: emptyToNull(entry.reason),
    notes: emptyToNull(entry.notes),
  };

  const { data, error } = await supabase
    .from("cash_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return mapEntry(data);
}

export async function updateEntry(
  id: string,
  entry: CashEntryInput,
): Promise<CashEntry> {
  const payload = {
    date: entry.date,
    type: entry.type,
    amount: entry.amount,
    party: emptyToNull(entry.party),
    reason: emptyToNull(entry.reason),
    notes: emptyToNull(entry.notes),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("cash_entries")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapEntry(data);
}

export async function cancelEntry(
  id: string,
  cancelReason: string,
): Promise<CashEntry> {
  const cancelledAt = new Date().toISOString();

  const current = await supabase
    .from("cash_entries")
    .select("*")
    .eq("id", id)
    .single();
  if (current.error) throw current.error;

  const originalNotes = parseCancelledNotes(
    (current.data.notes as string | null) ?? null,
  )?.notes ?? ((current.data.notes as string | null) ?? null);

  const { data, error } = await supabase
    .from("cash_entries")
    .update({
      notes: encodeCancelledNotes(originalNotes, cancelReason, cancelledAt),
      updated_at: cancelledAt,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapEntry(data);
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from("cash_entries").delete().eq("id", id);
  if (error) throw error;
}

export async function claimOrphanEntries(): Promise<void> {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;

  const { error } = await supabase
    .from("cash_entries")
    .update({ user_id: userId })
    .is("user_id", null);

  if (error) throw error;
}
