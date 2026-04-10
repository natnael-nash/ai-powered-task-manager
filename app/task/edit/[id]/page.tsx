import { TaskForm } from "@/app/components/form/TaskForm";

export default async function EditTask({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <TaskForm id={id} />
    </div>
  );
}
