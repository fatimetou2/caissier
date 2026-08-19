import { useLanguage } from "../i18n/LanguageContext";
import { formatMoney } from "../utils/formatters";

interface BalanceCardProps {
  currentBalance: number;
  dayIncome: number;
  dayExpense: number;
}

export function BalanceCard({
  currentBalance,
  dayIncome,
  dayExpense,
}: BalanceCardProps) {
  const { t } = useLanguage();
  const balanceClass =
    currentBalance > 0
      ? "text-ledger-in"
      : currentBalance < 0
        ? "text-ledger-out"
        : "text-ledger-ink";

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-3">
      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-2 shadow-sm sm:p-5">
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
      </article>

      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-2 shadow-sm sm:p-5">
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
      </article>

      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-2 shadow-sm sm:p-5">
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
      </article>
    </section>
  );
}
