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
    if (!(error.cause instanceof ZodError)) return { ...shape, data: { ...shape.data, fieldErrors: null } };
    // The default message is the raw list of issues; a caller of the API gets the first one in words instead.
    const message = error.cause.issues[0]?.message ?? "The request is not valid.";
    return { ...shape, message, data: { ...shape.data, fieldErrors: z.flattenError(error.cause).fieldErrors } };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
