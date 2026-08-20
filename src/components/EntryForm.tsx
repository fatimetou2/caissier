import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { CashEntry, CashEntryInput, EntryType } from "../types/cashEntry";
import { parseAmountInput } from "../utils/formatters";

interface EntryFormProps {
  open: boolean;
  selectedDate: string;
  entry?: CashEntry | null;
  onClose: () => void;
  onSubmit: (input: CashEntryInput) => Promise<void>;
}

export function EntryForm({
  open,
  selectedDate,
  entry,
  onClose,
  onSubmit,
}: EntryFormProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState(selectedDate);
  const [type, setType] = useState<EntryType>("in");
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setDate(entry?.date ?? selectedDate);
    setType(entry?.type ?? "in");
    setAmount(entry ? String(entry.amount) : "");
    setParty(entry?.party ?? "");
    setReason(entry?.reason ?? "");
    setNotes(entry?.notes ?? "");
    setError("");
    setSaving(false);
  }, [open, entry, selectedDate]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = parseAmountInput(amount);

    if (!date) {
      setError(t("dateRequired"));
      return;
    }
    if (type !== "in" && type !== "out") {
      setError(t("typeRequired"));
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError(t("amountRequired"));
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({
        date,
        type,
        amount: parsedAmount,
        party,
        reason,
        notes,
      });
      onClose();
    } catch {
      setError(t("saveFailed"));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-ledger-ink">
            {entry ? t("editMovement") : t("addMovement")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-ledger-muted hover:text-ledger-ink"
          >
            {t("close")}
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            {t("date")}
            <input
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ledger-ink">
              {t("type")}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("in")}
                className={`rounded-lg border px-3 py-3 font-bold ${
                  type === "in"
                    ? "border-ledger-in bg-ledger-in-soft text-ledger-in"
                    : "border-ledger-line bg-white text-ledger-muted"
                }`}
              >
                {t("incoming")}
              </button>
              <button
                type="button"
                onClick={() => setType("out")}
                className={`rounded-lg border px-3 py-3 font-bold ${
                  type === "out"
                    ? "border-ledger-out bg-ledger-out-soft text-ledger-out"
                    : "border-ledger-line bg-white text-ledger-muted"
                }`}
              >
                {t("outgoing")}
              </button>
            </div>
          </fieldset>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            {t("amount")}
            <input
              type="text"
              inputMode="numeric"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="100,000"
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
              dir="ltr"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            {t("reason")}
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            {t("party")}
            <input
              type="text"
              value={party}
              onChange={(event) => setParty(event.target.value)}
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-ledger-out-soft px-3 py-2 text-sm font-semibold text-ledger-out">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-ledger-ink px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {saving ? t("saving") : t("save")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ledger-line px-4 py-3 font-semibold text-ledger-ink"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
