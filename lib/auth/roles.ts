export type MemberRole = "owner" | "admin" | "assistant" | "student";

const adminRoles: ReadonlySet<MemberRole> = new Set([
  "owner",
  "admin",
  "assistant"
]);

export function canAccessAdmin(role: MemberRole | null | undefined): boolean {
  return Boolean(role && adminRoles.has(role));
}

