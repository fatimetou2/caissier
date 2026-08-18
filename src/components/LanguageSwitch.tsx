import { useLanguage } from "../i18n/LanguageContext";

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex overflow-hidden rounded-lg border border-ledger-line">
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1.5 text-sm font-semibold ${
          language === "ar"
            ? "bg-ledger-ink text-white"
            : "bg-white text-ledger-ink"
        }`}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`px-3 py-1.5 text-sm font-semibold ${
          language === "fr"
            ? "bg-ledger-ink text-white"
            : "bg-white text-ledger-ink"
        }`}
      >
        Français
      </button>
    </div>
  );
}
