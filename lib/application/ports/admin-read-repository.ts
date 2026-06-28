import type { LeaderboardPeriod, LeaderboardView } from "./leaderboard-repository";

export type AdminMembership = {
  organizationId: string;
  role: "owner" | "admin" | "assistant";
};

export interface AdminReadRepository {
  getMembership(userId: string): Promise<AdminMembership | null>;
  getOverview(organizationId: string): Promise<{
    studentsCount: number;
    todayCheckIns: number;
    completedLessons: number;
    submittedAssignments: number;
    badgesAwarded: number;
  }>;
  getStudents(organizationId: string): Promise<unknown[]>;
  getStudent(input: {
    organizationId: string;
    userId: string;
  }): Promise<unknown | null>;
  getSubmissions(organizationId: string): Promise<unknown[]>;
  getCheckIns(organizationId: string): Promise<unknown[]>;
  getLeaderboard(input: {
    organizationId: string;
    campId: string;
    viewerUserId: string;
    period: LeaderboardPeriod;
  }): Promise<LeaderboardView>;
}
