import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Lesson = {
  id: string;
  title: string;
  status: "not_started" | "in_progress" | "completed";
};

const statusLabel = {
  not_started: "未开始",
  in_progress: "学习中",
  completed: "已完成"
};

export function CoursePath({
  moduleTitle,
  lessons
}: {
  moduleTitle: string;
  lessons: readonly Lesson[];
}) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-forest">{moduleTitle}</h2>
      <div className="mt-4 space-y-3">
        {lessons.map((lesson) => (
          <Link
            className="block rounded-2xl border border-forest/10 bg-warm p-4"
            href={`/app/course/${lesson.id}`}
            key={lesson.id}
          >
            <p className="font-semibold">{lesson.title}</p>
            <p className="mt-1 text-xs text-muted">
              {statusLabel[lesson.status]}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
