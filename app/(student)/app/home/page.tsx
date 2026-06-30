"use client";

import { useMockMvp } from "@/components/student/MockMvpProvider";
import { Card } from "@/components/ui/Card";
import { camp, getCurrentLesson, getLevel } from "@/lib/mockData";
import Link from "next/link";

export default function StudentHomePage() {
  const { progress, checkIn } = useMockMvp();
  const level = getLevel(progress.points);
  const currentLesson = getCurrentLesson(progress);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 p-6 text-white shadow-lg shadow-violet-200">
        <p className="text-sm font-medium text-white/75">{camp.name}</p>
        <h1 className="mt-3 text-2xl font-bold leading-tight">
          嗨，今天先完成
          <br />
          一个关键行动 ✨
        </h1>
        <p className="mt-3 text-sm text-white/80">{camp.greeting}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{
              width: `${Math.round(
                (progress.completedLessonIds.length / 14) * 100
              )}%`
            }}
          />
        </div>
      </section>

      <Card className="border border-violet-100 p-5 shadow-md shadow-violet-100/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
              今日任务
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Day {currentLesson.day} · {currentLesson.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {currentLesson.summary}
            </p>
          </div>
          <span className="ml-3 rounded-2xl bg-violet-100 p-3 text-2xl">🎯</span>
        </div>
        <Link
          className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 font-bold text-white shadow-md shadow-violet-200"
          href={`/app/course/${currentLesson.id}`}
        >
          去完成今日任务
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border border-blue-50 p-5">
          <p className="text-sm text-slate-500">当前积分</p>
          <p className="mt-2 text-3xl font-black text-blue-600">
            {progress.points}
          </p>
        </Card>
        <Card className="border border-violet-50 p-5">
          <p className="text-sm text-slate-500">当前等级</p>
          <p className="mt-3 text-lg font-black text-violet-700">{level.name}</p>
        </Card>
      </div>

      <Card className="flex items-center justify-between border border-amber-100 bg-amber-50/70 p-5">
        <div>
          <p className="font-bold text-slate-900">
            {progress.checkedInToday ? "今日已签到" : "别忘了今日签到"}
          </p>
          <p className="mt-1 text-sm text-slate-500">签到可获得 +5 积分</p>
        </div>
        <button
          className={`min-h-11 rounded-xl px-4 text-sm font-bold ${
            progress.checkedInToday
              ? "bg-white text-emerald-600"
              : "bg-amber-400 text-amber-950"
          }`}
          disabled={progress.checkedInToday}
          onClick={checkIn}
          type="button"
        >
          {progress.checkedInToday ? "已完成 ✓" : "今日签到"}
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link
          className="flex min-h-14 items-center justify-center rounded-2xl border border-violet-200 bg-white font-bold text-violet-700"
          href="/app/course"
        >
          去学习
        </Link>
        <Link
          className="flex min-h-14 items-center justify-center rounded-2xl bg-slate-900 font-bold text-white"
          href={`/app/submit/${currentLesson.id}`}
        >
          去交作业
        </Link>
      </div>
    </div>
  );
}
