import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function GrowthSummaryCard({
  totalPoints,
  levelName,
  pointsToNextLevel
}: {
  totalPoints: number;
  levelName: string;
  pointsToNextLevel: number;
}) {
  return (
    <Card>
      <p className="text-sm text-muted">当前等级</p>
      <h1 className="mt-1 text-2xl font-bold text-forest">{levelName}</h1>
      <p className="mt-2 text-sm text-muted">{totalPoints} 经验值 · 距离下一等级还差 {pointsToNextLevel} 经验值</p>
      <div className="mt-4">
        <ProgressBar value={35} />
      </div>
    </Card>
  );
}
