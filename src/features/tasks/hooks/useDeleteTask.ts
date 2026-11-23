"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useTRPC } from "@/trpc/react";
import { describeSaveError, isNotFound } from "../taskFormRules";
import { taskListInput } from "../taskListQuery";
import { removeFromPages } from "../taskPages";
import type { TaskItem } from "./useTaskList";

// Matches the card's exit transition in TaskList.module.css.
export const EXIT_MS = 220;

/**
 * Asks before deleting, then removes the card only once the server confirmed,
 * so a failed request never makes a task vanish and come back. The card first
 * plays its exit, then leaves the cache: the list closes the gap without a jump.
 */
export function useDeleteTask() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const toast = useToast();
  const remove = useMutation(trpc.task.delete.mutationOptions());
  const [target, setTarget] = useState<TaskItem | null>(null);
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set());
  // Where keyboard focus goes once the card is gone: the dialog would hand it
  // back to the card's delete button, which is already inert.
  const focusAfterRef = useRef<HTMLHeadingElement>(null);

  function dropCard(id: string) {
    setLeaving((ids) => new Set(ids).add(id));
    setTimeout(async () => {
      const listKey = trpc.task.list.infiniteQueryKey(taskListInput);
      // A page fetch already under way was built from the pages as they were
      // and would bring the card back when it lands. Stop it first; the
      // sentinel asks again for anything still missing.
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData(listKey, (data) => removeFromPages(data, id));
      setLeaving((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }, EXIT_MS);
  }

  async function confirm() {
    if (!target || remove.isPending) return;
    const task = target;
    let gone = false;
    try {
      await remove.mutateAsync({ id: task.id });
      toast.show("success", "Task deleted.");
      gone = true;
    } catch (error) {
      toast.show("error", describeSaveError(error).message ?? "Could not delete the task. Please try again.");
      // Already gone on the server: the card should not stay on screen either.
      gone = isNotFound(error);
    }
    if (gone) dropCard(task.id);
    setTarget(null);
    // After the dialog has closed and returned focus to the (inert) button.
    if (gone) requestAnimationFrame(() => focusAfterRef.current?.focus());
  }

  return {
    target,
    ask: (task: TaskItem) => setTarget(task),
    cancel: () => {
      if (!remove.isPending) setTarget(null);
    },
    confirm,
    deleting: remove.isPending,
    leaving,
    focusAfterRef,
  };
}
