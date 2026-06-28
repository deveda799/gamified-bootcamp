import { Card } from "@/components/ui/Card";

export default async function AdminStudentDetailPage({
  params
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">学员详情</h1>
      <Card>
        <p className="text-sm text-muted">用户 ID</p>
        <p className="mt-2 font-mono text-sm text-forest">{userId}</p>
        <p className="mt-4 text-sm text-muted">这里仅展示 V1 数据，不提供编辑、点评或删除操作。</p>
      </Card>
    </div>
  );
}
