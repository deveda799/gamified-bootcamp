import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "./auth";
import { getMvpStore } from "./sqlite";

export async function getCurrentStudent() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  return getMvpStore().getStudentByToken(token);
}

export async function requireCurrentStudent() {
  const student = await getCurrentStudent();

  if (!student) redirect("/login");

  return student;
}
