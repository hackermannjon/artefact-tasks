import { TRPCClientError } from "@trpc/client";
import { describe, expect, it } from "vitest";
import { describeSaveError, validateTask } from "./taskFormRules";

describe("validateTask", () => {
  it("passes a valid task", () => {
    expect(validateTask({ title: "Plan the sprint", description: "" })).toEqual({});
  });

  it("asks for a title when it is empty or only spaces", () => {
    expect(validateTask({ title: "", description: "" }).title).toBe("Title is required.");
    expect(validateTask({ title: "   ", description: "" }).title).toBe("Title is required.");
  });

  it("flags a title and a description over their limits", () => {
    const errors = validateTask({ title: "x".repeat(101), description: "d".repeat(501) });
    expect(errors.title).toBe("Title must be 100 characters or fewer.");
    expect(errors.description).toBe("Description must be 500 characters or fewer.");
  });
});

describe("describeSaveError", () => {
  it("places the server's field messages on their fields", () => {
    const error = new TRPCClientError("Bad input", {
      result: { error: { data: { code: "BAD_REQUEST", fieldErrors: { title: ["Title is required."] } } } } as never,
    });
    expect(describeSaveError(error)).toEqual({ fieldErrors: { title: "Title is required.", description: undefined } });
  });

  it("explains a request that never reached the server", () => {
    expect(describeSaveError(new TRPCClientError("Failed to fetch")).message).toBe(
      "Could not reach the server. Check your connection and try again.",
    );
  });

  it("passes on any other server message", () => {
    const error = new TRPCClientError("Task not found.", {
      result: { error: { data: { code: "NOT_FOUND", fieldErrors: null } } } as never,
    });
    expect(describeSaveError(error).message).toBe("Task not found.");
  });
});
