import { Card } from "@/components/ui/Card";
import { CompleteLessonButton } from "@/components/student/CompleteLessonButton";
import type { LessonDetail } from "@/lib/application/ports/course-repository";

export function LessonContent({ lesson }: { lesson: LessonDetail }) {
  return (
    <Card>
      <p className="text-xs font-semibold text-action">关卡学习</p>
      <h1 className="mt-2 text-2xl font-bold text-forest">{lesson.title}</h1>
      {lesson.summary ? (
        <p className="mt-2 text-sm text-muted">{lesson.summary}</p>
      ) : null}
      <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-ink">
        {lesson.contentMd}
      </div>
      {lesson.assets.length > 0 ? (
        <div className="mt-5 space-y-2">
          {lesson.assets.map((asset) => (
            <div className="rounded-2xl bg-warm p-3 text-sm" key={asset.id}>
              <p className="font-semibold text-forest">{asset.title}</p>
              {asset.content ? (
                <pre className="mt-2 whitespace-pre-wrap font-sans text-xs">
                  {asset.content}
                </pre>
              ) : null}
              {asset.url ? (
                <a
                  className="mt-2 inline-block text-action underline"
                  href={asset.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  打开资源
                </a>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {lesson.status === "completed" ? (
        <p className="mt-5 text-sm font-semibold text-action">本课已完成</p>
      ) : (
        <CompleteLessonButton lessonId={lesson.id} />
      )}
    </Card>
  );
}
