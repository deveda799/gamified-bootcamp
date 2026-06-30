import { BottomNav } from "@/components/student/BottomNav";
import { MockMvpProvider } from "@/components/student/MockMvpProvider";

export default function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <MockMvpProvider>
      <main className="min-h-screen pb-28">
        <div className="mx-auto max-w-md px-4 py-5">{children}</div>
        <BottomNav />
      </main>
    </MockMvpProvider>
  );
}
