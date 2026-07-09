"use client";

import { useState } from "react";
import { ActionMessage } from "@/components/student/ActionMessage";
import { formatActionFeedback, type ActionFeedback } from "@/lib/client/action-feedback";

export function CompleteLessonButton({ lessonId }: { lessonId: string }) {
  const [feedback, setFeedback] = useState<ActionFeedback>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleComplete() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST"
      });
      const result = await response.json();
      setFeedback(formatActionFeedback(result));
    } catch {
      setFeedback({
        kind: "error",
        message: "网络异常，请稍后重试"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        className="mt-5 min-h-12 w-full rounded-button bg-action px-5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        disabled={isLoading}
        onClick={handleComplete}
        type="button"
      >
        {isLoading ? "记录中…" : "完成关卡 +5"}
      </button>
      <ActionMessage feedback={feedback} />
    </div>
  );
}
