import { describe, it, expect } from "vitest";
import { formatDate } from "@/helpers/format-date";

describe("formatDate", () => {
  it("returns undefined for null input", () => {
    expect(formatDate(null)).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(formatDate(undefined)).toBeUndefined();
  });

  it("formats a Date object as YYYY-MM-DD", () => {
    expect(formatDate(new Date("2000-06-15T00:00:00.000Z"))).toBe("2000-06-15");
  });

  it("formats an ISO date string as YYYY-MM-DD", () => {
    expect(formatDate("1990-01-01T00:00:00.000Z")).toBe("1990-01-01");
  });

  it("returns empty string for an invalid date string", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("handles numeric timestamps (Date constructor accepts them)", () => {
    // 0 = Unix epoch = 1970-01-01
    const result = formatDate(0);
    expect(result).toBe("1970-01-01");
  });
});
