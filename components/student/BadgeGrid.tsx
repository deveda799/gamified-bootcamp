import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const badges = ["觉醒者徽章", "人生架构师", "项目猎人", "知识炼金师", "数字分身创造者", "内容创造者", "坚持王", "超级个体"];

export function BadgeGrid() {
  return (
    <Card>
      <h2 className="font-bold text-forest">我的徽章墙</h2>
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

