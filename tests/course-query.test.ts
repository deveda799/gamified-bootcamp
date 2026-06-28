import assert from "node:assert/strict";
import test from "node:test";
import { mapCoursePath } from "../lib/queries/course.ts";

test("maps modules and lessons into course path sections", () => {
  const result = mapCoursePath([
    {
      moduleId: "module-1",
      moduleTitle: "模块 01 · 人生说明书",
      lessonId: "lesson-1",
      lessonTitle: "认识人生操作系统",
      lessonStatus: "completed"
    },
    {
      moduleId: "module-1",
      moduleTitle: "模块 01 · 人生说明书",
      lessonId: "lesson-2",
      lessonTitle: "找到你的价值排序",
      lessonStatus: "not_started"
    }
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].moduleTitle, "模块 01 · 人生说明书");
  assert.equal(result[0].lessons.length, 2);
  assert.equal(result[0].lessons[0].status, "completed");
});

