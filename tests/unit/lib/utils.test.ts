import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges two class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("base", false && "skip", undefined, null, "keep")).toBe(
      "base keep"
    );
  });

  it("handles an empty call", () => {
    expect(cn()).toBe("");
  });

  it("resolves Tailwind conflicts — later class wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-white", "bg-black")).toBe("bg-black");
  });

  it("preserves non-conflicting classes from both arguments", () => {
    const result = cn("flex items-center", "gap-4 p-2");
    expect(result).toContain("flex");
    expect(result).toContain("items-center");
    expect(result).toContain("gap-4");
  });

  it("handles an array of class names", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });
});
