import { describe, expect, it } from "vitest";
import { flattenPages, removeFromPages } from "./taskPages";

const page = (ids: string[], total: number, nextCursor: string | null = null) => ({
  items: ids.map((id) => ({ id })),
  total,
  nextCursor,
});

describe("flattenPages", () => {
  it("joins the pages in order", () => {
    expect(flattenPages([page(["c", "b"], 3, "x"), page(["a"], 3)]).map((t) => t.id)).toEqual(["c", "b", "a"]);
  });

  it("lists a task only once when two pages both hold it", () => {
    expect(flattenPages([page(["c", "b"], 3, "x"), page(["b", "a"], 3)]).map((t) => t.id)).toEqual(["c", "b", "a"]);
  });
});

describe("removeFromPages", () => {
  const data = { pages: [page(["c", "b"], 3, "x"), page(["a"], 3)], pageParams: [null, "x"] };

  it("removes the task from whichever page holds it and lowers every page's total", () => {
    const next = removeFromPages(data, "a")!;
    expect(flattenPages(next.pages).map((t) => t.id)).toEqual(["c", "b"]);
    expect(next.pages.map((p) => p.total)).toEqual([2, 2]);
    expect(next.pageParams).toEqual([null, "x"]);
  });

  it("changes nothing when the task is not loaded", () => {
    expect(removeFromPages(data, "zzz")).toBe(data);
  });

  it("passes through an empty cache", () => {
    expect(removeFromPages(undefined, "a")).toBeUndefined();
  });
});
