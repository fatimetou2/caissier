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
    <section className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm sm:col-span-1">
        <p className="text-sm font-semibold text-ledger-muted">
          {t("currentBalance")}
        </p>
        <p className={`mt-2 text-3xl font-extrabold ${balanceClass}`} dir="ltr">
          {formatMoney(currentBalance)}
        </p>
        <p className="mt-2 text-xs text-ledger-muted">{t("fromAllEntries")}</p>
      </article>

      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
        <p className="text-sm font-semibold text-ledger-in">{t("totalIn")}</p>
        <p className="mt-2 text-2xl font-extrabold text-ledger-in" dir="ltr">
          {formatMoney(dayIncome)}
        </p>
        <p className="mt-2 text-xs text-ledger-muted">{t("forThisDay")}</p>
      </article>

      <article className="rounded-xl border border-ledger-line bg-ledger-paper p-5 shadow-sm">
        <p className="text-sm font-semibold text-ledger-out">{t("totalOut")}</p>
        <p className="mt-2 text-2xl font-extrabold text-ledger-out" dir="ltr">
          {formatMoney(dayExpense)}
        </p>
        <p className="mt-2 text-xs text-ledger-muted">{t("forThisDay")}</p>
      </article>
    </section>
  );
}
