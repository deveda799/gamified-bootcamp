export type PointLedgerRow = {
  id: string;
  event_type: string;
  delta: number;
  reason: string;
  created_at: string;
};

export type PointLedgerItem = {
  id: string;
  eventType: string;
  delta: number;
  reason: string;
  createdAt: string;
};

export function mapPointLedger(rows: PointLedgerRow[]): PointLedgerItem[] {
  return rows.map((row) => ({
    id: row.id,
    eventType: row.event_type,
    delta: row.delta,
    reason: row.reason,
    createdAt: row.created_at
  }));
}

export type BadgeDefinitionRow = {
  id: string;
  name: string;
  description: string;
  position: number;
};

export type BadgeAwardRow = {
  badge_id: string;
  awarded_at: string;
};

export type BadgeWallItem = {
  id: string;
  name: string;
  description: string;
  awardedAt: string | null;
};

export function mapBadgeWall(
  definitions: BadgeDefinitionRow[],
  awards: BadgeAwardRow[]
) {
  const awardByBadgeId = new Map(
    awards.map((award) => [award.badge_id, award.awarded_at])
  );
  const sortedDefinitions = [...definitions].sort(
    (a, b) => a.position - b.position
  );
  const items = sortedDefinitions.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    awardedAt: awardByBadgeId.get(badge.id) ?? null
  }));

  return {
    earned: items.filter((item) => item.awardedAt),
    locked: items.filter((item) => !item.awardedAt)
  };
}

export type LeaderboardRow = {
  rank_no: number;
  nickname: string;
  is_anonymous_on_leaderboard: boolean;
  total_points: number;
  submitted_assignments: number;
  check_in_days: number;
};

export type LeaderboardItem = {
  rankNo: number;
  displayName: string;
  totalPoints: number;
  submittedAssignments: number;
  checkInDays: number;
};

export function mapLeaderboardItems(rows: LeaderboardRow[]): LeaderboardItem[] {
  return rows.map((row) => ({
    rankNo: row.rank_no,
    displayName: row.is_anonymous_on_leaderboard ? "匿名学员" : row.nickname,
    totalPoints: row.total_points,
    submittedAssignments: row.submitted_assignments,
    checkInDays: row.check_in_days
  }));
}

