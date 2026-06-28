export type GrowthSummary = {
  totalPoints: number;
  levelNo: number;
  levelName: string;
  nextLevelName: string | null;
  pointsToNextLevel: number;
  badgesCount: number;
  checkInDays: number;
  completedLessons: number;
  submittedAssignments: number;
};

export type PointLedgerItem = {
  id: string;
  delta: number;
  reason: string;
  createdAt: string;
};

export type BadgeWallItem = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  awardedAt: string | null;
};

export interface GrowthRepository {
  getSummary(input: {
    userId: string;
    campId: string;
  }): Promise<GrowthSummary>;
  getPoints(input: {
    userId: string;
    campId: string;
  }): Promise<PointLedgerItem[]>;
  getBadges(input: {
    userId: string;
    campId: string;
  }): Promise<BadgeWallItem[]>;
}
