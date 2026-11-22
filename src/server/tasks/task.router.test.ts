import { describe, expect, it } from "vitest";
import { createCaller } from "../root";
import type { Task } from "./task";
import { TaskRepository } from "./task.repository";

const older: Task = { id: "a", title: "Older", createdAt: new Date("2026-01-01T10:00:00Z") };
const newer: Task = { id: "b", title: "Newer", description: "Has details", createdAt: new Date("2026-01-02T10:00:00Z") };

function callerWith(seed: Task[] = []) {
  return createCaller({ tasks: new TaskRepository(seed) });
}

describe("task.list", () => {
  it("lists tasks newest first", async () => {
    const tasks = await callerWith([older, newer]).task.list();
    expect(tasks.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("orders tasks created at the same instant by id, so the order never changes", async () => {
    const at = new Date("2026-01-01T10:00:00Z");
    const tasks = await callerWith([
      { id: "x1", title: "One", createdAt: at },
      { id: "x2", title: "Two", createdAt: at },
    ]).task.list();
    expect(tasks.map((t) => t.id)).toEqual(["x2", "x1"]);
  });

  it("returns every field, with the creation time as a Date", async () => {
    const [task] = await callerWith([newer]).task.list();
    expect(task).toEqual(newer);
    expect(task?.createdAt).toBeInstanceOf(Date);
  });

  it("is empty when there are no tasks", async () => {
    expect(await callerWith().task.list()).toEqual([]);
  });

  it("hands out copies, so changing a result never changes the store", async () => {
    const caller = callerWith([older]);
    const [first] = await caller.task.list();
    first!.title = "Changed";
    first!.createdAt.setFullYear(2000);
    const [again] = await caller.task.list();
    expect(again).toEqual(older);
  });
});
