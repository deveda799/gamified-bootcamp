export const adminOverviewPlaceholder = {
  studentsCount: 0,
  todayCheckIns: 0,
  completedLessons: 0,
  submittedAssignments: 0
};

export type AdminScoreRow = {
  totalPoints: number;
  checkInDays: number;
  completedLessons: number;
  submittedAssignments: number;
};

export function mapAdminOverview(rows: AdminScoreRow[]) {
  return {
    studentsCount: rows.length,
    todayCheckIns: 0,
    completedLessons: rows.reduce(
      (sum, row) => sum + row.completedLessons,
      0
    ),
    submittedAssignments: rows.reduce(
      (sum, row) => sum + row.submittedAssignments,
      0
    )
  };
}

