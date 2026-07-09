import assert from "node:assert/strict";
import test from "node:test";
import { badges, camp, getLevel, lessons } from "../lib/mockData.ts";
import { defaultLevelRules } from "../lib/domain/levels.ts";
import { getEarnedBadgeNames } from "../lib/domain/badges.ts";

test("uses the AI life operating system positioning across course content", () => {
  assert.equal(camp.name, "AI人生操作系统创造营");
  assert.equal(
    camp.headline,
    "别再只会问AI了，开始打造你的AI人生操作系统"
  );
  assert.equal(
    camp.subtitle,
    "14天，把你的人生经验、知识和方法，沉淀成可复用的AI资产。"
  );

  assert.deepEqual(
    lessons.map((lesson) => lesson.title),
    [
      "创建人生角色卡",
      "完成人生说明书",
      "设计人生操作系统目录",
      "搭建AI人生操作系统",
      "建立个人核心档案",
      "解锁AI项目决策",
      "盘点可蒸馏经验",
      "打造第一套SOP",
      "设计你的专属Skill",
      "制作Skill雏形",
      "召唤AI助理",
      "训练AI助理V1.0",
      "启动成长飞轮",
      "AI超级个体毕业挑战"
    ]
  );

  assert.equal(lessons[0].achievement, "觉醒者");
  assert.equal(lessons[13].achievement, "AI超级个体");
  assert.match(lessons[9].assetTip, /Skill/);
});

test("uses the updated badge and level names", () => {
  assert.deepEqual(
    badges.map((badge) => badge.name),
    [
      "觉醒者",
      "自我探索家",
      "人生架构师",
      "项目猎人",
      "知识炼金师",
      "Skill设计师",
      "AI助理创造者",
      "飞轮启动者",
      "AI超级个体"
    ]
  );

  assert.deepEqual(
    defaultLevelRules.map((rule) => `Lv${rule.levelNo} ${rule.levelName}`),
    [
      "Lv1 新芽",
      "Lv2 探索者",
      "Lv3 架构师",
      "Lv4 猎人",
      "Lv5 炼金师",
      "Lv6 设计师",
      "Lv7 创造者",
      "Lv8 超级个体"
    ]
  );

  assert.equal(getLevel(0).name, "Lv1 新芽");
  assert.equal(getLevel(100).name, "Lv2 探索者");
  assert.deepEqual(
    getEarnedBadgeNames({
      totalPoints: 1500,
      checkInDays: 14,
      completedLessons: 14,
      submittedAssignments: 14
    }),
    [
      "觉醒者",
      "自我探索家",
      "人生架构师",
      "项目猎人",
      "知识炼金师",
      "Skill设计师",
      "AI助理创造者",
      "飞轮启动者",
      "AI超级个体"
    ]
  );
});
