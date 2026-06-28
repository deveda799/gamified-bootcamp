export type LessonStatus = "not_started" | "in_progress" | "completed";

export function getNextLessonStatus(completedAt?: string | null, openedAt?: string | null): LessonStatus {
  if (completedAt) return "completed";
  if (openedAt) return "in_progress";
  return "not_started";
}

