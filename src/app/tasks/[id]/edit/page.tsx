import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditTaskView } from "@/features/tasks/views/EditTaskView";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit task · Tasks" };

type Props = { params: Promise<{ id: string }> };

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  try {
    // fetchQuery (unlike prefetchQuery) throws, so a missing task becomes a real 404.
    await getQueryClient().fetchQuery(trpc.task.byId.queryOptions({ id }));
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
  return (
    <HydrateClient>
      <EditTaskView id={id} />
    </HydrateClient>
  );
}
