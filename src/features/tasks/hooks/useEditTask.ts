"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useTRPC } from "@/trpc/react";
import { useTaskForm } from "./useTaskForm";

export function useEditTask(id: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  // Fetched by the server render, so the form opens already filled in.
  const { data: task, dataUpdatedAt } = useSuspenseQuery(trpc.task.byId.queryOptions({ id }));
  const update = useMutation(trpc.task.update.mutationOptions());

  return useTaskForm({
    initial: { title: task.title, description: task.description ?? "" },
    initialVersion: dataUpdatedAt,
    save: (values) => update.mutateAsync({ id, ...values }),
    onSaved: () => {
      void queryClient.invalidateQueries({ queryKey: trpc.task.list.pathKey() });
      void queryClient.invalidateQueries({ queryKey: trpc.task.byId.queryKey({ id }) });
      toast.show("success", "Task updated.");
      // Replace, so Back does not reopen a form that was already saved.
      router.replace("/");
    },
  });
}
