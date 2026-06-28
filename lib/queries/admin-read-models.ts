export type AdminStudentRow = {
  user_id: string;
  nickname: string;
  total_points: number;
  level_name: string;
  check_in_days: number;
  submitted_assignments: number;
};

export type AdminStudentItem = {
  userId: string;
  nickname: string;
  totalPoints: number;
  levelName: string;
  checkInDays: number;
  submittedAssignments: number;
};

export function mapAdminStudents(rows: AdminStudentRow[]): AdminStudentItem[] {
  return rows.map((row) => ({
    userId: row.user_id,
    nickname: row.nickname,
    totalPoints: row.total_points,
    levelName: row.level_name,
    checkInDays: row.check_in_days,
    submittedAssignments: row.submitted_assignments
  }));
}

export type AdminSubmissionRow = {
  id: string;
  assignment_title: string;
  nickname: string;
  status: string;
  submitted_at: string | null;
};

export type AdminSubmissionItem = {
  id: string;
  assignmentTitle: string;
  studentName: string;
  status: string;
  submittedAt: string | null;
};

export function mapAdminSubmissions(
  rows: AdminSubmissionRow[]
): AdminSubmissionItem[] {
  return rows.map((row) => ({
    id: row.id,
    assignmentTitle: row.assignment_title,
    studentName: row.nickname,
    status: row.status,
    submittedAt: row.submitted_at
  }));
}

export type AdminCheckInRow = {
  id: string;
  nickname: string;
  local_date: string;
  note: string | null;
};

export type AdminCheckInItem = {
  id: string;
  studentName: string;
  localDate: string;
  note: string | null;
};

export function mapAdminCheckIns(rows: AdminCheckInRow[]): AdminCheckInItem[] {
  return rows.map((row) => ({
    id: row.id,
    studentName: row.nickname,
    localDate: row.local_date,
    note: row.note
  }));
}

