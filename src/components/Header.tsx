import { LanguageSwitch } from "./LanguageSwitch";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

type View = "daily" | "monthly";

interface HeaderProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export function Header({ currentView, onChangeView }: HeaderProps) {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();

  return (
    <header className="border-b border-ledger-line bg-ledger-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ledger-gold">{t("dailyBook")}</p>
            <h1 className="text-3xl font-extrabold text-ledger-ink">{t("appTitle")}</h1>
            {user?.email && (
              <p className="mt-1 text-xs text-ledger-muted" dir="ltr">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-ledger-line bg-white px-4 py-2 text-sm font-semibold text-ledger-ink hover:bg-ledger-bg"
            >
              {t("logout")}
            </button>
          </div>
        </div>
        <nav className="flex gap-2">
          <button
            type="button"
            onClick={() => onChangeView("daily")}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              currentView === "daily"
                ? "border-ledger-ink bg-ledger-ink text-white"
                : "border-ledger-line bg-white text-ledger-ink hover:bg-ledger-bg"
            }`}
          >
            {t("today")}
          </button>
          <button
            type="button"
            onClick={() => onChangeView("monthly")}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              currentView === "monthly"
                ? "border-ledger-ink bg-ledger-ink text-white"
                : "border-ledger-line bg-white text-ledger-ink hover:bg-ledger-bg"
            }`}
          >
            {t("monthlySummary")}
          </button>
        </nav>
      </div>
    </header>
  );
}
