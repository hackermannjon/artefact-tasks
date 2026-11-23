"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { formatCreatedAt } from "@/lib/dates";
import { useTimeZone } from "@/lib/useTimeZone";
import { useTRPC } from "@/trpc/react";
import { taskListInput, taskListPaging } from "../taskListQuery";
import { flattenPages } from "../taskPages";

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
  // The first page is already in the cache from the server render, so this never suspends on first load.
  const query = useSuspenseInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(taskListInput, taskListPaging),
  );

  const tasks: TaskItem[] = flattenPages(query.data.pages).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    createdAtIso: task.createdAt.toISOString(),
    createdAtLabel: formatCreatedAt(task.createdAt, timeZone),
  }));
  const total = query.data.pages.at(-1)?.total ?? 0;
  const { isFetching, fetchNextPage } = query;
  // Stable, so effects that depend on it do not re-run on every render.
  const loadMore = useCallback(() => {
    if (!isFetching) void fetchNextPage();
  }, [isFetching, fetchNextPage]);

  return {
    tasks,
    countLabel: total === 1 ? "1 task" : `${total} tasks`,
    pageCount: query.data.pages.length,
    hasMore: query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    loadMoreFailed: query.isFetchNextPageError,
    loadMore,
  };
}
