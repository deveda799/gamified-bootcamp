import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminStudentsClient } from "@/components/admin/AdminStudentsClient";

export default function AdminStudentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">学员查看</h1>
      <AdminFilters />
      <AdminStudentsClient />
    </div>
  );
}
