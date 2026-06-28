import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function TodayActionCard({
  title,
  href
}: {
  title: string;
  href: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-action">今日主任务</p>
        <p className="text-xs text-muted">持续成长</p>
      </div>
      <h2 className="mt-3 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-muted">完成后自动更新成长记录。</p>
      <div className="mt-4">
        <Button href={href}>开始行动</Button>
      </div>
    </Card>
  );
}
