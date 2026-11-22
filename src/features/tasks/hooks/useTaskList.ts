"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { formatCreatedAt } from "@/lib/dates";
import { useTimeZone } from "@/lib/useTimeZone";
import { useTRPC } from "@/trpc/react";

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  createdAtIso: string;
  createdAtLabel: string;
};

export function useTaskList() {
  const trpc = useTRPC();
  const timeZone = useTimeZone();
  // Already in the cache from the server render, so this never suspends on first load.
  const { data } = useSuspenseQuery(trpc.task.list.queryOptions());

  const tasks: TaskItem[] = data.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    createdAtIso: task.createdAt.toISOString(),
    createdAtLabel: formatCreatedAt(task.createdAt, timeZone),
  }));

  return {
    tasks,
    countLabel: tasks.length === 1 ? "1 task" : `${tasks.length} tasks`,
  };
}
