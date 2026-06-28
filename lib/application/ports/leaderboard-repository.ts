export type LeaderboardPeriod = "total" | "week";

export type LeaderboardItem = {
  rankNo: number;
  userId: string;
  displayName: string;
  realName?: string;
  isAnonymous: boolean;
  totalPoints: number;
  submittedAssignments: number;
  checkInDays: number;
};

export type LeaderboardView = {
  period: LeaderboardPeriod;
  me: LeaderboardItem | null;
  items: LeaderboardItem[];
};

export interface LeaderboardRepository {
  getLeaderboard(input: {
    campId: string;
    viewerUserId: string;
    period: LeaderboardPeriod;
    viewer: "student" | "admin";
  }): Promise<LeaderboardView>;
}
