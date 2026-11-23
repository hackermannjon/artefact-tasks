import { taskListInput, taskListPaging } from "@/features/tasks/taskListQuery";
import { TaskListView } from "@/features/tasks/views/TaskListView";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// The list lives in server memory and changes at runtime, so never prerender it.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Only the first page is rendered on the server; the rest loads as the user scrolls.
  await getQueryClient().prefetchInfiniteQuery(trpc.task.list.infiniteQueryOptions(taskListInput, taskListPaging));
  return (
    <HydrateClient>
      <TaskListView />
    </HydrateClient>
  );
}
