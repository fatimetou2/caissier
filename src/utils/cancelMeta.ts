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
    reason.replaceAll("\n", " "),
    originalNotes ?? "",
  ].join("\n");
}

export function parseCancelledNotes(notes: string | null): CancelMeta | null {
  if (!notes?.startsWith(MARKER)) return null;
  const [, at = "", reason = "", ...rest] = notes.split("\n");
  const original = rest.join("\n").trim();
  return {
    at,
    reason: reason.trim() || null,
    notes: original || null,
  };
}
