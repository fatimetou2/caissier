interface DeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteDialog({
  open,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-xl">
        <h3 className="text-xl font-extrabold text-ledger-ink">حذف الحركة</h3>
        <p className="mt-3 text-ledger-ink">هل أنت متأكد من حذف هذه الحركة؟</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-ledger-out px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "جاري الحذف..." : "حذف"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-ledger-line px-4 py-3 font-semibold text-ledger-ink"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
