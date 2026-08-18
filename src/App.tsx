import { AuthProvider, useAuth } from "./auth/AuthContext";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { CashJournal } from "./pages/CashJournal";
import { Login } from "./pages/Login";

function AppGate() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <p className="text-ledger-muted">{t("loading")}</p>
      </main>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <CashJournal />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppGate />
      </AuthProvider>
    </LanguageProvider>
  );
}
