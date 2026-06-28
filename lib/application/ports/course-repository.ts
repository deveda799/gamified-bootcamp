export type CourseLessonStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type CoursePath = {
  campId: string;
  campTitle: string;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      status: CourseLessonStatus;
    }[];
  }[];
};

export type LessonAsset = {
  id: string;
  type: "image" | "video" | "audio" | "pdf" | "file" | "prompt";
  title: string;
  url: string | null;
  content: string | null;
};

export type LessonDetail = {
  id: string;
  title: string;
  summary: string | null;
  contentMd: string;
  status: CourseLessonStatus;
  assets: LessonAsset[];
  assignment: { id: string; title: string } | null;
};

export type LessonCompletionResult = {
  lessonId: string;
  alreadyCompleted: boolean;
  pointsAdded: number;
  completedLessons: number;
  newBadges: string[];
};

export interface CourseRepository {
  getPath(input: { userId: string; campId: string }): Promise<CoursePath>;
  getLesson(input: {
    userId: string;
    lessonId: string;
  }): Promise<LessonDetail | null>;
  completeLesson(input: {
    userId: string;
    lessonId: string;
    now: Date;
  }): Promise<LessonCompletionResult>;
}
