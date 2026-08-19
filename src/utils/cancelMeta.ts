const MARKER = "<<<CAISSE_CANCELLED>>>";

export interface CancelMeta {
  at: string;
  reason: string | null;
  notes: string | null;
}

export function encodeCancelledNotes(
  originalNotes: string | null,
  reason: string,
  cancelledAt: string,
): string {
  return [
    MARKER,
    cancelledAt,
    reason.replace(/\r?\n/g, " "),
    originalNotes ?? "",
  ].join("\n");
}

export function parseCancelledNotes(notes: string | null): CancelMeta | null {
  if (!notes) return null;
  const normalized = notes.replace(/\r\n/g, "\n").trim();
  if (!normalized.startsWith(MARKER)) return null;
  const [, at = "", reason = "", ...rest] = normalized.split("\n");
  const original = rest.join("\n").trim();
  return {
    at: at.trim(),
    reason: reason.trim() || null,
    notes: original || null,
  };
}

export function isCancelledRecord(row: {
  status?: unknown;
  notes?: unknown;
}): boolean {
  if (row.status === "cancelled") return true;
  return Boolean(parseCancelledNotes(typeof row.notes === "string" ? row.notes : null));
}
