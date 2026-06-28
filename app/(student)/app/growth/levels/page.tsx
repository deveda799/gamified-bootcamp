import { Card } from "@/components/ui/Card";
import { defaultLevelRules } from "@/lib/domain/levels";

export default function LevelsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">等级地图</h1>
      {defaultLevelRules.map((level) => (
        <Card key={level.levelNo}>
          <p className="text-sm text-muted">Lv{level.levelNo}</p>
          <p className="mt-1 text-xl font-bold text-forest">{level.levelName}</p>
          <p className="mt-1 text-sm text-muted">{level.minPoints} 积分解锁</p>
        </Card>
      ))}
    </div>
  );
}

