"use client";

import { useEffect, useState } from "react";
import { AdminApiState } from "@/components/admin/AdminApiState";
import { MetricCard } from "@/components/admin/MetricCard";

type Overview = {
  studentsCount: number;
  todayCheckIns: number;
  completedLessons: number;
  submittedAssignments: number;
};

export function AdminOverviewClient() {
  const [data, setData] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setData(result.data);
      })
      .catch(() => setError("后台总览加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (!data) {
    return <AdminApiState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <MetricCard label="学员数" value={data.studentsCount} />
      <MetricCard label="今日签到" value={data.todayCheckIns} />
      <MetricCard label="完成课程" value={data.completedLessons} />
      <MetricCard label="提交作业" value={data.submittedAssignments} />
    </div>
  );
}

