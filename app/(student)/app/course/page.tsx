"use client";

import { useMvp } from "@/components/student/ServerMvpProvider";
import { camp, getLessonStatus, lessons } from "@/lib/mockData";
import Link from "next/link";

const statusCopy = {
  completed: { label: "已完成", icon: "✓", className: "bg-emerald-50 text-emerald-600" },
  current: { label: "进行中", icon: "▶", className: "bg-violet-100 text-violet-700" },
  locked: { label: "未解锁", icon: "锁", className: "bg-slate-100 text-slate-400" }
};

export default function CoursePage() {
  const { progress } = useMvp();

  return (
    <div className="space-y-5">
      <header className="rounded-[28px] bg-gradient-to-r from-violet-600 to-blue-500 p-6 text-white">
        <p className="text-sm font-medium text-white/75">{camp.pathTitle}</p>
        <h1 className="mt-2 text-2xl font-bold">关卡地图</h1>
        <p className="mt-2 text-sm text-white/75">{camp.pathSubtitle}</p>
      </header>

      <div className="space-y-3">
        {lessons.map((lesson) => {
          const status = getLessonStatus(progress, lesson);
          const copy = statusCopy[status];
          const content = (
            <div
              className={`flex items-center rounded-2xl border p-4 ${
                status === "current"
                  ? "border-violet-200 bg-white shadow-md shadow-violet-100"
                  : "border-slate-100 bg-white/80"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${copy.className}`}
              >
                {status === "locked" ? copy.icon : `D${lesson.day}`}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400">
                  DAY {String(lesson.day).padStart(2, "0")}
                </p>
                <h2 className="mt-1 truncate font-bold text-slate-800">
                  {lesson.title}
                </h2>
              </div>
              <span className={`ml-3 rounded-full px-3 py-1 text-xs font-bold ${copy.className}`}>
                {copy.label}
              </span>
            </div>
          );

          return status === "locked" ? (
            <div key={lesson.id}>{content}</div>
          ) : (
            <Link href={`/app/course/${lesson.id}`} key={lesson.id}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
