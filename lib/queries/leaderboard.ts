import type { LeaderboardItem } from "./growth-read-models.ts";

export const leaderboardPlaceholder = [
  { rankNo: 1, displayName: "林晓", totalPoints: 345, submittedAssignments: 6, checkInDays: 9 },
  { rankNo: 2, displayName: "小雨", totalPoints: 310, submittedAssignments: 5, checkInDays: 8 },
  { rankNo: 3, displayName: "阿哩", totalPoints: 298, submittedAssignments: 5, checkInDays: 7 },
  { rankNo: 5, displayName: "Jenny（我）", totalPoints: 0, submittedAssignments: 0, checkInDays: 0 }
] satisfies LeaderboardItem[];
