import { describe, it, expect } from "@jest/globals";
import {
  ItemCreateSchema,
  ItemUpdateSchema,
  ItemIdSchema,
} from "../../../src/modules/items/schemas";

describe("Item schemas using zod", () => {
  it("ItemCreateSchema accepts valid payload", () => {
    const parsed = ItemCreateSchema.safeParse({
      name: "Milk",
      quantity: 1,
      description: "2%",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Milk");
      expect(parsed.data.quantity).toBe(1);
      expect(parsed.data.description).toBe("2%");
    }
  });

  it("ItemCreateSchema rejects missing name", () => {
    const parsed = ItemCreateSchema.safeParse({ quantity: 1 });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("ItemUpdateSchema allows partials and rejects wrong types", () => {
    const ok = ItemUpdateSchema.safeParse({
      purchased: true,
      description: "",
    });
    expect(ok.success).toBe(true);

    const bad = ItemUpdateSchema.safeParse({ purchased: "yes" });
    expect(bad.success).toBe(false);
  });

  it("ItemIdSchema validates id path param", () => {
    expect(ItemIdSchema.safeParse({ id: "abc123" }).success).toBe(true);
    expect(ItemIdSchema.safeParse({ notId: "x" }).success).toBe(false);
  });
});
