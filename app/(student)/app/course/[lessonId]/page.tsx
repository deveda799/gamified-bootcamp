import { Card } from "@/components/ui/Card";
import { getLessonById } from "@/lib/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) notFound();

  return (
    <div className="space-y-5">
      <header className="rounded-[28px] bg-gradient-to-br from-violet-600 to-blue-500 p-6 text-white">
        <p className="text-sm font-bold text-white/70">
          DAY {String(lesson.day).padStart(2, "0")} · 今日关卡
        </p>
        <h1 className="mt-3 text-2xl font-bold leading-tight">{lesson.title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/80">{lesson.summary}</p>
      </header>

      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
          今日升级目标
        </p>
        <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
          {lesson.levelGoal}
        </p>
      </Card>

      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
          课程内容
        </p>
        <div className="mt-4 space-y-4">
          {lesson.content.map((paragraph, index) => (
            <div className="flex gap-3" key={paragraph}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                {index + 1}
              </span>
              <p className="text-sm leading-7 text-slate-600">{paragraph}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border border-blue-100 bg-blue-50/70 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
          今日闯关任务
        </p>
        <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
          {lesson.task}
        </p>
      </Card>

      <Card className="border border-violet-100 bg-violet-50/70 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
          今日解锁成就
        </p>
        <p className="mt-3 text-sm font-black text-slate-800">
          {lesson.achievement} · {lesson.experience}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {lesson.assetTip}
        </p>
      </Card>

      <Link
        className="flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 font-bold text-white shadow-lg shadow-violet-200"
        href={`/app/submit/${lesson.id}`}
      >
        提交闯关任务
      </Link>
    </div>
  );
}
