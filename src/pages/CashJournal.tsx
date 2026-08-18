import { useCallback, useEffect, useMemo, useState } from "react";
import { BalanceCard } from "../components/BalanceCard";
import { DailyNavigation } from "../components/DailyNavigation";
import { DeleteDialog } from "../components/DeleteDialog";
import { EntryCard } from "../components/EntryCard";
import { EntryForm } from "../components/EntryForm";
import { EntryTable } from "../components/EntryTable";
import { Header } from "../components/Header";
import { MonthlySummary } from "../components/MonthlySummary";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
} from "../services/cashEntryService";
import type { CashEntry, CashEntryInput } from "../types/cashEntry";
import {
  calculateCurrentBalance,
  calculateDayTotals,
  calculateRunningBalances,
  filterByDate,
} from "../utils/calculations";
import { todayISO } from "../utils/formatters";

type View = "daily" | "monthly";

export function CashJournal() {
  const [view, setView] = useState<View>("daily");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CashEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<CashEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEntries = useCallback(async () => {
    setError("");
    const data = await getEntries();
    setEntries(data);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    void loadEntries()
      .catch(() => setError("تعذر تحميل الحركات من قاعدة البيانات."))
      .finally(() => setLoading(false));
  }, [loadEntries]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const dayEntries = useMemo(
    () => filterByDate(entries, selectedDate),
    [entries, selectedDate],
  );
  const dayTotals = useMemo(
    () => calculateDayTotals(dayEntries),
    [dayEntries],
  );
  const currentBalance = useMemo(
    () => calculateCurrentBalance(entries),
    [entries],
  );
  const runningBalances = useMemo(
    () => calculateRunningBalances(entries),
    [entries],
  );

  function openAddForm() {
    setEditingEntry(null);
    setFormOpen(true);
  }

  function openEditForm(entry: CashEntry) {
    setEditingEntry(entry);
    setFormOpen(true);
  }

  async function handleSave(input: CashEntryInput) {
    if (editingEntry) {
      await updateEntry(editingEntry.id, input);
      await loadEntries();
      setMessage("تم تعديل الحركة بنجاح");
      return;
    }

    await createEntry(input);
    await loadEntries();
    setSelectedDate(input.date);
    setMessage("تمت إضافة الحركة بنجاح");
  }

  async function handleDelete() {
    if (!deletingEntry) return;
    setDeleting(true);
    try {
      await deleteEntry(deletingEntry.id);
      await loadEntries();
      setDeletingEntry(null);
    } catch {
      setError("تعذر حذف الحركة.");
    } finally {
      setDeleting(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-xl border border-ledger-line bg-ledger-paper p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-ledger-ink">دفتر الصندوق</h1>
          <p className="mt-4 text-ledger-ink">
            يجب إعداد قاعدة بيانات Supabase أولاً حتى تُحفظ الحركات بشكل دائم.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pr-5 text-sm leading-7 text-ledger-ink">
            <li>أنشئ مشروعاً في Supabase.</li>
            <li>نفّذ ملف supabase/schema.sql من SQL Editor.</li>
            <li>
              انسخ ملف .env.example إلى .env وأضف:
              <br />
              VITE_SUPABASE_URL
              <br />
              VITE_SUPABASE_ANON_KEY
            </li>
            <li>أعد تشغيل التطبيق.</li>
          </ol>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentView={view} onChangeView={setView} />

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6">
        {message && (
          <p className="rounded-lg bg-ledger-in-soft px-4 py-3 text-sm font-semibold text-ledger-in">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-ledger-out-soft px-4 py-3 text-sm font-semibold text-ledger-out">
            {error}
          </p>
        )}

        {view === "monthly" ? (
          <MonthlySummary entries={entries} />
        ) : (
          <>
            <DailyNavigation
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
            />
            <BalanceCard
              currentBalance={currentBalance}
              dayIncome={dayTotals.income}
              dayExpense={dayTotals.expense}
            />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-ledger-ink">
                حركات اليوم
              </h3>
              <button
                type="button"
                onClick={openAddForm}
                className="rounded-lg bg-ledger-ink px-4 py-2 text-sm font-bold text-white"
              >
                + إضافة حركة
              </button>
            </div>

            {loading ? (
              <p className="rounded-xl border border-ledger-line bg-ledger-paper p-6 text-center text-ledger-muted">
                جاري التحميل...
              </p>
            ) : dayEntries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ledger-line bg-ledger-paper p-8 text-center">
                <p className="font-semibold text-ledger-ink">
                  لا توجد حركات لهذا اليوم
                </p>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 rounded-lg bg-ledger-ink px-4 py-2 text-sm font-bold text-white"
                >
                  + إضافة حركة
                </button>
              </div>
            ) : (
              <>
                <EntryTable
                  entries={dayEntries}
                  runningBalances={runningBalances}
                  onEdit={openEditForm}
                  onDelete={setDeletingEntry}
                />
                <div className="grid gap-3 md:hidden">
                  {dayEntries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      runningBalance={runningBalances.get(entry.id) ?? 0}
                      onEdit={openEditForm}
                      onDelete={setDeletingEntry}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      <EntryForm
        open={formOpen}
        selectedDate={selectedDate}
        entry={editingEntry}
        onClose={() => {
          setFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSave}
      />

      <DeleteDialog
        open={Boolean(deletingEntry)}
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeletingEntry(null)}
      />
    </div>
  );
}
