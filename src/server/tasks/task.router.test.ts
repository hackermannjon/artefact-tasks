import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createCaller } from "../root";
import type { Task } from "./task";
import { encodeCursor } from "./task.cursor";
import { TaskRepository } from "./task.repository";

const older: Task = { id: "a", title: "Older", createdAt: new Date("2026-01-01T10:00:00Z") };
const newer: Task = { id: "b", title: "Newer", description: "Has details", createdAt: new Date("2026-01-02T10:00:00Z") };

function callerWith(seed: Task[] = []) {
  return createCaller({ tasks: new TaskRepository(seed) });
}

// Tasks t01 (oldest) … tNN (newest), one hour apart.
function many(count: number): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `t${String(i + 1).padStart(2, "0")}`,
    title: `Task ${i + 1}`,
    createdAt: new Date(Date.UTC(2026, 0, 1, i)),
  }));
}

const ids = (tasks: Task[]) => tasks.map((t) => t.id);

describe("task.list", () => {
  it("lists tasks newest first", async () => {
    const { items } = await callerWith([older, newer]).task.list({});
    expect(ids(items)).toEqual(["b", "a"]);
  });

  it("orders tasks created at the same instant by id, so the order never changes", async () => {
    const at = new Date("2026-01-01T10:00:00Z");
    const { items } = await callerWith([
      { id: "x1", title: "One", createdAt: at },
      { id: "x2", title: "Two", createdAt: at },
    ]).task.list({});
    expect(ids(items)).toEqual(["x2", "x1"]);
  });

  it("returns every field, with the creation time as a Date", async () => {
    const { items } = await callerWith([newer]).task.list({});
    expect(items[0]).toEqual(newer);
    expect(items[0]?.createdAt).toBeInstanceOf(Date);
  });

  it("is empty when there are no tasks, with no next page", async () => {
    expect(await callerWith().task.list({})).toEqual({ items: [], total: 0, nextCursor: null });
  });

  it("hands out copies, so changing a result never changes the store", async () => {
    const caller = callerWith([older]);
    const first = (await caller.task.list({})).items[0]!;
    first.title = "Changed";
    first.createdAt.setFullYear(2000);
    expect((await caller.task.list({})).items[0]).toEqual(older);
  });
});

describe("task.list pages", () => {
  it("sends 10 tasks by default, with the total and a cursor for the next page", async () => {
    const page = await callerWith(many(25)).task.list({});
    expect(page.items).toHaveLength(10);
    expect(page.items[0]?.id).toBe("t25");
    expect(page.total).toBe(25);
    expect(page.nextCursor).toEqual(expect.any(String));
  });

  it("walks every task exactly once, in order, and stops with no cursor", async () => {
    const caller = callerWith(many(25));
    const seen: string[] = [];
    let cursor: string | null = null;
    let pages = 0;
    do {
      const page: Awaited<ReturnType<typeof caller.task.list>> = await caller.task.list({ limit: 10, cursor });
      seen.push(...ids(page.items));
      cursor = page.nextCursor;
      pages++;
    } while (cursor);
    expect(pages).toBe(3);
    expect(seen).toEqual(ids(many(25)).reverse());
  });

  it("has no next page when the last page is exactly full", async () => {
    const caller = callerWith(many(20));
    const first = await caller.task.list({ limit: 10 });
    const second = await caller.task.list({ limit: 10, cursor: first.nextCursor });
    expect(second.items).toHaveLength(10);
    expect(second.nextCursor).toBeNull();
  });

  it("neither skips nor repeats a task when one is created or deleted between pages", async () => {
    const repository = new TaskRepository(many(25));
    const caller = createCaller({ tasks: repository });
    const first = await caller.task.list({ limit: 10 });
    await caller.task.create({ title: "Brand new" });
    await caller.task.delete({ id: "t25" });
    await caller.task.delete({ id: "t10" });
    const second = await caller.task.list({ limit: 10, cursor: first.nextCursor });
    expect(ids(second.items)).toEqual(["t15", "t14", "t13", "t12", "t11", "t09", "t08", "t07", "t06", "t05"]);
  });

  it("keeps going after the last task of the page was deleted", async () => {
    const caller = callerWith(many(25));
    const first = await caller.task.list({ limit: 10 });
    await caller.task.delete({ id: first.items.at(-1)!.id });
    expect((await caller.task.list({ limit: 10, cursor: first.nextCursor })).items[0]?.id).toBe("t15");
  });

  it("accepts a page size from 1 to 50 and refuses 0 and 51", async () => {
    const caller = callerWith(many(60));
    expect((await caller.task.list({ limit: 1 })).items).toHaveLength(1);
    expect((await caller.task.list({ limit: 50 })).items).toHaveLength(50);
    for (const limit of [0, 51]) {
      await expect(caller.task.list({ limit })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    }
  });

  it("refuses a cursor it did not produce", async () => {
    const error = await callerWith(many(3))
      .task.list({ cursor: "not-a-cursor" })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TRPCError);
    expect(error).toMatchObject({ code: "BAD_REQUEST", message: "This page link is not valid." });
  });

  it("refuses a cursor whose time is not a real date", async () => {
    const cursor = Buffer.from("99999999999999999:t1").toString("base64url");
    const error = await callerWith(many(3))
      .task.list({ cursor })
      .catch((e: unknown) => e);
    expect(error).toMatchObject({ code: "BAD_REQUEST", message: "This page link is not valid." });
  });

  it("treats a null cursor as the first page", async () => {
    const caller = callerWith(many(3));
    expect(await caller.task.list({ cursor: null })).toEqual(await caller.task.list({}));
  });

  it("returns an empty page after a cursor past the oldest task", async () => {
    const cursor = encodeCursor({ id: "t00", createdAt: new Date(Date.UTC(2025, 0, 1)) });
    expect(await callerWith(many(3)).task.list({ cursor })).toEqual({ items: [], total: 3, nextCursor: null });
  });
});
