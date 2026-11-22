import { describe, expect, it } from "vitest";
import { formatCreatedAt } from "./dates";

describe("formatCreatedAt", () => {
  const instant = new Date("2026-11-23T13:05:00Z");

  it("shows the date and time in the given zone", () => {
    expect(formatCreatedAt(instant, "America/Sao_Paulo")).toBe("Nov 23, 2026, 10:05 AM");
  });

  it("moves to the next day when the zone is past midnight", () => {
    expect(formatCreatedAt(new Date("2026-11-23T23:30:00Z"), "Asia/Tokyo")).toBe("Nov 24, 2026, 8:30 AM");
  });
});
