import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";
import type { TaskRepository } from "./tasks/task.repository";

export type Context = { tasks: TaskRepository };

// superjson keeps createdAt a real Date on both ends of the wire.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  // Invalid input comes back with one message per field, ready for the form.
  errorFormatter({ shape, error }) {
    const fieldErrors = error.cause instanceof ZodError ? z.flattenError(error.cause).fieldErrors : null;
    return { ...shape, data: { ...shape.data, fieldErrors } };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
