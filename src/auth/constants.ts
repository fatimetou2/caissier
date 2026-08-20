export type UserRole = "admin" | "user";

export const ADMIN_EMAIL = "admin@gmail.com";
export const USER_EMAIL = "user@gmail.com";

const ROLE_BY_EMAIL: Record<string, UserRole> = {
  [ADMIN_EMAIL]: "admin",
  [USER_EMAIL]: "user",
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getRoleForEmail(email: string | null | undefined): UserRole | null {
  if (!email) return null;
  return ROLE_BY_EMAIL[normalizeEmail(email)] ?? null;
}

export function isAllowedEmail(email: string): boolean {
  return getRoleForEmail(email) !== null;
}
