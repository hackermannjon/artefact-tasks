import { publicProcedure, router } from "../trpc";
import { createTaskInput } from "./task.schema";

export const taskRouter = router({
  list: publicProcedure.query(({ ctx }) => ctx.tasks.list()),

  create: publicProcedure.input(createTaskInput).mutation(({ ctx, input }) => ctx.tasks.create(input)),
});
