import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import type { Task } from "./task";
import { decodeCursor, encodeCursor } from "./task.cursor";
import { createTaskInput, listTasksInput, taskIdInput, updateTaskInput } from "./task.schema";

function notFound(): never {
  throw new TRPCError({ code: "NOT_FOUND", message: "This task no longer exists. It may have been deleted." });
}

function found(task: Task | undefined): Task {
  return task ?? notFound();
}

export const taskRouter = router({
  list: publicProcedure.input(listTasksInput).query(({ ctx, input }) => {
    const after = input.cursor ? decodeCursor(input.cursor) : undefined;
    if (after === null) throw new TRPCError({ code: "BAD_REQUEST", message: "This page link is not valid." });
    const { items, hasMore, total } = ctx.tasks.page(input.limit, after);
    const last = items.at(-1);
    return { items, total, nextCursor: hasMore && last ? encodeCursor(last) : null };
  }),

  byId: publicProcedure.input(taskIdInput).query(({ ctx, input }) => found(ctx.tasks.get(input.id))),

  create: publicProcedure.input(createTaskInput).mutation(({ ctx, input }) => ctx.tasks.create(input)),

  update: publicProcedure
    .input(updateTaskInput)
    .mutation(({ ctx, input: { id, ...changes } }) => found(ctx.tasks.update(id, changes))),

  delete: publicProcedure.input(taskIdInput).mutation(({ ctx, input }) => {
    if (!ctx.tasks.delete(input.id)) notFound();
    return { id: input.id };
  }),
});
