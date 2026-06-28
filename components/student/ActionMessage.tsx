"use client";

import type { ActionFeedback } from "@/lib/client/action-feedback";

const styleByKind = {
  success: "bg-successLight/40 text-forest",
  info: "bg-growthGold/30 text-forest",
  error: "bg-danger/10 text-danger"
};

export function ActionMessage({ feedback }: { feedback: ActionFeedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <p className={`mt-3 rounded-2xl px-4 py-3 text-sm ${styleByKind[feedback.kind]}`}>
      {feedback.message}
    </p>
  );
}

