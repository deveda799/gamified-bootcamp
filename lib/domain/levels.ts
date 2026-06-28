export type LevelRule = {
  levelNo: number;
  levelName: string;
  minPoints: number;
};

export type CurrentLevel = {
  levelNo: number;
  levelName: string;
  minPoints: number;
  nextLevelName: string | null;
  pointsToNextLevel: number;
};

export const defaultLevelRules: LevelRule[] = [
  { levelNo: 1, levelName: "觉醒者", minPoints: 0 },
  { levelNo: 2, levelName: "探索者", minPoints: 100 },
  { levelNo: 3, levelName: "架构师", minPoints: 250 },
  { levelNo: 4, levelName: "训练师", minPoints: 450 },
  { levelNo: 5, levelName: "炼金师", minPoints: 700 },
  { levelNo: 6, levelName: "创造者", minPoints: 1000 },
  { levelNo: 7, levelName: "超级个体", minPoints: 1500 }
];

export function calculateCurrentLevel(
  totalPoints: number,
  rules: LevelRule[] = defaultLevelRules
): CurrentLevel {
  const orderedRules = [...rules].sort((a, b) => a.minPoints - b.minPoints);
  const current =
    [...orderedRules].reverse().find((rule) => totalPoints >= rule.minPoints) ??
    orderedRules[0];
  const next =
    orderedRules.find((rule) => rule.minPoints > current.minPoints) ?? null;

  return {
    levelNo: current.levelNo,
    levelName: current.levelName,
    minPoints: current.minPoints,
    nextLevelName: next?.levelName ?? null,
    pointsToNextLevel: next ? Math.max(next.minPoints - totalPoints, 0) : 0
  };
}

