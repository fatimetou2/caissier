import * as XLSX from "xlsx";
import type { CashEntry } from "../types/cashEntry";
import { calculateRunningBalances, isCancelled } from "./calculations";
import { formatDisplayDate } from "./formatters";

interface ExportLabels {
  date: string;
  type: string;
  amount: string;
  party: string;
  reason: string;
  notes: string;
  runningBalance: string;
  incoming: string;
  outgoing: string;
  status: string;
  statusActive: string;
  statusCancelled: string;
  voidReason: string;
}

export function exportEntriesToExcel(
  entries: CashEntry[],
  labels: ExportLabels,
  filename: string,
  startingBalance = 0,
) {
  const running = calculateRunningBalances(entries, startingBalance);
  const rows = entries.map((entry) => ({
    [labels.date]: formatDisplayDate(entry.date),
    [labels.type]: entry.type === "in" ? labels.incoming : labels.outgoing,
    [labels.amount]: entry.type === "in" ? entry.amount : -entry.amount,
    [labels.party]: entry.party ?? "",
    [labels.reason]: entry.reason ?? "",
    [labels.notes]: entry.notes ?? "",
    [labels.status]: isCancelled(entry)
      ? labels.statusCancelled
      : labels.statusActive,
    [labels.voidReason]: entry.cancel_reason ?? "",
    [labels.runningBalance]: running.get(entry.id) ?? 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 20 },
    { wch: 20 },
    { wch: 24 },
    { wch: 12 },
    { wch: 24 },
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Caisse");
  XLSX.writeFile(workbook, filename);
}
