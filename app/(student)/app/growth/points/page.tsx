import { PointsListClient } from "@/components/student/PointsListClient";

export default function PointsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">积分流水</h1>
      <PointsListClient />
    </div>
  );
}
