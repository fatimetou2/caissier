import { useLanguage } from "../i18n/LanguageContext";
import type { CashEntry } from "../types/cashEntry";
import { isCancelled } from "../utils/calculations";
import {
  formatDateTime,
  formatDisplayDate,
  formatMoney,
  formatSignedAmount,
} from "../utils/formatters";

interface EntryTableProps {
  entries: CashEntry[];
  runningBalances: Map<string, number>;
  onEdit: (entry: CashEntry) => void;
  onCancelEntry: (entry: CashEntry) => void;
}

export function EntryTable({
  entries,
  runningBalances,
  onEdit,
  onCancelEntry,
}: EntryTableProps) {
  const { t } = useLanguage();

  return (
    <div className="hidden overflow-hidden rounded-xl border border-ledger-line bg-ledger-paper shadow-sm md:block">
      <table className="w-full text-start">
        <thead className="bg-ledger-bg text-sm text-ledger-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">{t("date")}</th>
            <th className="px-4 py-3 font-semibold">{t("type")}</th>
            <th className="px-4 py-3 font-semibold">{t("amount")}</th>
            <th className="px-4 py-3 font-semibold">{t("party")}</th>
            <th className="px-4 py-3 font-semibold">{t("reason")}</th>
            <th className="px-4 py-3 font-semibold">{t("runningBalance")}</th>
            <th className="px-4 py-3 font-semibold">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isIn = entry.type === "in";
            const cancelled = isCancelled(entry);
            return (
              <tr
                key={entry.id}
                className={`border-t border-ledger-line ${
                  cancelled ? "bg-stone-100 text-ledger-muted" : ""
                }`}
              >
                <td className="px-4 py-3" dir="ltr">
                  {formatDisplayDate(entry.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-sm font-bold ${
                        cancelled
                          ? "bg-stone-200 text-stone-600"
                          : isIn
                            ? "bg-ledger-in-soft text-ledger-in"
                            : "bg-ledger-out-soft text-ledger-out"
                      }`}
                    >
                      {isIn ? t("incoming") : t("outgoing")}
                    </span>
                    {cancelled && (
                      <span className="rounded-full bg-ledger-out px-2 py-1 text-xs font-bold text-white">
                        {t("statusCancelled")}
                      </span>
                    )}
                  </div>
                  {cancelled && entry.cancel_reason && (
                    <p className="mt-1 text-xs">
                      {t("voidReason")}: {entry.cancel_reason}
                    </p>
                  )}
                  {cancelled && entry.cancelled_at && (
                    <p className="text-xs" dir="ltr">
                      {t("cancelledAt")}: {formatDateTime(entry.cancelled_at)}
                    </p>
                  )}
                </td>
                <td
                  className={`px-4 py-3 font-bold ${
                    cancelled
                      ? "text-ledger-muted line-through"
                      : isIn
                        ? "text-ledger-in"
                        : "text-ledger-out"
                  }`}
                  dir="ltr"
                >
                  {formatSignedAmount(
                    entry.type === "in" ? entry.amount : -entry.amount,
                  )}
                </td>
                <td className="px-4 py-3">{entry.party || "—"}</td>
                <td className="px-4 py-3">{entry.reason || "—"}</td>
                <td className="px-4 py-3 font-semibold text-ledger-ink" dir="ltr">
                  {formatMoney(runningBalances.get(entry.id) ?? 0)}
                </td>
                <td className="px-4 py-3">
                  {cancelled ? (
                    <span className="text-sm font-bold text-ledger-out">
                      {t("statusCancelled")}
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(entry)}
                        className="text-sm font-semibold text-ledger-ink hover:underline"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelEntry(entry)}
                        className="text-sm font-semibold text-ledger-out hover:underline"
                      >
                        {t("voidEntry")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
