import { LessonContent } from "@/components/student/LessonContent";
import { Button } from "@/components/ui/Button";
import { getLesson } from "@/lib/application/use-cases/course";
import {
  createAuthDependencies,
  requirePageUser
} from "@/lib/composition/request";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = await requirePageUser();
  const lesson = await getLesson(
    { userId: user.id, lessonId },
    await createAuthDependencies()
  ).catch(() => notFound());

  return (
    <div className="space-y-4">
      <LessonContent lesson={lesson} />
      {lesson.assignment ? (
        <Button
          href={`/app/assignments/${lesson.assignment.id}`}
          variant="secondary"
        >
          作业打卡
        </Button>
      ) : null}
    </div>
  );
}
