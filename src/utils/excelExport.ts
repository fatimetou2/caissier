import * as XLSX from "xlsx";
import type { CashEntry } from "../types/cashEntry";
import {
  calculateDayTotals,
  isCancelled,
  sortChronologically,
} from "./calculations";
import { formatDisplayDate } from "./formatters";

export interface ExportLabels {
  date: string;
  type: string;
  amount: string;
  party: string;
  reason: string;
  incoming: string;
  outgoing: string;
  status: string;
  statusActive: string;
  statusCancelled: string;
  summary: string;
  entries: string;
  label: string;
  value: string;
  totalIn: string;
  totalOut: string;
  netMovement: string;
  activeCount: string;
  cancelledCount: string;
  currency: string;
  period: string;
}

export interface ExportOptions {
  title?: string;
  period?: string;
  filename: string;
}

function sheetName(raw: string): string {
  return raw.replace(/[\\/*/?:[\]]/g, " ").trim().slice(0, 31) || "Caisse";
}

export function exportEntriesToExcel(
  entries: CashEntry[],
  labels: ExportLabels,
  options: ExportOptions,
): boolean {
  if (entries.length === 0) return false;

  const sorted = sortChronologically(entries);
  const totals = calculateDayTotals(sorted);
  const activeCount = sorted.filter((entry) => !isCancelled(entry)).length;
  const cancelledCount = sorted.length - activeCount;

  const detailRows = sorted.map((entry) => ({
    [labels.date]: formatDisplayDate(entry.date),
    [labels.type]: entry.type === "in" ? labels.incoming : labels.outgoing,
    [labels.amount]: entry.type === "in" ? entry.amount : -entry.amount,
    [labels.reason]: entry.reason ?? "",
    [labels.party]: entry.party ?? "",
    [labels.status]: isCancelled(entry)
      ? labels.statusCancelled
      : labels.statusActive,
    [labels.currency]: "MRU",
  }));

  const detailSheet = XLSX.utils.json_to_sheet(detailRows);
  detailSheet["!cols"] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 28 },
    { wch: 22 },
    { wch: 12 },
    { wch: 8 },
  ];

  const summaryRows = [
    { [labels.label]: labels.period, [labels.value]: options.period ?? "" },
    { [labels.label]: labels.totalIn, [labels.value]: totals.income },
    { [labels.label]: labels.totalOut, [labels.value]: totals.expense },
    { [labels.label]: labels.netMovement, [labels.value]: totals.net },
    { [labels.label]: labels.activeCount, [labels.value]: activeCount },
    { [labels.label]: labels.cancelledCount, [labels.value]: cancelledCount },
    { [labels.label]: labels.currency, [labels.value]: "MRU" },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 22 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    detailSheet,
    sheetName(options.title ?? labels.entries),
  );
  XLSX.utils.book_append_sheet(workbook, summarySheet, sheetName(labels.summary));
  XLSX.writeFile(workbook, options.filename);
  return true;
}
