import "server-only";
import { TaskRepository } from "./task.repository";
import { seedTasks } from "./task.seed";

// One store per server process. Kept on globalThis so dev hot reloads and the
// separate route bundles all see the same tasks.
const globalStore = globalThis as typeof globalThis & { __taskRepository?: TaskRepository };

export const taskRepository = (globalStore.__taskRepository ??= new TaskRepository(seedTasks));
