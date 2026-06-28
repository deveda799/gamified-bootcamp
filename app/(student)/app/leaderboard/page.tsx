import { LeaderboardClient } from "@/components/student/LeaderboardClient";
import { Tabs } from "@/components/ui/Tabs";

export default function LeaderboardPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-muted">AI人生操作系统创造营</p>
        <h1 className="text-2xl font-bold text-forest">排行榜</h1>
      </header>
      <Tabs items={["总榜", "周榜"]} />
      <LeaderboardClient />
    </div>
  );
}
