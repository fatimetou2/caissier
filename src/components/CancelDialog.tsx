import { useLanguage } from "../i18n/LanguageContext";

interface CancelDialogProps {
  open: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading?: boolean;
}

export function CancelDialog({
  open,
  onConfirm,
  onClose,
  loading = false,
}: CancelDialogProps) {
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-xl">
        <h3 className="text-xl font-extrabold text-ledger-ink">{t("voidTitle")}</h3>
        <p className="mt-3 text-ledger-ink">{t("voidConfirm")}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm("")}
            disabled={loading}
            className="flex-1 rounded-lg bg-ledger-out px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? t("voiding") : t("voidEntry")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-ledger-line px-4 py-3 font-semibold text-ledger-ink"
          >
            {t("back")}
          </button>
        </div>
      </div>
    </div>
  );
}
