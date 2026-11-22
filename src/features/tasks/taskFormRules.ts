import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { createTaskInput } from "@/server/tasks/task.schema";

export type TaskFormValues = { title: string; description: string };
export type TaskFormField = keyof TaskFormValues;
export type TaskFormErrors = Partial<Record<TaskFormField, string>>;

/** Same rules the server applies, run in the browser for instant feedback. */
export function validateTask(values: TaskFormValues): TaskFormErrors {
  const result = createTaskInput.safeParse(values);
  if (result.success) return {};
  const { fieldErrors } = z.flattenError(result.error);
  return { title: fieldErrors.title?.[0], description: fieldErrors.description?.[0] };
}

export type SaveFailure = { fieldErrors: TaskFormErrors; message?: string };

/** Turns whatever the request threw into messages the form can place. */
export function describeSaveError(error: unknown): SaveFailure {
  if (error instanceof TRPCClientError) {
    const data = error.data as { fieldErrors?: Record<string, string[] | undefined> | null } | undefined;
    if (data?.fieldErrors) {
      return {
        fieldErrors: { title: data.fieldErrors.title?.[0], description: data.fieldErrors.description?.[0] },
      };
    }
    // No data means the request never got an answer from the server.
    if (!error.data) return { fieldErrors: {}, message: "Could not reach the server. Check your connection and try again." };
    return { fieldErrors: {}, message: error.message };
  }
  return { fieldErrors: {}, message: "Something went wrong. Please try again." };
}

/** True when the server answered that the task does not exist (any more). */
export function isNotFound(error: unknown): boolean {
  return error instanceof TRPCClientError && (error.data as { code?: string } | undefined)?.code === "NOT_FOUND";
}
