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
    <section className="rounded-xl border border-ledger-line bg-ledger-paper p-3 shadow-sm sm:p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeDate(addDays(selectedDate, -1))}
          className="shrink-0 rounded-lg border border-ledger-line bg-white px-2 py-2 text-xs font-semibold text-ledger-ink hover:bg-ledger-bg sm:px-3 sm:text-sm"
        >
          {t("previousDay")}
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h2 className="truncate text-lg font-extrabold text-ledger-ink sm:text-2xl">
            {formatLongDate(selectedDate, language)}
          </h2>
          {isToday && (
            <p className="text-xs font-semibold text-ledger-gold sm:text-sm">
              {t("today")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChangeDate(addDays(selectedDate, 1))}
          className="shrink-0 rounded-lg border border-ledger-line bg-white px-2 py-2 text-xs font-semibold text-ledger-ink hover:bg-ledger-bg sm:px-3 sm:text-sm"
        >
          {t("nextDay")}
        </button>
      </div>
      <label className="mt-3 flex flex-col gap-1 text-sm text-ledger-muted">
        {t("chooseDate")}
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => onChangeDate(event.target.value)}
          className="w-full rounded-lg border border-ledger-line bg-white px-3 py-2 text-ledger-ink"
        />
      </label>
    </section>
  );
}
