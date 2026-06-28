import { CoursePath } from "@/components/student/CoursePath";
import { getCoursePath } from "@/lib/application/use-cases/course";
import {
  createAuthDependencies,
  requirePageUser
} from "@/lib/composition/request";

export default async function CoursePage() {
  const user = await requirePageUser();
  const data = await getCoursePath(user.id, await createAuthDependencies());

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-muted">成长路径</p>
        <h1 className="text-2xl font-bold text-forest">课程学习</h1>
      </header>
      {data.modules.map((module) => (
        <CoursePath
          key={module.id}
          moduleTitle={module.title}
          lessons={module.lessons}
        />
      ))}
    </div>
  );
}
