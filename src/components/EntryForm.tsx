import { useEffect, useState, type FormEvent } from "react";
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
      setError("التاريخ مطلوب");
      return;
    }
    if (type !== "in" && type !== "out") {
      setError("النوع مطلوب");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("المبلغ يجب أن يكون أكبر من صفر");
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
      setError("تعذر حفظ الحركة. حاول مرة أخرى.");
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
            {entry ? "تعديل حركة" : "إضافة حركة"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-ledger-muted hover:text-ledger-ink"
          >
            إغلاق
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            التاريخ
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
              النوع
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
                وارد
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
                صادر
              </button>
            </div>
          </fieldset>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            المبلغ
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
            الطرف
            <input
              type="text"
              value={party}
              onChange={(event) => setParty(event.target.value)}
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            السبب
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-ledger-ink">
            الملاحظات
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
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
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ledger-line px-4 py-3 font-semibold text-ledger-ink"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
