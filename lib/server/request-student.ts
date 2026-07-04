import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./auth";
import { getMvpStore } from "./sqlite";

export async function getRequestStudent() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  return getMvpStore().getStudentByToken(token);
}
