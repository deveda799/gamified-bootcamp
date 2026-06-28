import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../lib/application/errors.ts";
import type { CheckInRepository } from "../lib/application/ports/check-in-repository.ts";
import type { CourseRepository } from "../lib/application/ports/course-repository.ts";
import type { EnrollmentRepository } from "../lib/application/ports/enrollment-repository.ts";
import type { GrowthRepository } from "../lib/application/ports/growth-repository.ts";
import type { ProfileRepository } from "../lib/application/ports/profile-repository.ts";
import {
  getCoursePath,
  getLesson
} from "../lib/application/use-cases/course.ts";
import { getStudentHome } from "../lib/application/use-cases/student-home.ts";

function createDependencies() {
  const enrollmentRepository: EnrollmentRepository = {
    async getActiveByUserId() {
      return {
        id: "enrollment-1",
        organizationId: "org-1",
        campId: "camp-1",
        campTitle: "AI人生操作系统创造营",
        courseId: "course-1",
        userId: "user-1",
        timezone: "Asia/Shanghai",
        startsAt: "2026-06-29T00:00:00.000Z"
      };
    }
  };
  const courseRepository: CourseRepository = {
    async getPath() {
      return {
        campId: "camp-1",
        campTitle: "AI人生操作系统创造营",
        modules: [
          {
            id: "module-1",
            title: "模块 01",
            lessons: [
              { id: "lesson-1", title: "第一课", status: "completed" },
              { id: "lesson-2", title: "第二课", status: "not_started" }
            ]
          }
        ]
      };
    },
    async getLesson() {
      return null;
    },
    async completeLesson() {
      throw new Error("not used");
    }
  };
  const profileRepository: ProfileRepository = {
    async getByUserId() {
      return {
        userId: "user-1",
        nickname: "Jenny",
        avatarUrl: null,
        leaderboardAnonymous: false
      };
    },
    async update() {
      throw new Error("not used");
    }
  };
  const growthRepository: GrowthRepository = {
    async getSummary() {
      return {
        totalPoints: 5,
        levelNo: 1,
        levelName: "觉醒者",
        nextLevelName: "探索者",
        pointsToNextLevel: 95,
        badgesCount: 1,
        checkInDays: 0,
        completedLessons: 1,
        submittedAssignments: 0
      };
    },
    async getPoints() {
      return [];
    },
    async getBadges() {
      return [];
    }
  };
  const checkInRepository: CheckInRepository = {
    async getMine() {
      return [];
    },
    async checkInToday() {
      throw new Error("not used");
    }
  };

  return {
    enrollmentRepository,
    courseRepository,
    profileRepository,
    growthRepository,
    checkInRepository
  };
}

test("student home selects the first incomplete lesson", async () => {
  const result = await getStudentHome(
    { userId: "user-1", now: new Date("2026-06-29T08:00:00.000Z") },
    createDependencies()
  );

  assert.equal(result.primaryAction.href, "/app/course/lesson-2");
  assert.equal(result.progressPercent, 50);
  assert.equal(result.nickname, "Jenny");
});

test("student home rejects a user without an active enrollment", async () => {
  const dependencies = createDependencies();
  dependencies.enrollmentRepository.getActiveByUserId = async () => null;

  await assert.rejects(
    () =>
      getStudentHome(
        { userId: "user-1", now: new Date() },
        dependencies
      ),
    (error) => error instanceof AppError && error.code === "NOT_FOUND"
  );
});

test("course path uses the current user's active camp", async () => {
  const result = await getCoursePath("user-1", createDependencies());
  assert.equal(result.campId, "camp-1");
});

test("lesson lookup returns NOT_FOUND when repository denies access", async () => {
  await assert.rejects(
    () => getLesson({ userId: "user-1", lessonId: "lesson-x" }, createDependencies()),
    (error) => error instanceof AppError && error.code === "NOT_FOUND"
  );
});
