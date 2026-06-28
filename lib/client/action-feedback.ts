export type ActionFeedback =
  | {
      kind: "success" | "info" | "error";
      message: string;
    }
  | null;

type ApiResult =
  | {
      ok: true;
      data: {
        alreadyCheckedIn?: boolean;
        alreadyCompleted?: boolean;
        alreadySubmitted?: boolean;
        pointsAdded?: number;
        newBadges?: string[];
      };
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

export function formatActionFeedback(result: ApiResult): ActionFeedback {
  if (!result.ok) {
    return {
      kind: "error",
      message: result.error.message
    };
  }

  if (
    result.data.alreadyCheckedIn ||
    result.data.alreadyCompleted ||
    result.data.alreadySubmitted
  ) {
    return {
      kind: "info",
      message: "今天已经完成过了"
    };
  }

  const points = result.data.pointsAdded ?? 0;
  const badges = result.data.newBadges ?? [];
  const badgeText = badges.length > 0 ? `，新徽章：${badges.join("、")}` : "";

  return {
    kind: "success",
    message: `已完成，获得 ${points} 积分${badgeText}`
  };
}

