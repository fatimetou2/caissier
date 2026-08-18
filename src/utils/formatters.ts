import type { Language } from "../i18n/translations";

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const FRENCH_MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function monthsFor(language: Language): string[] {
  return language === "fr" ? FRENCH_MONTHS : ARABIC_MONTHS;
}

export function toISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function parseISODate(isoDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

export function formatArabicDate(isoDate: string): string {
  return formatLongDate(isoDate, "ar");
}

export function formatLongDate(isoDate: string, language: Language = "ar"): string {
  const { year, month, day } = parseISODate(isoDate);
  return `${day} ${monthsFor(language)[month - 1]} ${year}`;
}

export function formatArabicMonth(year: number, month: number): string {
  return formatMonthTitle(year, month, "ar");
}

export function formatMonthTitle(
  year: number,
  month: number,
  language: Language = "ar",
): string {
  return `${monthsFor(language)[month - 1]} ${year}`;
}

export function monthNames(language: Language): string[] {
  return monthsFor(language);
}

export function formatDisplayDate(isoDate: string): string {
  const { year, month, day } = parseISODate(isoDate);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoney(value: number): string {
  return `${formatAmount(value)} MRU`;
}

export function formatSignedAmount(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatAmount(Math.abs(value))}`;
}

export function parseAmountInput(raw: string): number {
  const cleaned = raw.replace(/[,\s]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

export { ARABIC_MONTHS };
