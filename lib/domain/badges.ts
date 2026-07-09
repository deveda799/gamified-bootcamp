export type BadgeProgressInput = {
  totalPoints: number;
  checkInDays: number;
  completedLessons: number;
  submittedAssignments: number;
};

type BadgeRule = {
  name: string;
  isEarned: (input: BadgeProgressInput) => boolean;
};

const v1BadgeRules: BadgeRule[] = [
  {
    name: "觉醒者",
    isEarned: (input) => input.completedLessons >= 1
  },
  {
    name: "自我探索家",
    isEarned: (input) => input.completedLessons >= 2
  },
  {
    name: "人生架构师",
    isEarned: (input) => input.completedLessons >= 4
  },
  {
    name: "项目猎人",
    isEarned: (input) => input.submittedAssignments >= 3
  },
  {
    name: "知识炼金师",
    isEarned: (input) => input.submittedAssignments >= 5
  },
  {
    name: "Skill设计师",
    isEarned: (input) => input.totalPoints >= 700
  },
  {
    name: "AI助理创造者",
    isEarned: (input) => input.totalPoints >= 1000
  },
  {
    name: "飞轮启动者",
    isEarned: (input) => input.checkInDays >= 7
  },
  {
    name: "AI超级个体",
    isEarned: (input) => input.totalPoints >= 1500
  }
];

export function getEarnedBadgeNames(input: BadgeProgressInput): string[] {
  return v1BadgeRules
    .filter((rule) => rule.isEarned(input))
    .map((rule) => rule.name);
}
