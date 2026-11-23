"use client";

import { useWhenVisible } from "@/lib/useWhenVisible";
import { TASK_PAGE_SIZE } from "../taskListQuery";
import { useTaskList } from "./useTaskList";

/**
 * The task list plus what infinite scroll needs: a sentinel placed after the
 * last card. When it comes within 300px of the screen, the next page loads, so
 * it is usually there before the user reaches the end.
 *
 * The sentinel is remounted after every page (sentinelKey), so its observer
 * looks again: on a tall screen where it is still visible, the next page loads
 * too, and otherwise nothing happens until the user scrolls. After a failure
 * nothing retries on its own; "Try again" does.
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

  return { ...list, sentinelRef, sentinelKey: list.pageCount, footer, retry: loadMore };
}
