import { AssignmentForm } from "@/components/student/AssignmentForm";

export default async function AssignmentPage({
  params
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;

  return <AssignmentForm assignmentId={assignmentId} />;
}
