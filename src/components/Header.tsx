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
    <header className="sticky top-0 z-20 border-b border-ledger-line bg-ledger-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-3 py-3 sm:px-4 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ledger-gold sm:text-sm">
              {t("dailyBook")}
            </p>
            <h1 className="truncate text-xl font-extrabold text-ledger-ink sm:text-3xl">
              {t("appTitle")}
            </h1>
            {user?.email && (
              <p className="mt-0.5 truncate text-xs text-ledger-muted" dir="ltr">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-ledger-line bg-white px-3 py-2 text-sm font-semibold text-ledger-ink hover:bg-ledger-bg"
            >
              {t("logout")}
            </button>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-2">
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
