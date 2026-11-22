import "server-only";
import type { Context } from "./trpc";
import { taskRepository } from "./tasks/task.store";

export function createContext(): Context {
  return { tasks: taskRepository };
}
