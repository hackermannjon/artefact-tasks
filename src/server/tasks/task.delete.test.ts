import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createCaller } from "../root";
import type { Task } from "./task";
import { TaskRepository } from "./task.repository";

const seed: Task[] = [
  { id: "a", title: "Book the venue", createdAt: new Date("2026-11-20T10:00:00Z") },
  { id: "b", title: "Send the invites", createdAt: new Date("2026-11-21T10:00:00Z") },
];

function fresh() {
  return createCaller({ tasks: new TaskRepository(seed) });
}

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(TRPCError);
  return error as TRPCError;
}

describe("task.delete", () => {
  it("removes the task from the list and from byId", async () => {
    const caller = fresh();
    expect(await caller.task.delete({ id: "a" })).toEqual({ id: "a" });
    expect((await caller.task.list()).map((t) => t.id)).toEqual(["b"]);
    expect((await rejection(caller.task.byId({ id: "a" }))).code).toBe("NOT_FOUND");
  });

  it("answers an unknown id with NOT_FOUND and a clear message, and removes nothing", async () => {
    const caller = fresh();
    const error = await rejection(caller.task.delete({ id: "missing" }));
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("This task no longer exists. It may have been deleted.");
    expect(await caller.task.list()).toHaveLength(2);
  });

  it("answers NOT_FOUND the second time the same task is deleted", async () => {
    const caller = fresh();
    await caller.task.delete({ id: "a" });
    expect((await rejection(caller.task.delete({ id: "a" }))).code).toBe("NOT_FOUND");
  });

  it("refuses an empty id", async () => {
    expect((await rejection(fresh().task.delete({ id: "" }))).code).toBe("BAD_REQUEST");
  });

  it("leaves an empty list after the last task is deleted", async () => {
    const caller = fresh();
    await caller.task.delete({ id: "a" });
    await caller.task.delete({ id: "b" });
    expect(await caller.task.list()).toEqual([]);
  });
});
