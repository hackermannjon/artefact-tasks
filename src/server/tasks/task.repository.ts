import { randomUUID } from "node:crypto";
import type { Task } from "./task";
import type { TaskCursor } from "./task.cursor";
import type { NewTask } from "./task.schema";

function copy(task: Task): Task {
  return { ...task, createdAt: new Date(task.createdAt) };
}

// Newest first; the id breaks ties so the order is total and stable.
// Returns 0 only for the same task, which is what lets a cursor exclude itself.
function newestFirst(a: Pick<Task, "createdAt" | "id">, b: Pick<Task, "createdAt" | "id">): number {
  return b.createdAt.getTime() - a.createdAt.getTime() || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0);
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

  /**
   * One page in list order, starting right after the cursor. The cursor holds
   * the last task's own sort values, not a position, so tasks created or
   * deleted meanwhile never make a page skip or repeat one.
   */
  page(limit: number, after?: TaskCursor): { items: Task[]; hasMore: boolean; total: number } {
    const sorted = [...this.tasks.values()].sort(newestFirst);
    const rest = after ? sorted.filter((task) => newestFirst(after, task) < 0) : sorted;
    return { items: rest.slice(0, limit).map(copy), hasMore: rest.length > limit, total: sorted.length };
  }

  create(input: NewTask): Task {
    const task: Task = { id: randomUUID(), ...input, createdAt: new Date() };
    if (task.description === undefined) delete task.description;
    this.tasks.set(task.id, task);
    return copy(task);
  }

  get(id: string): Task | undefined {
    const task = this.tasks.get(id);
    return task && copy(task);
  }

  /** Replaces the title and description; the id and creation time never change. */
  update(id: string, input: NewTask): Task | undefined {
    const current = this.tasks.get(id);
    if (!current) return undefined;
    const task: Task = { id, ...input, createdAt: current.createdAt };
    if (task.description === undefined) delete task.description;
    this.tasks.set(id, task);
    return copy(task);
  }

  /** Returns false when there was nothing to delete. */
  delete(id: string): boolean {
    return this.tasks.delete(id);
  }
}
