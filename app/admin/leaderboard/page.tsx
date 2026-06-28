import { LeaderboardList } from "@/components/student/LeaderboardList";
import { leaderboardPlaceholder } from "@/lib/queries/leaderboard";

export default function AdminLeaderboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest">排行榜查看</h1>
      <LeaderboardList items={leaderboardPlaceholder} />
    </div>
  );
}

