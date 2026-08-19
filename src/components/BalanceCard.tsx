import { useLanguage } from "../i18n/LanguageContext";
import { formatMoney } from "../utils/formatters";

interface BalanceCardProps {
  openingBalance: number;
  dayIncome: number;
  dayExpense: number;
  dayTotal: number;
  cumulativeTotal: number;
  period?: "day" | "month";
}

export function BalanceCard({
  openingBalance,
  dayIncome,
  dayExpense,
  dayTotal,
  cumulativeTotal,
  period = "day",
}: BalanceCardProps) {
  const { t } = useLanguage();
  const isMonth = period === "month";
  const openingLabel = isMonth ? t("openingBalanceMonth") : t("openingBalance");
  const openingHint = isMonth ? t("carriedToNextMonth") : t("carriedToNextDay");
  const periodHint = isMonth ? t("forThisMonth") : t("forThisDay");
  const totalClass =
    dayTotal > 0
      ? "text-ledger-in"
      : dayTotal < 0
        ? "text-ledger-out"
        : "text-ledger-ink";
  const cumuleClass =
    cumulativeTotal > 0
      ? "text-ledger-in"
      : cumulativeTotal < 0
        ? "text-ledger-out"
        : "text-ledger-ink";

  return (
    <section className="grid gap-2 sm:gap-3">
      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-3 shadow-sm sm:p-5">
        <p className="text-[11px] font-semibold leading-tight text-ledger-muted sm:text-sm">
          {openingLabel}
        </p>
        <p
          className="mt-1 break-all text-sm font-extrabold text-ledger-ink sm:mt-2 sm:text-2xl"
          dir="ltr"
        >
          {formatMoney(openingBalance)}
        </p>
        <p className="mt-1 text-xs text-ledger-muted">{openingHint}</p>
      </article>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
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
            {periodHint}
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
            {periodHint}
          </p>
        </article>

        <article className="rounded-xl border border-ledger-line bg-ledger-paper p-2 shadow-sm sm:p-5">
          <p className="text-[11px] font-semibold leading-tight text-ledger-muted sm:text-sm">
            {t("dayTotal")}
          </p>
          <p
            className={`mt-1 break-all text-sm font-extrabold sm:mt-2 sm:text-2xl ${totalClass}`}
            dir="ltr"
          >
            {formatMoney(dayTotal)}
          </p>
          <p className="mt-1 hidden text-xs text-ledger-muted sm:mt-2 sm:block">
            {t("dayTotalHint")}
          </p>
        </article>

        <article className="rounded-xl border border-ledger-line bg-ledger-paper p-2 shadow-sm sm:p-5">
          <p className="text-[11px] font-semibold leading-tight text-ledger-muted sm:text-sm">
            {t("totalCumule")}
          </p>
          <p
            className={`mt-1 break-all text-sm font-extrabold sm:mt-2 sm:text-2xl ${cumuleClass}`}
            dir="ltr"
          >
            {formatMoney(cumulativeTotal)}
          </p>
          <p className="mt-1 hidden text-xs text-ledger-muted sm:mt-2 sm:block">
            {t("totalCumuleHint")}
          </p>
        </article>
      </div>
    </section>
  );
}
