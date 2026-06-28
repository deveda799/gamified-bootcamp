import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminSubmissionsClient } from "@/components/admin/AdminSubmissionsClient";

export default function AdminSubmissionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">作业查看</h1>
      <AdminFilters />
      <AdminSubmissionsClient />
    </div>
  );
}
