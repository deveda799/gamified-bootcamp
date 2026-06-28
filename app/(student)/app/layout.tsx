import { BottomNav } from "@/components/student/BottomNav";
import { requirePageUser } from "@/lib/composition/request";

export default async function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requirePageUser();

  return (
    <main className="min-h-screen bg-warm pb-24">
      <div className="mx-auto max-w-md px-4 py-5">{children}</div>
      <BottomNav />
    </main>
  );
}
