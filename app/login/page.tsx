import { NicknameLoginForm } from "@/components/auth/NicknameLoginForm";
import { getCurrentStudent } from "@/lib/server/current-student";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  if (await getCurrentStudent()) redirect("/app/home");

  return <NicknameLoginForm />;
}
