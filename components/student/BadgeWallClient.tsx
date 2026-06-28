"use client";

import { useEffect, useState } from "react";
import { ApiState } from "@/components/student/ApiState";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type BadgeItem = {
  id?: string;
  name: string;
  description?: string;
  awardedAt?: string | null;
};

export function BadgeWallClient() {
  const [earned, setEarned] = useState<BadgeItem[]>([]);
  const [locked, setLocked] = useState<BadgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/badges")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setEarned(result.data.earned);
        setLocked(
          result.data.locked.map((badge: string | BadgeItem) =>
            typeof badge === "string" ? { name: badge } : badge
          )
        );
      })
      .catch(() => setError("徽章数据加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <ApiState error={error} isLoading={isLoading} />;
  }

  return (
    <Card>
      <h2 className="font-bold text-forest">我的徽章墙</h2>
      <p className="mt-2 text-sm text-muted">已获得 {earned.length} 枚</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[...earned, ...locked].map((badge) => (
          <div className="rounded-2xl bg-warm p-3" key={badge.name}>
            <Badge>{badge.name}</Badge>
            <p className="mt-2 text-xs text-muted">
              {badge.awardedAt ? "已点亮" : "达成条件后自动点亮"}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
