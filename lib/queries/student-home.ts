import { calculateCurrentLevel } from "../domain/levels.ts";

export type StudentHomeView = {
  campTitle: string;
  dayNo: number;
  nickname: string;
  totalPoints: number;
  levelName: string;
  primaryActionTitle: string;
  primaryActionHref: string;
};

export type StudentHomeApiView = {
  camp: {
    id: string;
    title: string;
    dayNo: number;
  };
  profile: {
    nickname: string;
  };
  score: {
    totalPoints: number;
    levelNo: number;
    levelName: string;
    nextLevelName: string | null;
    pointsToNextLevel: number;
  };
  today: {
    checkedIn: boolean;
    primaryAction: {
      type: "lesson";
      lessonId: string;
      title: string;
      href: string;
      buttonText: string;
    };
  };
  badges: {
    latest: { name: string } | null;
  };
};

export type StudentHomeRaw = {
  campId: string;
  campTitle: string;
  startsAt: string;
  now: Date;
  nickname: string;
  totalPoints: number;
  checkedInToday: boolean;
  nextLessonId: string;
  nextLessonTitle: string;
  latestBadgeName: string | null;
};

export function mapStudentHome(input: StudentHomeRaw): StudentHomeApiView {
  const start = new Date(input.startsAt);
  const dayMs = 24 * 60 * 60 * 1000;
  const dayNo = Math.max(
    Math.floor((input.now.getTime() - start.getTime()) / dayMs) + 1,
    1
  );
  const level = calculateCurrentLevel(input.totalPoints);

  return {
    camp: {
      id: input.campId,
      title: input.campTitle,
      dayNo
    },
    profile: {
      nickname: input.nickname
    },
    score: {
      totalPoints: input.totalPoints,
      levelNo: level.levelNo,
      levelName: level.levelName,
      nextLevelName: level.nextLevelName,
      pointsToNextLevel: level.pointsToNextLevel
    },
    today: {
      checkedIn: input.checkedInToday,
      primaryAction: {
        type: "lesson",
        lessonId: input.nextLessonId,
        title: input.nextLessonTitle,
        href: `/app/course/${input.nextLessonId}`,
        buttonText: "继续学习"
      }
    },
    badges: {
      latest: input.latestBadgeName ? { name: input.latestBadgeName } : null
    }
  };
}
