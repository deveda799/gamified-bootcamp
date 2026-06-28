import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requirePageUser } from "@/lib/composition/request";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requirePageUser();

  return (
    <main className="min-h-screen bg-warm p-4">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section>{children}</section>
      </div>
    </main>
  );
}
