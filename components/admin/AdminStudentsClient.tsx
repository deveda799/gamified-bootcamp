"use client";

import { useEffect, useState } from "react";
import { AdminApiState } from "@/components/admin/AdminApiState";

type StudentItem = {
  userId: string;
  nickname: string;
  totalPoints: number;
  levelName: string;
  checkInDays: number;
  submittedAssignments: number;
};

export function AdminStudentsClient() {
  const [items, setItems] = useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setItems(result.data.items);
      })
      .catch(() => setError("学员列表加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <AdminApiState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-sm">
      <div className="grid grid-cols-5 gap-3 border-b border-forest/10 p-4 text-sm font-semibold text-forest">
        <span>学员</span>
        <span>积分</span>
        <span>等级</span>
        <span>签到</span>
        <span>作业</span>
      </div>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-muted">暂无学员数据</p>
      ) : (
        items.map((item) => (
          <div className="grid grid-cols-5 gap-3 p-4 text-sm text-muted" key={item.userId}>
            <span>{item.nickname}</span>
            <span>{item.totalPoints}</span>
            <span>{item.levelName}</span>
            <span>{item.checkInDays}</span>
            <span>{item.submittedAssignments}</span>
          </div>
        ))
      )}
    </div>
  );
}

