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
    name: "觉醒者徽章",
    isEarned: (input) => input.completedLessons >= 1
  },
  {
    name: "人生架构师",
    isEarned: (input) => input.completedLessons >= 5
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
    name: "数字分身创造者",
    isEarned: (input) => input.totalPoints >= 700
  },
  {
    name: "内容创造者",
    isEarned: (input) => input.totalPoints >= 1000
  },
  {
    name: "坚持王",
    isEarned: (input) => input.checkInDays >= 7
  },
  {
    name: "超级个体",
    isEarned: (input) => input.totalPoints >= 1500
  }
];

export function getEarnedBadgeNames(input: BadgeProgressInput): string[] {
  return v1BadgeRules
    .filter((rule) => rule.isEarned(input))
    .map((rule) => rule.name);
}

