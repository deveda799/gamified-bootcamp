"use client";

import { useMockMvp } from "@/components/student/MockMvpProvider";
import { badges, getLevel, leaderboard } from "@/lib/mockData";

export default function GrowthPage() {
  const { progress } = useMockMvp();
  const level = getLevel(progress.points);
  const ranking = leaderboard
    .map((entry) =>
      entry.name === "你" ? { ...entry, points: progress.points } : entry
    )
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-5">
      <header className="rounded-[28px] bg-gradient-to-br from-violet-600 to-blue-500 p-6 text-white shadow-lg shadow-violet-200">
        <p className="text-sm font-medium text-white/75">我的成长</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-4xl font-black">{progress.points}</p>
            <p className="mt-1 text-sm text-white/75">累计积分</p>
          </div>
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            {level.name}
          </span>
        </div>
        {level.nextAt ? (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-white/70">
              <span>升级进度</span>
              <span>还差 {level.nextAt - progress.points} 分</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${(progress.points / level.nextAt) * 100}%` }}
              />
            </div>
          </div>
        ) : null}
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">徽章墙</h2>
          <span className="text-sm text-slate-400">
            {badges.filter((badge) => progress.points >= badge.requirement).length}/
            {badges.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const earned = progress.points >= badge.requirement;
            return (
              <div
                className={`rounded-2xl border p-4 text-center ${
                  earned
                    ? "border-violet-100 bg-white"
                    : "border-slate-100 bg-slate-50 grayscale"
                }`}
                key={badge.id}
              >
                <span className={`text-4xl ${earned ? "" : "opacity-30"}`}>
                  {badge.icon}
                </span>
                <p className={`mt-2 text-sm font-bold ${earned ? "text-slate-800" : "text-slate-400"}`}>
                  {badge.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-900">本期排行榜</h2>
        <div className="mt-4 space-y-3">
          {ranking.map((entry, index) => (
            <div
              className={`flex items-center rounded-xl p-3 ${
                entry.name === "你" ? "bg-violet-50" : "bg-slate-50"
              }`}
              key={entry.name}
            >
              <span className="w-7 text-sm font-black text-slate-400">
                {index + 1}
              </span>
              <span className="text-2xl">{entry.avatar}</span>
              <span className="ml-3 flex-1 text-sm font-bold text-slate-700">
                {entry.name}
              </span>
              <span className="text-sm font-black text-violet-600">
                {entry.points} 分
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
