import type { Task } from "./task";

function copy(task: Task): Task {
  return { ...task, createdAt: new Date(task.createdAt) };
}

// Newest first; the id breaks ties so the order is total and stable.
function newestFirst(a: Task, b: Task): number {
  return b.createdAt.getTime() - a.createdAt.getTime() || (a.id < b.id ? 1 : -1);
}

/**
 * In-memory store. It hands out copies only, so nothing outside can change a
 * stored task without going through the repository.
 */
export class TaskRepository {
  private readonly tasks = new Map<string, Task>();

  constructor(seed: readonly Task[] = []) {
    for (const task of seed) this.tasks.set(task.id, copy(task));
  }

  list(): Task[] {
    return [...this.tasks.values()].sort(newestFirst).map(copy);
  }
}
