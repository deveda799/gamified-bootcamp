import { AdminCheckInsClient } from "@/components/admin/AdminCheckInsClient";

export default function AdminCheckInsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">签到查看</h1>
      <AdminCheckInsClient />
    </div>
  );
}
