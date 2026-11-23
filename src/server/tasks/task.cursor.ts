import type { Task } from "./task";

/** Where the previous page ended: the last task's creation time and id. */
export type TaskCursor = { createdAt: Date; id: string };

// Opaque to the client: it only hands back what it received.
export function encodeCursor(task: Pick<Task, "createdAt" | "id">): string {
  return Buffer.from(`${task.createdAt.getTime()}:${task.id}`).toString("base64url");
}

/** Returns null for anything this server did not produce. */
export function decodeCursor(cursor: string): TaskCursor | null {
  const text = Buffer.from(cursor, "base64url").toString();
  const match = /^(\d+):(.+)$/.exec(text);
  if (!match) return null;
  return { createdAt: new Date(Number(match[1])), id: match[2]! };
}
