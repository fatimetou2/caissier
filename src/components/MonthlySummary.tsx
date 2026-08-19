import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { CashEntry } from "../types/cashEntry";
import {
  activeEntries,
  balanceBeforeDate,
  balanceUpToDate,
  calculateDayTotals,
  filterByMonth,
} from "../utils/calculations";
import { exportEntriesToExcel } from "../utils/excelExport";
import {
  formatMonthTitle,
  monthNames,
  parseISODate,
  todayISO,
} from "../utils/formatters";
import { BalanceCard } from "./BalanceCard";

interface MonthlySummaryProps {
  entries: CashEntry[];
  onExported: () => void;
}

export function MonthlySummary({ entries, onExported }: MonthlySummaryProps) {
  const { t, language } = useLanguage();
  const today = parseISODate(todayISO());
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const names = monthNames(language);

  const monthEntries = useMemo(
    () => filterByMonth(entries, year, month),
    [entries, year, month],
  );
  const totals = useMemo(
    () => calculateDayTotals(monthEntries),
    [monthEntries],
  );
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${String(
    new Date(year, month, 0).getDate(),
  ).padStart(2, "0")}`;
  const openingBalance = useMemo(
    () => balanceBeforeDate(entries, monthStart),
    [entries, monthStart],
  );
  const cumulativeTotal = useMemo(
    () => balanceUpToDate(entries, monthEnd),
    [entries, monthEnd],
  );

  const years = useMemo(() => {
    const set = new Set<number>([today.year]);
    for (const entry of entries) {
      set.add(parseISODate(entry.date).year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [entries, today.year]);

  function handleExport() {
    exportEntriesToExcel(
      monthEntries,
      {
        date: t("date"),
        type: t("type"),
        amount: t("amount"),
        party: t("party"),
        reason: t("reason"),
        notes: t("notes"),
        runningBalance: t("runningBalance"),
        incoming: t("incoming"),
        outgoing: t("outgoing"),
        status: t("status"),
        statusActive: t("statusActive"),
        statusCancelled: t("statusCancelled"),
        voidReason: t("voidReason"),
      },
      `caisse-${year}-${String(month).padStart(2, "0")}.xlsx`,
      openingBalance,
    );
    onExported();
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-extrabold text-ledger-ink">
            {formatMonthTitle(year, month, language)}
          </h2>
          <div className="flex flex-wrap gap-2">
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="rounded-lg border border-ledger-line bg-white px-3 py-2"
            >
              {names.map((name, index) => (
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
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-ledger-line bg-white px-4 py-2 text-sm font-semibold"
            >
              {t("exportMonth")}
            </button>
          </div>
        </div>
      </div>

      <BalanceCard
        period="month"
        openingBalance={openingBalance}
        dayIncome={totals.income}
        dayExpense={totals.expense}
        dayTotal={totals.net}
        cumulativeTotal={cumulativeTotal}
      />

      <p className="text-sm text-ledger-muted">
        {t("monthCount")}: {activeEntries(monthEntries).length}
      </p>
    </section>
  );
}
