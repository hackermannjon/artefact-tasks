"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useTRPC } from "@/trpc/react";
import { useTaskForm } from "./useTaskForm";

export function useCreateTask() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  const create = useMutation(trpc.task.create.mutationOptions());

  return useTaskForm({
    initial: { title: "", description: "" },
    save: (values) => create.mutateAsync(values),
    onSaved: () => {
      void queryClient.invalidateQueries({ queryKey: trpc.task.list.pathKey() });
      toast.show("success", "Task created.");
      // Replace, so Back does not reopen a form that was already saved.
      router.replace("/");
    },
  });
}
