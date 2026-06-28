import { Button } from "@/components/ui/Button";
import { GrowthSummaryClient } from "@/components/student/GrowthSummaryClient";

export default function GrowthPage() {
  return (
    <div className="space-y-4">
      <GrowthSummaryClient />
      <div className="grid grid-cols-2 gap-3">
        <Button href="/app/growth/points" variant="secondary">积分流水</Button>
        <Button href="/app/growth/badges" variant="secondary">徽章墙</Button>
      </div>
      <Button href="/app/growth/levels">查看等级地图</Button>
    </div>
  );
}
