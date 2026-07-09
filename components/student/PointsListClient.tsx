"use client";

import { useEffect, useState } from "react";
import { ApiState } from "@/components/student/ApiState";
import { Card } from "@/components/ui/Card";

type PointItem = {
  id: string;
  eventType: string;
  delta: number;
  reason: string;
  createdAt: string;
};

export function PointsListClient() {
  const [items, setItems] = useState<PointItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/points")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setItems(result.data.items);
      })
      .catch(() => setError("经验值记录加载失败"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || error) {
    return <ApiState error={error} isLoading={isLoading} />;
  }

  if (items.length === 0) {
    return (
      <Card>
        <p className="font-semibold text-forest">暂无经验值记录</p>
        <p className="mt-2 text-sm text-muted">完成签到、关卡和闯关任务后会在这里展示。</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-forest">{item.reason}</p>
              <p className="mt-1 text-xs text-muted">{item.createdAt}</p>
            </div>
            <p className="text-lg font-bold text-action">+{item.delta}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
