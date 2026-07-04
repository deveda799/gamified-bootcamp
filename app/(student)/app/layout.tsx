import { BottomNav } from "@/components/student/BottomNav";
import { ServerMvpProvider } from "@/components/student/ServerMvpProvider";
import { requireCurrentStudent } from "@/lib/server/current-student";
import { getMvpStore } from "@/lib/server/sqlite";

export default async function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const student = await requireCurrentStudent();
  const progress = getMvpStore().getProgress(student.id);

  return (
    <ServerMvpProvider initialProgress={progress} student={student}>
      <main className="min-h-screen pb-28">
        <div className="mx-auto max-w-md px-4 py-5">{children}</div>
        <BottomNav />
      </main>
    </ServerMvpProvider>
  );
}
