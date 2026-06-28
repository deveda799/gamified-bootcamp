"use client";

import { useEffect, useState } from "react";
import { AdminApiState } from "@/components/admin/AdminApiState";

type CheckInItem = {
  id: string;
  studentName: string;
  localDate: string;
  note: string | null;
};

export function AdminCheckInsClient() {
  const [items, setItems] = useState<CheckInItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/check-ins")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setItems(result.data.items);
      })
      .catch(() => setError("签到列表加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <AdminApiState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-sm">
      <div className="grid grid-cols-3 gap-3 border-b border-forest/10 p-4 text-sm font-semibold text-forest">
        <span>学员</span>
        <span>日期</span>
        <span>备注</span>
      </div>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-muted">暂无签到记录</p>
      ) : (
        items.map((item) => (
          <div className="grid grid-cols-3 gap-3 p-4 text-sm text-muted" key={item.id}>
            <span>{item.studentName}</span>
            <span>{item.localDate}</span>
            <span>{item.note ?? "-"}</span>
          </div>
        ))
      )}
    </div>
  );
}

