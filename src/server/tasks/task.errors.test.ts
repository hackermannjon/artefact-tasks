import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { describe, expect, it, vi } from "vitest";
import { createContext } from "../context";
import { appRouter } from "../root";

vi.mock("server-only", () => ({}));

// Goes through the real HTTP handler to check what a browser actually receives.
async function post(path: string, input: unknown) {
  const res = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: new Request(`http://test/api/trpc/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(superjson.serialize(input)),
    }),
    router: appRouter,
    createContext,
  });
  return { status: res.status, body: await res.json() };
}

describe("error responses", () => {
  it("answers invalid input with 400 and a message per field", async () => {
    const { status, body } = await post("task.create", { title: "  ", description: "d".repeat(501) });
    expect(status).toBe(400);
    expect(body.error.json.data.code).toBe("BAD_REQUEST");
    expect(body.error.json.data.fieldErrors).toEqual({
      title: ["Title is required."],
      description: ["Description must be 500 characters or fewer."],
    });
  });
});
