import type { CashEntry, DayTotals, EntryFilter } from "../types/cashEntry";

function compareEntries(a: CashEntry, b: CashEntry): number {
  if (a.date !== b.date) {
    return a.date.localeCompare(b.date);
  }
  return a.created_at.localeCompare(b.created_at);
}

export function sortChronologically(entries: CashEntry[]): CashEntry[] {
  return [...entries].sort(compareEntries);
}

export function isCancelled(entry: CashEntry): boolean {
  return entry.status === "cancelled";
}

export function isActive(entry: CashEntry): boolean {
  return !isCancelled(entry);
}

export function activeEntries(entries: CashEntry[]): CashEntry[] {
  return entries.filter(isActive);
}

export function signedAmount(entry: CashEntry): number {
  if (isCancelled(entry)) return 0;
  return entry.type === "in" ? entry.amount : -entry.amount;
}

export function calculateCurrentBalance(entries: CashEntry[]): number {
  return activeEntries(entries).reduce((sum, entry) => {
    return sum + signedAmount(entry);
  }, 0);
}

export function balanceBeforeDate(entries: CashEntry[], date: string): number {
  return activeEntries(entries)
    .filter((entry) => entry.date < date)
    .reduce((sum, entry) => sum + signedAmount(entry), 0);
}

export function balanceUpToDate(entries: CashEntry[], date: string): number {
  return activeEntries(entries)
    .filter((entry) => entry.date <= date)
    .reduce((sum, entry) => sum + signedAmount(entry), 0);
}

export function calculateDayTotals(entries: CashEntry[]): DayTotals {
  const active = activeEntries(entries);
  const income = active
    .filter((entry) => entry.type === "in")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = active
    .filter((entry) => entry.type === "out")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    income,
    expense,
    net: income - expense,
  };
}

export function calculateRunningBalances(
  entries: CashEntry[],
  startingBalance = 0,
): Map<string, number> {
  const sorted = sortChronologically(entries);
  const balances = new Map<string, number>();
  let running = startingBalance;

  for (const entry of sorted) {
    if (isActive(entry)) {
      running += signedAmount(entry);
    }
    balances.set(entry.id, running);
  }

  return balances;
}

export function filterByDate(entries: CashEntry[], date: string): CashEntry[] {
  return sortChronologically(entries.filter((entry) => entry.date === date));
}

export function filterByMonth(
  entries: CashEntry[],
  year: number,
  month: number,
): CashEntry[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return sortChronologically(
    entries.filter((entry) => entry.date.startsWith(prefix)),
  );
}

export function filterByStatus(
  entries: CashEntry[],
  filter: EntryFilter,
): CashEntry[] {
  if (filter === "active") return entries.filter(isActive);
  if (filter === "cancelled") return entries.filter(isCancelled);
  return entries;
}
