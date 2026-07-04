import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ADMIN_COOKIE, isAdminTokenValid } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";

  if (isAdminTokenValid(token, process.env.ADMIN_PASSWORD ?? "")) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
