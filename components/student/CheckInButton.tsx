"use client";

import { useState } from "react";
import { formatActionFeedback, type ActionFeedback } from "@/lib/client/action-feedback";
import { ActionMessage } from "@/components/student/ActionMessage";

export function CheckInButton() {
  const [feedback, setFeedback] = useState<ActionFeedback>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckIn() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
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
        className="mt-4 min-h-12 w-full rounded-button bg-action px-5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        disabled={isLoading}
        onClick={handleCheckIn}
        type="button"
      >
        {isLoading ? "签到中…" : "今日签到"}
      </button>
      <ActionMessage feedback={feedback} />
    </div>
  );
}
