import { useLanguage } from "../i18n/LanguageContext";
import type { CashEntry } from "../types/cashEntry";
import { signedAmount } from "../utils/calculations";
import {
  formatDisplayDate,
  formatMoney,
  formatSignedAmount,
} from "../utils/formatters";

interface EntryTableProps {
  entries: CashEntry[];
  runningBalances: Map<string, number>;
  onEdit: (entry: CashEntry) => void;
  onDelete: (entry: CashEntry) => void;
}

export function EntryTable({
  entries,
  runningBalances,
  onEdit,
  onDelete,
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
            return (
              <tr key={entry.id} className="border-t border-ledger-line">
                <td className="px-4 py-3" dir="ltr">
                  {formatDisplayDate(entry.date)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-bold ${
                      isIn
                        ? "bg-ledger-in-soft text-ledger-in"
                        : "bg-ledger-out-soft text-ledger-out"
                    }`}
                  >
                    {isIn ? t("incoming") : t("outgoing")}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 font-bold ${
                    isIn ? "text-ledger-in" : "text-ledger-out"
                  }`}
                  dir="ltr"
                >
                  {formatSignedAmount(signedAmount(entry))}
                </td>
                <td className="px-4 py-3">{entry.party || "—"}</td>
                <td className="px-4 py-3">{entry.reason || "—"}</td>
                <td className="px-4 py-3 font-semibold text-ledger-ink" dir="ltr">
                  {formatMoney(runningBalances.get(entry.id) ?? 0)}
                </td>
                <td className="px-4 py-3">
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
                      onClick={() => onDelete(entry)}
                      className="text-sm font-semibold text-ledger-out hover:underline"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
