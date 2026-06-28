export type CoursePathRow = {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonStatus: "not_started" | "in_progress" | "completed";
};

export type CoursePathSection = {
  moduleId: string;
  moduleTitle: string;
  lessons: {
    id: string;
    title: string;
    status: CoursePathRow["lessonStatus"];
  }[];
};

export function mapCoursePath(rows: CoursePathRow[]): CoursePathSection[] {
  const sections = new Map<string, CoursePathSection>();

  for (const row of rows) {
    const existing = sections.get(row.moduleId);
    const section =
      existing ??
      {
        moduleId: row.moduleId,
        moduleTitle: row.moduleTitle,
        lessons: []
      };

    section.lessons.push({
      id: row.lessonId,
      title: row.lessonTitle,
      status: row.lessonStatus
    });
    sections.set(row.moduleId, section);
  }

  return Array.from(sections.values());
}
