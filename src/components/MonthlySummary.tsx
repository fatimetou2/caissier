import { useMemo, useState } from "react";
import type { CashEntry } from "../types/cashEntry";
import { calculateDayTotals, filterByMonth } from "../utils/calculations";
import {
  ARABIC_MONTHS,
  formatArabicMonth,
  formatMoney,
  parseISODate,
  todayISO,
} from "../utils/formatters";

interface MonthlySummaryProps {
  entries: CashEntry[];
}

export function MonthlySummary({ entries }: MonthlySummaryProps) {
  const today = parseISODate(todayISO());
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);

  const monthEntries = useMemo(
    () => filterByMonth(entries, year, month),
    [entries, year, month],
  );
  const totals = useMemo(
    () => calculateDayTotals(monthEntries),
    [monthEntries],
  );

  const years = useMemo(() => {
    const set = new Set<number>([today.year]);
    for (const entry of entries) {
      set.add(parseISODate(entry.date).year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [entries, today.year]);

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-extrabold text-ledger-ink">
            {formatArabicMonth(year, month)}
          </h2>
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="rounded-lg border border-ledger-line bg-white px-3 py-2"
            >
              {ARABIC_MONTHS.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="rounded-lg border border-ledger-line bg-white px-3 py-2"
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ledger-in">إجمالي الوارد</p>
          <p className="mt-2 text-2xl font-extrabold text-ledger-in" dir="ltr">
            {formatMoney(totals.income)}
          </p>
        </article>
        <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ledger-out">إجمالي الصادر</p>
          <p className="mt-2 text-2xl font-extrabold text-ledger-out" dir="ltr">
            {formatMoney(totals.expense)}
          </p>
        </article>
        <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ledger-muted">صافي الحركة</p>
          <p
            className={`mt-2 text-2xl font-extrabold ${
              totals.net >= 0 ? "text-ledger-in" : "text-ledger-out"
            }`}
            dir="ltr"
          >
            {formatMoney(totals.net)}
          </p>
        </article>
      </div>

      <p className="text-sm text-ledger-muted">
        عدد الحركات هذا الشهر: {monthEntries.length}
      </p>
    </section>
  );
}
