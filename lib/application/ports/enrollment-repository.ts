export type ActiveEnrollment = {
  id: string;
  organizationId: string;
  campId: string;
  campTitle: string;
  courseId: string;
  userId: string;
  timezone: string;
  startsAt: string;
};

export interface EnrollmentRepository {
  getActiveByUserId(userId: string): Promise<ActiveEnrollment | null>;
}
