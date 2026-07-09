import assert from "node:assert/strict";
import test from "node:test";
import { calculateCurrentLevel } from "../lib/domain/levels.ts";

test("calculates Lv1 新芽 when total points are zero", () => {
  const result = calculateCurrentLevel(0);

  assert.equal(result.levelNo, 1);
  assert.equal(result.levelName, "新芽");
  assert.equal(result.nextLevelName, "探索者");
  assert.equal(result.pointsToNextLevel, 100);
});

test("calculates Lv2 探索者 at the 100 point threshold", () => {
  const result = calculateCurrentLevel(100);

  assert.equal(result.levelNo, 2);
  assert.equal(result.levelName, "探索者");
  assert.equal(result.nextLevelName, "架构师");
  assert.equal(result.pointsToNextLevel, 150);
});

test("calculates Lv8 超级个体 when total points reach the final threshold", () => {
  const result = calculateCurrentLevel(1500);

  assert.equal(result.levelNo, 8);
  assert.equal(result.levelName, "超级个体");
  assert.equal(result.nextLevelName, null);
  assert.equal(result.pointsToNextLevel, 0);
});
