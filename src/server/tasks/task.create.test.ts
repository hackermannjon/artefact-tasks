import { TRPCError } from "@trpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCaller } from "../root";
import { TaskRepository } from "./task.repository";
import { DESCRIPTION_MAX, TITLE_MAX } from "./task.schema";

function fresh() {
  return createCaller({ tasks: new TaskRepository() });
}

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(TRPCError);
  return error as TRPCError;
}

afterEach(() => vi.useRealTimers());

describe("task.create", () => {
  it("creates a task with an id and the current time, and lists it first", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-23T15:00:00Z"));
    const caller = createCaller({
      tasks: new TaskRepository([{ id: "old", title: "Old", createdAt: new Date("2026-11-20T10:00:00Z") }]),
    });

    const task = await caller.task.create({ title: "Write the report", description: "For the Monday sync" });

    expect(task).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      title: "Write the report",
      description: "For the Monday sync",
      createdAt: new Date("2026-11-23T15:00:00Z"),
    });
    expect((await caller.task.list()).map((t) => t.id)).toEqual([task.id, "old"]);
  });

  it("gives every task its own id", async () => {
    const caller = fresh();
    const a = await caller.task.create({ title: "A" });
    const b = await caller.task.create({ title: "A" });
    expect(a.id).not.toBe(b.id);
  });

  it("trims the title and the description", async () => {
    const task = await fresh().task.create({ title: "  Padded  ", description: "  Notes \n" });
    expect(task.title).toBe("Padded");
    expect(task.description).toBe("Notes");
  });

  it("stores no description when it is missing, empty or only spaces", async () => {
    const caller = fresh();
    for (const description of [undefined, "", "   "]) {
      const task = await caller.task.create({ title: "T", description });
      expect(task).not.toHaveProperty("description");
    }
  });

  it("refuses an empty title", async () => {
    const error = await rejection(fresh().task.create({ title: "" }));
    expect(error.code).toBe("BAD_REQUEST");
  });

  it("refuses a title made only of spaces, and stores nothing", async () => {
    const caller = fresh();
    await rejection(caller.task.create({ title: "   \t " }));
    expect(await caller.task.list()).toEqual([]);
  });

  it(`accepts a title of exactly ${TITLE_MAX} characters and refuses ${TITLE_MAX + 1}`, async () => {
    const caller = fresh();
    await expect(caller.task.create({ title: "x".repeat(TITLE_MAX) })).resolves.toBeTruthy();
    const error = await rejection(caller.task.create({ title: "x".repeat(TITLE_MAX + 1) }));
    expect(error.code).toBe("BAD_REQUEST");
  });

  it("counts the title length after trimming", async () => {
    await expect(fresh().task.create({ title: ` ${"x".repeat(TITLE_MAX)} ` })).resolves.toBeTruthy();
  });

  it(`accepts a description of exactly ${DESCRIPTION_MAX} characters and refuses ${DESCRIPTION_MAX + 1}`, async () => {
    const caller = fresh();
    await expect(caller.task.create({ title: "T", description: "d".repeat(DESCRIPTION_MAX) })).resolves.toBeTruthy();
    const error = await rejection(caller.task.create({ title: "T", description: "d".repeat(DESCRIPTION_MAX + 1) }));
    expect(error.code).toBe("BAD_REQUEST");
  });
});
