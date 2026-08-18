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
  return (
    <div className="hidden overflow-hidden rounded-xl border border-ledger-line bg-ledger-paper shadow-sm md:block">
      <table className="w-full text-right">
        <thead className="bg-ledger-bg text-sm text-ledger-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">التاريخ</th>
            <th className="px-4 py-3 font-semibold">النوع</th>
            <th className="px-4 py-3 font-semibold">المبلغ</th>
            <th className="px-4 py-3 font-semibold">الطرف</th>
            <th className="px-4 py-3 font-semibold">السبب</th>
            <th className="px-4 py-3 font-semibold">الرصيد التراكمي</th>
            <th className="px-4 py-3 font-semibold">الإجراءات</th>
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
                    {isIn ? "وارد" : "صادر"}
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
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry)}
                      className="text-sm font-semibold text-ledger-out hover:underline"
                    >
                      حذف
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
