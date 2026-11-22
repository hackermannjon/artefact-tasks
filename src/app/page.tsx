import { TaskListView } from "@/features/tasks/views/TaskListView";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// The list lives in server memory and changes at runtime, so never prerender it.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  await getQueryClient().prefetchQuery(trpc.task.list.queryOptions());
  return (
    <HydrateClient>
      <TaskListView />
    </HydrateClient>
  );
}
