import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const badges = ["觉醒者", "自我探索家", "人生架构师", "项目猎人", "知识炼金师", "Skill设计师", "AI助理创造者", "飞轮启动者", "AI超级个体"];

export function BadgeGrid() {
  return (
    <Card>
      <h2 className="font-bold text-forest">我的成就墙</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div className="rounded-2xl bg-warm p-3" key={badge}>
            <Badge>{badge}</Badge>
            <p className="mt-2 text-xs text-muted">达成条件后自动点亮</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
