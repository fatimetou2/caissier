import { useLanguage } from "../i18n/LanguageContext";
import { addDays, formatLongDate, todayISO } from "../utils/formatters";

interface DailyNavigationProps {
  selectedDate: string;
  onChangeDate: (date: string) => void;
}

export function DailyNavigation({
  selectedDate,
  onChangeDate,
}: DailyNavigationProps) {
  const { t, language } = useLanguage();
  const isToday = selectedDate === todayISO();

  return (
    <section className="rounded-xl border border-ledger-line bg-ledger-paper p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <button
            type="button"
            onClick={() => onChangeDate(addDays(selectedDate, -1))}
            className="rounded-lg border border-ledger-line bg-white px-3 py-2 text-sm font-semibold text-ledger-ink hover:bg-ledger-bg"
          >
            {t("previousDay")}
          </button>
          <button
            type="button"
            onClick={() => onChangeDate(addDays(selectedDate, 1))}
            className="rounded-lg border border-ledger-line bg-white px-3 py-2 text-sm font-semibold text-ledger-ink hover:bg-ledger-bg"
          >
            {t("nextDay")}
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-ledger-ink">
            {formatLongDate(selectedDate, language)}
          </h2>
          {isToday && (
            <p className="mt-1 text-sm font-semibold text-ledger-gold">
              {t("today")}
            </p>
          )}
        </div>

        <label className="flex flex-col gap-1 text-sm text-ledger-muted">
          {t("chooseDate")}
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onChangeDate(event.target.value)}
            className="rounded-lg border border-ledger-line bg-white px-3 py-2 text-ledger-ink"
          />
        </label>
      </div>
    </section>
  );
}
