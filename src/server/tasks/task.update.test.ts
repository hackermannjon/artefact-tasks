import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createCaller } from "../root";
import type { Task } from "./task";
import { TaskRepository } from "./task.repository";
import { DESCRIPTION_MAX, TITLE_MAX } from "./task.schema";

const seed: Task[] = [
  { id: "a", title: "Book the venue", description: "Ask for a quote", createdAt: new Date("2026-11-20T10:00:00Z") },
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

describe("task.byId", () => {
  it("returns the task with every field", async () => {
    expect(await fresh().task.byId({ id: "a" })).toEqual(seed[0]);
  });

  it("answers an unknown id with NOT_FOUND and a clear message", async () => {
    const error = await rejection(fresh().task.byId({ id: "missing" }));
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("This task no longer exists. It may have been deleted.");
  });

  it("refuses an empty id", async () => {
    const error = await rejection(fresh().task.byId({ id: "" }));
    expect(error.code).toBe("BAD_REQUEST");
  });
});

describe("task.update", () => {
  it("changes the title and description, keeping the id and creation time", async () => {
    const caller = fresh();
    const task = await caller.task.update({ id: "a", title: "  Book the hall ", description: "Two rooms" });
    expect(task).toEqual({ id: "a", title: "Book the hall", description: "Two rooms", createdAt: seed[0]!.createdAt });
    expect(await caller.task.byId({ id: "a" })).toEqual(task);
  });

  it("keeps the task in the same place in the list", async () => {
    const caller = fresh();
    await caller.task.update({ id: "a", title: "Edited" });
    expect((await caller.task.list({ limit: 50 })).items.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("removes the description when it is emptied", async () => {
    const caller = fresh();
    for (const description of [undefined, "", "  "]) {
      const task = await caller.task.update({ id: "a", title: "T", description });
      expect(task).not.toHaveProperty("description");
    }
  });

  it("answers an unknown id with NOT_FOUND, and creates nothing", async () => {
    const caller = fresh();
    const error = await rejection(caller.task.update({ id: "missing", title: "T" }));
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("This task no longer exists. It may have been deleted.");
    expect((await caller.task.list({ limit: 50 })).items).toHaveLength(2);
  });

  it("refuses a blank title, and leaves the task as it was", async () => {
    const caller = fresh();
    const error = await rejection(caller.task.update({ id: "a", title: "   " }));
    expect(error.code).toBe("BAD_REQUEST");
    expect(await caller.task.byId({ id: "a" })).toEqual(seed[0]);
  });

  it("checks the input before the id, so a bad edit of a missing task is still a 400", async () => {
    const error = await rejection(fresh().task.update({ id: "missing", title: "" }));
    expect(error.code).toBe("BAD_REQUEST");
  });

  it(`accepts ${TITLE_MAX} and ${DESCRIPTION_MAX} characters, and refuses one more of either`, async () => {
    const caller = fresh();
    const longest = { id: "a", title: "x".repeat(TITLE_MAX), description: "d".repeat(DESCRIPTION_MAX) };
    await expect(caller.task.update(longest)).resolves.toBeTruthy();
    expect((await rejection(caller.task.update({ ...longest, title: `${longest.title}x` }))).code).toBe("BAD_REQUEST");
    expect((await rejection(caller.task.update({ ...longest, description: `${longest.description}d` }))).code).toBe(
      "BAD_REQUEST",
    );
  });
});
