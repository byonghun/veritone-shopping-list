import { describe, it, expect } from "@jest/globals";
import { cn } from "./index";

describe("cn (clsx + tailwind-merge)", () => {
  it("joins simple class strings", () => {
    expect(cn("btn", "card")).toBe("btn card");
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it('ignores falsy/empty values (null/undefined/false/"")', () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("handles arrays and nested arrays", () => {
    expect(cn(["a", ["b", ["c"]]], "d")).toBe("a b c d");
  });

  it("handles object syntax like clsx (truthy keys only)", () => {
    expect(cn({ a: true, b: false, c: 1 }, "d")).toBe("a c d");
  });

  it("dedupes exact duplicates", () => {
    expect(cn("p-2", "p-2", "p-2")).toBe("p-2");
  });

  it("resolves Tailwind conflicts by keeping the later class in the same group", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");

    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps responsive/variant-prefixed classes separate and resolves conflicts within the same variant", () => {
    expect(cn("p-4", "md:p-2")).toBe("p-4 md:p-2");
    expect(cn("md:p-2", "md:p-4")).toBe("md:p-4");
    expect(cn("hover:text-red-500", "hover:text-blue-500")).toBe("hover:text-blue-500");
  });

  it("handles arbitrary values and keeps the last conflicting size", () => {
    expect(cn("w-4", "w-[10px]")).toBe("w-[10px]");
    expect(cn("w-[10px]", "w-4")).toBe("w-4");
  });

  it("leaves unknown/non-tailwind classes untouched", () => {
    expect(cn("foo", "bar", { baz: true })).toBe("foo bar baz");
  });
});
