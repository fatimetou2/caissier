type View = "daily" | "monthly";

interface HeaderProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export function Header({ currentView, onChangeView }: HeaderProps) {
  return (
    <header className="border-b border-ledger-line bg-ledger-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ledger-gold">دفتر يومي</p>
          <h1 className="text-3xl font-extrabold text-ledger-ink">دفتر الصندوق</h1>
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
            اليوم
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
            الملخص الشهري
          </button>
        </nav>
      </div>
    </header>
  );
}
