import type { CashEntry } from "../types/cashEntry";
import { signedAmount } from "../utils/calculations";
import {
  formatArabicDate,
  formatMoney,
  formatSignedAmount,
} from "../utils/formatters";

interface EntryCardProps {
  entry: CashEntry;
  runningBalance: number;
  onEdit: (entry: CashEntry) => void;
  onDelete: (entry: CashEntry) => void;
}

export function EntryCard({
  entry,
  runningBalance,
  onEdit,
  onDelete,
}: EntryCardProps) {
  const isIn = entry.type === "in";

  return (
    <article className="rounded-xl border border-ledger-line bg-ledger-paper p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ledger-muted">
            {formatArabicDate(entry.date)}
          </p>
          <p
            className={`mt-1 font-bold ${
              isIn ? "text-ledger-in" : "text-ledger-out"
            }`}
          >
            {isIn ? "وارد" : "صادر"}
          </p>
        </div>
        <p
          className={`text-xl font-extrabold ${
            isIn ? "text-ledger-in" : "text-ledger-out"
          }`}
          dir="ltr"
        >
          {formatSignedAmount(signedAmount(entry))} MRU
        </p>
      </div>

      <dl className="mt-4 grid gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ledger-muted">الطرف</dt>
          <dd className="font-semibold text-ledger-ink">{entry.party || "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ledger-muted">السبب</dt>
          <dd className="font-semibold text-ledger-ink">{entry.reason || "—"}</dd>
        </div>
        {entry.notes && (
          <div className="flex justify-between gap-3">
            <dt className="text-ledger-muted">الملاحظات</dt>
            <dd className="font-semibold text-ledger-ink">{entry.notes}</dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt className="text-ledger-muted">الرصيد</dt>
          <dd className="font-bold text-ledger-ink" dir="ltr">
            {formatMoney(runningBalance)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2 border-t border-ledger-line pt-3">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="flex-1 rounded-lg border border-ledger-line px-3 py-2 text-sm font-semibold"
        >
          تعديل
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry)}
          className="flex-1 rounded-lg border border-ledger-out-soft bg-ledger-out-soft px-3 py-2 text-sm font-semibold text-ledger-out"
        >
          حذف
        </button>
      </div>
    </article>
  );
}
