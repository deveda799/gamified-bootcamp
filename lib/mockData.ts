export type Lesson = {
  id: string;
  day: number;
  title: string;
  summary: string;
  content: string[];
  assignment: string;
};

export type MockProgress = {
  points: number;
  checkedInToday: boolean;
  completedLessonIds: string[];
  submittedLessonIds: string[];
};

export const camp = {
  name: "AI 人生操作系统创造营",
  greeting: "今天也向理想生活前进一步",
  checkInPoints: 5,
  submissionPoints: 20
};

const lessonTitles = [
  "看见你真正想要的生活",
  "盘点当下的人生系统",
  "找到最值得突破的关键点",
  "设计你的理想一周",
  "建立稳定的晨间启动仪式",
  "用 AI 整理知识与灵感",
  "打造个人任务管理系统",
  "让学习成果真正落地",
  "建立高质量复盘习惯",
  "设计你的能量管理方案",
  "构建可持续的成长节奏",
  "完成一次公开表达",
  "整理你的个人成果集",
  "发布新版人生操作系统"
];

export const lessons: Lesson[] = lessonTitles.map((title, index) => {
  const day = index + 1;

  return {
    id: `day-${day}`,
    day,
    title,
    summary: `用一个小行动完成 Day ${day} 的成长任务。`,
    content: [
      "先用 10 分钟阅读今天的核心方法，写下最触动你的一个观点。",
      "结合自己的真实生活完成练习，不追求完美，只追求今天比昨天更清晰。",
      "完成后提交一份简短打卡，让行动留下可见的成长记录。"
    ],
    assignment: `写下你完成 Day ${day} 练习后的一个发现，以及明天准备采取的一个具体行动。`
  };
});

export const initialProgress: MockProgress = {
  points: 128,
  checkedInToday: false,
  completedLessonIds: ["day-1", "day-2", "day-3"],
  submittedLessonIds: ["day-1", "day-2", "day-3"]
};

export const badges = [
  { id: "starter", icon: "🌱", name: "破土新芽", requirement: 0 },
  { id: "focus", icon: "🎯", name: "专注行动", requirement: 140 },
  { id: "streak", icon: "🔥", name: "连续成长", requirement: 180 },
  { id: "creator", icon: "✨", name: "系统创造者", requirement: 260 }
];

export const leaderboard = [
  { name: "林晓", points: 186, avatar: "🌻" },
  { name: "你", points: 128, avatar: "🌱" },
  { name: "阿宁", points: 116, avatar: "🌙" },
  { name: "小禾", points: 98, avatar: "🍀" }
];

export function getLevel(points: number) {
  if (points >= 300) return { name: "Lv.4 创造者", nextAt: null };
  if (points >= 200) return { name: "Lv.3 行动派", nextAt: 300 };
  if (points >= 100) return { name: "Lv.2 探索者", nextAt: 200 };
  return { name: "Lv.1 新芽", nextAt: 100 };
}

export function applyCheckIn(progress: MockProgress): MockProgress {
  if (progress.checkedInToday) return progress;

  return {
    ...progress,
    checkedInToday: true,
    points: progress.points + camp.checkInPoints
  };
}

export function applySubmission(
  progress: MockProgress,
  lessonId: string
): MockProgress {
  if (progress.submittedLessonIds.includes(lessonId)) return progress;

  return {
    ...progress,
    points: progress.points + camp.submissionPoints,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    submittedLessonIds: [...progress.submittedLessonIds, lessonId]
  };
}

export function getLessonStatus(
  progress: MockProgress,
  lesson: Lesson
): "completed" | "current" | "locked" {
  if (progress.completedLessonIds.includes(lesson.id)) return "completed";

  const nextDay =
    Math.max(
      0,
      ...progress.completedLessonIds.map((id) =>
        Number(id.replace("day-", ""))
      )
    ) + 1;

  return lesson.day === nextDay ? "current" : "locked";
}

export function getCurrentLesson(progress: MockProgress) {
  return (
    lessons.find((lesson) => getLessonStatus(progress, lesson) === "current") ??
    lessons[lessons.length - 1]
  );
}

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
