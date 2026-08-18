import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import { LanguageSwitch } from "../components/LanguageSwitch";
import { useLanguage } from "../i18n/LanguageContext";

export function Login() {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<"login" | "signup" | null>(null);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordMin"));
      return;
    }
    setBusy("login");
    setError("");
    setMessage("");
    try {
      await signIn(email.trim(), password);
    } catch {
      setError(t("loginFailed"));
      setBusy(null);
    }
  }

  async function handleSignup() {
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordMin"));
      return;
    }
    setBusy("signup");
    setError("");
    setMessage("");
    try {
      const result = await signUp(email.trim(), password);
      if (result === "confirm") {
        setMessage(t("confirmEmail"));
        setBusy(null);
      }
    } catch {
      setError(t("signupFailed"));
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch />
      </div>
      <form
        onSubmit={handleLogin}
        className="rounded-2xl border border-ledger-line bg-ledger-paper p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-ledger-gold">{t("dailyBook")}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ledger-ink">
          {t("appTitle")}
        </h1>
        <h2 className="mt-4 text-lg font-bold text-ledger-ink">{t("loginTitle")}</h2>

        <label className="mt-5 grid gap-1 text-sm font-semibold text-ledger-ink">
          {t("email")}
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            dir="ltr"
          />
        </label>

        <label className="mt-4 grid gap-1 text-sm font-semibold text-ledger-ink">
          {t("password")}
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-ledger-line px-3 py-2 font-normal"
            dir="ltr"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-ledger-out-soft px-3 py-2 text-sm font-semibold text-ledger-out">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-lg bg-ledger-in-soft px-3 py-2 text-sm font-semibold text-ledger-in">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={busy !== null}
          className="mt-5 w-full rounded-lg bg-ledger-ink px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {busy === "login" ? t("loggingIn") : t("login")}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void handleSignup()}
          className="mt-2 w-full rounded-lg border border-ledger-line px-4 py-3 font-semibold text-ledger-ink disabled:opacity-60"
        >
          {busy === "signup" ? t("creatingAccount") : t("signup")}
        </button>
      </form>
    </main>
  );
}
