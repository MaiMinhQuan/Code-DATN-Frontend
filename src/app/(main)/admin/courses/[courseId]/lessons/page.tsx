import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function AdminLessonsPage({ params }: PageProps) {
  const { courseId } = await params;
  redirect(`/admin/courses/${courseId}/edit`);
}
