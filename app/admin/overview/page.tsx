import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">运营总览</h1>
      <AdminOverviewClient />
    </div>
  );
}
