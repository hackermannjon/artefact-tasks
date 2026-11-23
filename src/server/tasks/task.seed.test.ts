import { describe, expect, it } from "vitest";
import { createTaskInput } from "./task.schema";
import { seedTasks } from "./task.seed";

describe("sample tasks", () => {
  it("each pass the same rules as a task created in the app, with a unique id", () => {
    for (const task of seedTasks) {
      expect(createTaskInput.safeParse(task).success, task.title).toBe(true);
    }
    expect(new Set(seedTasks.map((t) => t.id)).size).toBe(seedTasks.length);
  });

  it("are enough for more than two pages", () => {
    expect(seedTasks.length).toBeGreaterThan(20);
  });
});
