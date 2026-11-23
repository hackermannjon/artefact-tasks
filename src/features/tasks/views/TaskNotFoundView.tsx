import { NotFoundView } from "@/components/layout/NotFoundView";

export function TaskNotFoundView() {
  return (
    <NotFoundView title="Task not found">
      This task no longer exists. It may have been deleted.
    </NotFoundView>
  );
}
