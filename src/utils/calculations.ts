import type { CashEntry, DayTotals } from "../types/cashEntry";

function compareEntries(a: CashEntry, b: CashEntry): number {
  if (a.date !== b.date) {
    return a.date.localeCompare(b.date);
  }
  return a.created_at.localeCompare(b.created_at);
}

export function sortChronologically(entries: CashEntry[]): CashEntry[] {
  return [...entries].sort(compareEntries);
}

export function signedAmount(entry: CashEntry): number {
  return entry.type === "in" ? entry.amount : -entry.amount;
}

export function calculateCurrentBalance(entries: CashEntry[]): number {
  return entries.reduce((sum, entry) => sum + signedAmount(entry), 0);
}

export function calculateDayTotals(entries: CashEntry[]): DayTotals {
  const income = entries
    .filter((entry) => entry.type === "in")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = entries
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
): Map<string, number> {
  const sorted = sortChronologically(entries);
  const balances = new Map<string, number>();
  let running = 0;

  for (const entry of sorted) {
    running += signedAmount(entry);
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
