import { Card } from "@/components/ui/Card";

export function LeaderboardList({
  items
}: {
  items: readonly {
    rankNo: number;
    displayName: string;
    totalPoints: number;
    submittedAssignments?: number;
    checkInDays?: number;
  }[];
}) {
  return (
    <Card>
      <h2 className="font-bold text-forest">本期成果榜</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="flex items-center justify-between rounded-2xl bg-warm p-3" key={`${item.rankNo}-${item.displayName}`}>
            <div>
              <p className="font-semibold">#{item.rankNo} {item.displayName}</p>
              <p className="text-xs text-muted">
                作业 {item.submittedAssignments ?? 0} · 签到 {item.checkInDays ?? 0}
              </p>
            </div>
            <p className="text-lg font-bold text-forest">{item.totalPoints}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
