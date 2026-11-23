"use client";

import { useWhenVisible } from "@/lib/useWhenVisible";
import { TASK_PAGE_SIZE } from "../taskListQuery";
import { useTaskList } from "./useTaskList";

/**
 * The task list plus what infinite scroll needs: a sentinel placed after the
 * last card. When it comes within 300px of the screen, the next page loads, so
 * it is usually there before the user reaches the end.
 *
 * The observer only reports changes, and a load is skipped while any fetch of
 * the list runs (a refetch after a save, say). So the sentinel is remounted
 * after every page and whenever a fetch settles (sentinelKey): its observer
 * looks again, and if it is still on screen the next page loads; otherwise
 * nothing happens until the user scrolls. After a failure nothing retries on
 * its own; "Try again" does.
 */
export function useInfiniteTasks() {
  const list = useTaskList();
  const { hasMore, loadingMore, loadMoreFailed, loadMore } = list;

  const sentinelRef = useWhenVisible<HTMLDivElement>(() => {
    if (hasMore && !loadingMore && !loadMoreFailed) loadMore();
  }, "300px");

  const footer: "loading" | "failed" | "end" | null = loadMoreFailed
    ? "failed"
    : loadingMore
      ? "loading"
      : !hasMore && list.tasks.length > TASK_PAGE_SIZE
        ? "end"
        : null;

  return { ...list, sentinelRef, sentinelKey: `${list.pageCount}-${list.fetching ? "fetching" : "idle"}`, footer, retry: loadMore };
}
