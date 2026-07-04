import { createHash, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "mvp_session";
export const ADMIN_COOKIE = "mvp_admin";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
  maxAge: 30 * 24 * 60 * 60
};

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function adminToken(password: string) {
  return digest(`gamified-bootcamp-admin:${password}`).toString("hex");
}

export function isAdminTokenValid(token: string, password: string) {
  if (!token || !password) return false;

  const actual = Buffer.from(token, "hex");
  const expected = digest(`gamified-bootcamp-admin:${password}`);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
