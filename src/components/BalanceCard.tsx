import { useLanguage } from "../i18n/LanguageContext";
import type { EntryType } from "../types/cashEntry";
import { formatMoney } from "../utils/formatters";

export type BalanceTypeFilter = "all" | EntryType;

interface BalanceCardProps {
  currentBalance: number;
  dayIncome: number;
  dayExpense: number;
  typeFilter: BalanceTypeFilter;
  onTypeFilterChange: (filter: BalanceTypeFilter) => void;
}

export function BalanceCard({
  currentBalance,
  dayIncome,
  dayExpense,
  typeFilter,
  onTypeFilterChange,
}: BalanceCardProps) {
  const { t } = useLanguage();
  const balanceClass =
    currentBalance > 0
      ? "text-ledger-in"
      : currentBalance < 0
        ? "text-ledger-out"
        : "text-ledger-ink";

  function toggle(next: BalanceTypeFilter) {
    onTypeFilterChange(typeFilter === next ? "all" : next);
  }

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => onTypeFilterChange("all")}
        className={`rounded-xl border bg-ledger-paper p-2 text-start shadow-sm sm:p-5 ${
          typeFilter === "all"
            ? "border-ledger-ink ring-1 ring-ledger-ink"
            : "border-ledger-line"
        }`}
      >
        <p className="text-[11px] font-semibold leading-tight text-ledger-muted sm:text-sm">
          {t("currentBalance")}
        </p>
        <p
          className={`mt-1 break-all text-sm font-extrabold sm:mt-2 sm:text-3xl ${balanceClass}`}
          dir="ltr"
        >
          {formatMoney(currentBalance)}
        </p>
        <p className="mt-1 hidden text-xs text-ledger-muted sm:mt-2 sm:block">
          {t("fromAllEntries")}
        </p>
      </button>

      <button
        type="button"
        onClick={() => toggle("in")}
        className={`rounded-xl border bg-ledger-paper p-2 text-start shadow-sm sm:p-5 ${
          typeFilter === "in"
            ? "border-ledger-in ring-1 ring-ledger-in"
            : "border-ledger-line"
        }`}
      >
        <p className="text-[11px] font-semibold leading-tight text-ledger-in sm:text-sm">
          {t("totalIn")}
        </p>
        <p
          className="mt-1 break-all text-sm font-extrabold text-ledger-in sm:mt-2 sm:text-2xl"
          dir="ltr"
        >
          {formatMoney(dayIncome)}
        </p>
        <p className="mt-1 hidden text-xs text-ledger-muted sm:mt-2 sm:block">
          {t("forThisDay")}
        </p>
      </button>

      <button
        type="button"
        onClick={() => toggle("out")}
        className={`rounded-xl border bg-ledger-paper p-2 text-start shadow-sm sm:p-5 ${
          typeFilter === "out"
            ? "border-ledger-out ring-1 ring-ledger-out"
            : "border-ledger-line"
        }`}
      >
        <p className="text-[11px] font-semibold leading-tight text-ledger-out sm:text-sm">
          {t("totalOut")}
        </p>
        <p
          className="mt-1 break-all text-sm font-extrabold text-ledger-out sm:mt-2 sm:text-2xl"
          dir="ltr"
        >
          {formatMoney(dayExpense)}
        </p>
        <p className="mt-1 hidden text-xs text-ledger-muted sm:mt-2 sm:block">
          {t("forThisDay")}
        </p>
      </button>
    </section>
  );
}
