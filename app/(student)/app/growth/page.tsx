"use client";

import { useMvp } from "@/components/student/ServerMvpProvider";
import { badges, camp, getLevel } from "@/lib/mockData";
import { useEffect } from "react";

export default function GrowthPage() {
  const { progress, student, leaderboard, refreshLeaderboard } = useMvp();
  const level = getLevel(progress.points);

  useEffect(() => {
    void refreshLeaderboard();
  }, [refreshLeaderboard]);

  return (
    <div className="space-y-5">
      <header className="rounded-[28px] bg-gradient-to-br from-violet-600 to-blue-500 p-6 text-white shadow-lg shadow-violet-200">
        <p className="text-sm font-medium text-white/75">{student.nickname} 的成长</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-4xl font-black">{progress.points}</p>
            <p className="mt-1 text-sm text-white/75">累计经验值</p>
          </div>
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            {level.name}
          </span>
        </div>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">成就墙</h2>
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
        <h2 className="text-lg font-black text-slate-900">本期英雄榜</h2>
        <div className="mt-4 space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              className={`flex items-center rounded-xl p-3 ${
                entry.nickname === student.nickname ? "bg-violet-50" : "bg-slate-50"
              }`}
              key={entry.nickname}
            >
              <span className="w-7 text-sm font-black text-slate-400">
                {index + 1}
              </span>
              <span className="text-2xl">👤</span>
              <span className="ml-3 flex-1 text-sm font-bold text-slate-700">
                {entry.nickname}
              </span>
              <span className="text-sm font-black text-violet-600">
                {entry.points} 经验值
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-violet-900 p-5 text-white shadow-lg shadow-violet-100">
        <p className="text-sm font-semibold text-white/70">毕业后继续升级</p>
        <h2 className="mt-2 text-xl font-black">{camp.graduationTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-white/75">
          {camp.graduationSubtitle}
        </p>
        <div className="mt-4 rounded-2xl bg-white/10 p-4">
          <p className="font-bold">{camp.upsellTitle}</p>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {camp.upsellDescription}
          </p>
        </div>
      </section>
    </div>
  );
}
