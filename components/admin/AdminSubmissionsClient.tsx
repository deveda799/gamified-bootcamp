"use client";

import { useEffect, useState } from "react";
import { AdminApiState } from "@/components/admin/AdminApiState";

type SubmissionItem = {
  id: string;
  assignmentTitle: string;
  studentName: string;
  status: string;
  submittedAt: string | null;
};

export function AdminSubmissionsClient() {
  const [items, setItems] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setItems(result.data.items);
      })
      .catch(() => setError("作业列表加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <AdminApiState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-sm">
      <div className="grid grid-cols-4 gap-3 border-b border-forest/10 p-4 text-sm font-semibold text-forest">
        <span>作业</span>
        <span>学员</span>
        <span>状态</span>
        <span>提交时间</span>
      </div>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-muted">暂无作业提交</p>
      ) : (
        items.map((item) => (
          <div className="grid grid-cols-4 gap-3 p-4 text-sm text-muted" key={item.id}>
            <span>{item.assignmentTitle}</span>
            <span>{item.studentName}</span>
            <span>{item.status}</span>
            <span>{item.submittedAt ?? "-"}</span>
          </div>
        ))
      )}
    </div>
  );
}

