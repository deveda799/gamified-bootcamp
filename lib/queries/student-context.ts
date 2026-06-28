export type EnrollmentStatus = "active" | "paused" | "completed" | "removed";

export type StudentEnrollmentRow = {
  enrollmentId: string;
  campId: string;
  status: EnrollmentStatus;
};

export function pickActiveEnrollment(
  rows: StudentEnrollmentRow[]
): StudentEnrollmentRow | null {
  return rows.find((row) => row.status === "active") ?? null;
}

