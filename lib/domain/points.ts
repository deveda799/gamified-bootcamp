export type PointEventType =
  | "profile_completed"
  | "daily_check_in"
  | "lesson_completed"
  | "assignment_submitted";

export type PointEventInput = {
  eventType: PointEventType;
  enrollmentId: string;
  targetId: string;
};

export function buildPointEventKey(input: PointEventInput): string {
  return `${input.eventType}:${input.enrollmentId}:${input.targetId}`;
}

