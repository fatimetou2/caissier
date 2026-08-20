import { useLanguage } from "../i18n/LanguageContext";
import type { CashEntry } from "../types/cashEntry";
import { isCancelled } from "../utils/calculations";
import {
  formatDateTime,
  formatLongDate,
  formatSignedAmount,
} from "../utils/formatters";

interface EntryCardProps {
  entry: CashEntry;
  onEdit: (entry: CashEntry) => void;
  onCancelEntry: (entry: CashEntry) => void;
  onDeleteEntry: (entry: CashEntry) => void;
}

export function EntryCard({
  entry,
  onEdit,
  onCancelEntry,
  onDeleteEntry,
}: EntryCardProps) {
  const { t, language } = useLanguage();
  const isIn = entry.type === "in";
  const cancelled = isCancelled(entry);

  return (
    <article
      className={`rounded-xl border p-4 shadow-sm ${
        cancelled
          ? "border-ledger-out bg-stone-100"
          : "border-ledger-line bg-ledger-paper"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ledger-muted">
            {formatLongDate(entry.date, language)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p
              className={`font-bold ${
                cancelled
                  ? "text-ledger-muted"
                  : isIn
                    ? "text-ledger-in"
                    : "text-ledger-out"
              }`}
            >
              {isIn ? t("incoming") : t("outgoing")}
            </p>
            {cancelled && (
              <span className="rounded-full bg-ledger-out px-2 py-1 text-xs font-bold text-white">
                {t("statusCancelled")}
              </span>
            )}
          </div>
        </div>
        <p
          className={`text-xl font-extrabold ${
            cancelled
              ? "text-ledger-muted line-through"
              : isIn
                ? "text-ledger-in"
                : "text-ledger-out"
          }`}
          dir="ltr"
        >
          {formatSignedAmount(entry.type === "in" ? entry.amount : -entry.amount)}{" "}
          MRU
        </p>
      </div>

      <dl className="mt-4 grid gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ledger-muted">{t("party")}</dt>
          <dd className="font-semibold text-ledger-ink">{entry.party || "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ledger-muted">{t("reason")}</dt>
          <dd className="font-semibold text-ledger-ink">{entry.reason || "—"}</dd>
        </div>
        {entry.notes && (
          <div className="flex justify-between gap-3">
            <dt className="text-ledger-muted">{t("notes")}</dt>
            <dd className="font-semibold text-ledger-ink">{entry.notes}</dd>
          </div>
        )}
        {cancelled && entry.cancel_reason && (
          <div className="flex justify-between gap-3">
            <dt className="text-ledger-muted">{t("voidReason")}</dt>
            <dd className="font-semibold text-ledger-out">{entry.cancel_reason}</dd>
          </div>
        )}
        {cancelled && entry.cancelled_at && (
          <div className="flex justify-between gap-3">
            <dt className="text-ledger-muted">{t("cancelledAt")}</dt>
            <dd className="font-semibold text-ledger-ink" dir="ltr">
              {formatDateTime(entry.cancelled_at)}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex gap-2 border-t border-ledger-line pt-3">
        {cancelled ? (
          <button
            type="button"
            onClick={() => onDeleteEntry(entry)}
            className="flex-1 rounded-lg bg-ledger-out px-3 py-2 text-sm font-bold text-white"
          >
            {t("delete")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(entry)}
              className="flex-1 rounded-lg border border-ledger-line px-3 py-2 text-sm font-semibold"
            >
              {t("edit")}
            </button>
            <button
              type="button"
              onClick={() => onCancelEntry(entry)}
              className="flex-1 rounded-lg border border-ledger-out-soft bg-ledger-out-soft px-3 py-2 text-sm font-semibold text-ledger-out"
            >
              {t("voidEntry")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
