import { NicknameLoginForm } from "@/components/auth/NicknameLoginForm";
import { getCurrentStudent } from "@/lib/server/current-student";
import StudentLayout from "./(student)/app/layout";
import StudentHomePage from "./(student)/app/home/page";

export default async function Page() {
  if (!(await getCurrentStudent())) return <NicknameLoginForm />;

  return (
    <StudentLayout>
      <StudentHomePage />
    </StudentLayout>
  );
}
