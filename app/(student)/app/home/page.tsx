import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckInButton } from "@/components/student/CheckInButton";
import { TodayActionCard } from "@/components/student/TodayActionCard";
import { getStudentHome } from "@/lib/application/use-cases/student-home";
import {
  createAuthDependencies,
  requirePageUser
} from "@/lib/composition/request";

export default async function StudentHomePage() {
  const user = await requirePageUser();
  const dependencies = await createAuthDependencies();
  const data = await getStudentHome(
    { userId: user.id, now: new Date() },
    dependencies
  );

  return (
    <div className="space-y-4">
      <section className="rounded-card bg-forest p-5 text-white">
        <p className="text-sm opacity-80">DAY {String(data.dayNo).padStart(2, "0")} · {data.campTitle}</p>
        <h1 className="mt-3 text-2xl font-bold">早上好，{data.nickname} 🌱</h1>
        <div className="mt-4">
          <ProgressBar value={data.progressPercent} />
        </div>
      </section>

      <TodayActionCard
        title={data.primaryAction.title}
        href={data.primaryAction.href}
      />

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-muted">当前积分</p>
          <p className="mt-2 text-2xl font-bold text-forest">{data.totalPoints}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">当前等级</p>
          <p className="mt-2 text-xl font-bold text-forest">{data.levelName}</p>
        </Card>
      </div>

      <Card>
        <Badge>签到</Badge>
        <p className="mt-3 font-semibold text-forest">
          {data.checkedInToday ? "今日签到已完成" : "今日签到待完成"}
        </p>
        <p className="mt-1 text-sm text-muted">签到 +2 积分，每天仅一次。</p>
        {data.checkedInToday ? null : <CheckInButton />}
      </Card>
    </div>
  );
}
