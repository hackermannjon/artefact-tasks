import { createCallerFactory, router } from "./trpc";
import { taskRouter } from "./tasks/task.router";

export const appRouter = router({ task: taskRouter });

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
