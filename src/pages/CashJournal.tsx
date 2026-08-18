import { useCallback, useEffect, useMemo, useState } from "react";
import { BalanceCard } from "../components/BalanceCard";
import { CancelDialog } from "../components/CancelDialog";
import { DailyNavigation } from "../components/DailyNavigation";
import { EntryCard } from "../components/EntryCard";
import { EntryForm } from "../components/EntryForm";
import { EntryTable } from "../components/EntryTable";
import { Header } from "../components/Header";
import { MonthlySummary } from "../components/MonthlySummary";
import { useLanguage } from "../i18n/LanguageContext";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  cancelEntry,
  claimOrphanEntries,
  createEntry,
  getEntries,
  updateEntry,
} from "../services/cashEntryService";
import type { CashEntry, CashEntryInput, EntryFilter } from "../types/cashEntry";
import {
  calculateDayTotals,
  calculateRunningBalances,
  filterByDate,
  filterByStatus,
  isCancelled,
} from "../utils/calculations";
import { exportEntriesToExcel } from "../utils/excelExport";
import { todayISO } from "../utils/formatters";

type View = "daily" | "monthly";

export function CashJournal() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("daily");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CashEntry | null>(null);
  const [cancellingEntry, setCancellingEntry] = useState<CashEntry | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EntryFilter>("active");

  const loadEntries = useCallback(async () => {
    setError("");
    await claimOrphanEntries().catch(() => undefined);
    const data = await getEntries();
    setEntries(data);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    void loadEntries()
      .catch(() => setError(t("loadFailed")))
      .finally(() => setLoading(false));
  }, [loadEntries, t]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const dayEntries = useMemo(
    () => filterByDate(entries, selectedDate),
    [entries, selectedDate],
  );
  const visibleDayEntries = useMemo(
    () => filterByStatus(dayEntries, statusFilter),
    [dayEntries, statusFilter],
  );
  const dayTotals = useMemo(
    () => calculateDayTotals(dayEntries),
    [dayEntries],
  );
  const runningBalances = useMemo(
    () => calculateRunningBalances(entries),
    [entries],
  );

  const excelLabels = {
    date: t("date"),
    type: t("type"),
    amount: t("amount"),
    party: t("party"),
    reason: t("reason"),
    notes: t("notes"),
    runningBalance: t("runningBalance"),
    incoming: t("incoming"),
    outgoing: t("outgoing"),
    status: t("status"),
    statusActive: t("statusActive"),
    statusCancelled: t("statusCancelled"),
    voidReason: t("voidReason"),
  };

  function exportDay() {
    exportEntriesToExcel(
      visibleDayEntries,
      excelLabels,
      `caisse-${selectedDate}.xlsx`,
    );
    setMessage(t("exported"));
  }

  function exportAll() {
    exportEntriesToExcel(entries, excelLabels, "caisse-complet.xlsx");
    setMessage(t("exported"));
  }

  function openAddForm() {
    setEditingEntry(null);
    setFormOpen(true);
  }

  function openEditForm(entry: CashEntry) {
    if (isCancelled(entry)) return;
    setEditingEntry(entry);
    setFormOpen(true);
  }

  async function handleSave(input: CashEntryInput) {
    if (editingEntry) {
      await updateEntry(editingEntry.id, input);
      await loadEntries();
      setMessage(t("updatedSuccess"));
      return;
    }

    await createEntry(input);
    await loadEntries();
    setSelectedDate(input.date);
    setMessage(t("addedSuccess"));
  }

  async function handleCancel(reason: string) {
    if (!cancellingEntry) return;
    setCancelling(true);
    try {
      await cancelEntry(cancellingEntry.id, reason);
      await loadEntries();
      setCancellingEntry(null);
      setMessage(t("voidedSuccess"));
    } catch {
      setError(t("voidFailed"));
    } finally {
      setCancelling(false);
    }
  }

  const filters: { id: EntryFilter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "active", label: t("filterActive") },
    { id: "cancelled", label: t("filterCancelled") },
  ];

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-xl border border-ledger-line bg-ledger-paper p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-ledger-ink">
            {t("appTitle")}
          </h1>
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
          <MonthlySummary
            entries={entries}
            onExported={() => setMessage(t("exported"))}
          />
        ) : (
          <>
            <DailyNavigation
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
            />
            <BalanceCard
              dayIncome={dayTotals.income}
              dayExpense={dayTotals.expense}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-ledger-ink">
                {t("todayEntries")}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportDay}
                  className="rounded-lg border border-ledger-line bg-white px-4 py-2 text-sm font-semibold"
                >
                  {t("exportDay")}
                </button>
                <button
                  type="button"
                  onClick={exportAll}
                  className="rounded-lg border border-ledger-line bg-white px-4 py-2 text-sm font-semibold"
                >
                  {t("exportAll")}
                </button>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="rounded-lg bg-ledger-ink px-4 py-2 text-sm font-bold text-white"
                >
                  {t("addEntry")}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                    statusFilter === filter.id
                      ? "border-ledger-ink bg-ledger-ink text-white"
                      : "border-ledger-line bg-white text-ledger-ink"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="rounded-xl border border-ledger-line bg-ledger-paper p-6 text-center text-ledger-muted">
                {t("loading")}
              </p>
            ) : visibleDayEntries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ledger-line bg-ledger-paper p-8 text-center">
                <p className="font-semibold text-ledger-ink">{t("noEntries")}</p>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 rounded-lg bg-ledger-ink px-4 py-2 text-sm font-bold text-white"
                >
                  {t("addEntry")}
                </button>
              </div>
            ) : (
              <>
                <EntryTable
                  entries={visibleDayEntries}
                  runningBalances={runningBalances}
                  onEdit={openEditForm}
                  onCancelEntry={setCancellingEntry}
                />
                <div className="grid gap-3 md:hidden">
                  {visibleDayEntries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      runningBalance={runningBalances.get(entry.id) ?? 0}
                      onEdit={openEditForm}
                      onCancelEntry={setCancellingEntry}
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

      <CancelDialog
        open={Boolean(cancellingEntry)}
        loading={cancelling}
        onConfirm={(reason) => void handleCancel(reason)}
        onClose={() => setCancellingEntry(null)}
      />
    </div>
  );
}
