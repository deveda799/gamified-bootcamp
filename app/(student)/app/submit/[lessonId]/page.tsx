"use client";

import { useMvp } from "@/components/student/ServerMvpProvider";
import { getLessonById } from "@/lib/mockData";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SubmitPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId);
  const { progress, submitLesson } = useMvp();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(
    progress.submittedLessonIds.includes(lessonId)
  );

  if (!lesson) {
    return <p className="py-20 text-center text-slate-500">课程不存在</p>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitLesson(lessonId, text, link);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">打卡成功</h1>
        <p className="mt-3 text-slate-500">成长记录已保存，积分已更新</p>
        <Link
          className="mt-8 flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 font-bold text-white"
          href="/app/growth"
        >
          查看我的成长
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-violet-500">DAY {lesson.day} 作业</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">完成今日打卡</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {lesson.assignment}
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-sm font-bold text-slate-700">文字记录</span>
          <textarea
            className="mt-3 min-h-36 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm leading-6 outline-none ring-violet-200 focus:ring-2"
            onChange={(event) => setText(event.target.value)}
            placeholder="写下今天的发现、行动或感受…"
            value={text}
          />
        </label>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-700">图片记录</p>
          <button
            className="mt-3 flex min-h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 text-violet-500"
            type="button"
          >
            <span className="text-3xl">＋</span>
            <span className="mt-1 text-sm font-semibold">添加图片（演示占位）</span>
          </button>
        </div>

        <label className="block rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-sm font-bold text-slate-700">成果链接</span>
          <input
            className="mt-3 min-h-12 w-full rounded-xl bg-slate-50 px-3 text-sm outline-none ring-violet-200 focus:ring-2"
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://"
            type="url"
            value={link}
          />
        </label>

        <button
          className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 font-bold text-white shadow-lg shadow-violet-200"
          type="submit"
        >
          提交打卡 · +20 积分
        </button>
      </form>
    </div>
  );
}
