import type { Metadata } from "next";
import { CreateTaskView } from "@/features/tasks/views/CreateTaskView";

export const metadata: Metadata = { title: "New task · Tasks" };

export default function NewTaskPage() {
  return <CreateTaskView />;
}
