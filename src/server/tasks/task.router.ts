import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import type { Task } from "./task";
import { createTaskInput, taskIdInput, updateTaskInput } from "./task.schema";

function found(task: Task | undefined): Task {
  if (!task) {
    throw new TRPCError({ code: "NOT_FOUND", message: "This task no longer exists. It may have been deleted." });
  }
  return task;
}

export const taskRouter = router({
  list: publicProcedure.query(({ ctx }) => ctx.tasks.list()),

  byId: publicProcedure.input(taskIdInput).query(({ ctx, input }) => found(ctx.tasks.get(input.id))),

  create: publicProcedure.input(createTaskInput).mutation(({ ctx, input }) => ctx.tasks.create(input)),

  update: publicProcedure
    .input(updateTaskInput)
    .mutation(({ ctx, input: { id, ...changes } }) => found(ctx.tasks.update(id, changes))),
});
