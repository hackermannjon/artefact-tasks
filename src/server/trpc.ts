import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TaskRepository } from "./tasks/task.repository";

export type Context = { tasks: TaskRepository };

// superjson keeps createdAt a real Date on both ends of the wire.
const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
