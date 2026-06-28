"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { GrowthSummaryCard } from "@/components/student/GrowthSummaryCard";
import { ApiState } from "@/components/student/ApiState";

type GrowthSummary = {
  totalPoints: number;
  levelName: string;
  pointsToNextLevel: number;
  checkInDays: number;
  completedLessons: number;
  submittedAssignments: number;
};

export function GrowthSummaryClient() {
  const [data, setData] = useState<GrowthSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/growth/summary")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setData(result.data);
      })
      .catch(() => setError("成长数据加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (!data) {
    return <ApiState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="space-y-4">
      <GrowthSummaryCard
        totalPoints={data.totalPoints}
        levelName={data.levelName}
        pointsToNextLevel={data.pointsToNextLevel}
      />
      <div className="grid grid-cols-3 gap-3">
        <Card><p className="text-xs text-muted">签到</p><p className="mt-2 text-xl font-bold text-forest">{data.checkInDays}</p></Card>
        <Card><p className="text-xs text-muted">课程</p><p className="mt-2 text-xl font-bold text-forest">{data.completedLessons}</p></Card>
        <Card><p className="text-xs text-muted">作业</p><p className="mt-2 text-xl font-bold text-forest">{data.submittedAssignments}</p></Card>
      </div>
    </div>
  );
}

