"use client";

import { useEffect, useState } from "react";
import { ApiState } from "@/components/student/ApiState";
import { LeaderboardList } from "@/components/student/LeaderboardList";

type LeaderboardItem = {
  rankNo: number;
  displayName: string;
  totalPoints: number;
  submittedAssignments: number;
  checkInDays: number;
};

export function LeaderboardClient() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setItems(result.data.items);
      })
      .catch(() => setError("英雄榜加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <ApiState error={error} isLoading={isLoading} />;
  }

  return <LeaderboardList items={items} />;
}
