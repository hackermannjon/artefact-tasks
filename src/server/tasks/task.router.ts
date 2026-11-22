import { publicProcedure, router } from "../trpc";

export const taskRouter = router({
  list: publicProcedure.query(({ ctx }) => ctx.tasks.list()),
});
