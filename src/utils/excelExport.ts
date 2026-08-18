import * as XLSX from "xlsx";
import type { CashEntry } from "../types/cashEntry";
import { calculateRunningBalances, signedAmount } from "./calculations";
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
}

export function exportEntriesToExcel(
  entries: CashEntry[],
  labels: ExportLabels,
  filename: string,
) {
  const running = calculateRunningBalances(entries);
  const rows = entries.map((entry) => ({
    [labels.date]: formatDisplayDate(entry.date),
    [labels.type]: entry.type === "in" ? labels.incoming : labels.outgoing,
    [labels.amount]: signedAmount(entry),
    [labels.party]: entry.party ?? "",
    [labels.reason]: entry.reason ?? "",
    [labels.notes]: entry.notes ?? "",
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
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Caisse");
  XLSX.writeFile(workbook, filename);
}
