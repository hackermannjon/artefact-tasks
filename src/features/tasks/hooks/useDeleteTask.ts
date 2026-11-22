"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useTRPC } from "@/trpc/react";
import { describeSaveError, isNotFound } from "../taskFormRules";
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

  function dropCard(id: string) {
    setLeaving((ids) => new Set(ids).add(id));
    setTimeout(() => {
      queryClient.setQueryData(trpc.task.list.queryKey(), (tasks) => tasks?.filter((t) => t.id !== id));
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
    try {
      await remove.mutateAsync({ id: task.id });
      toast.show("success", "Task deleted.");
      dropCard(task.id);
    } catch (error) {
      toast.show("error", describeSaveError(error).message ?? "Could not delete the task. Please try again.");
      // Already gone on the server: the card should not stay on screen either.
      if (isNotFound(error)) dropCard(task.id);
    } finally {
      setTarget(null);
    }
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
  };
}
