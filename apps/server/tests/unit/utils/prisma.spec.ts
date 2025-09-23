import { describe, it, expect } from "@jest/globals";
import { mapPrismaItemToDomain } from "../../../src/utils/prisma";

describe("mapPrismaItemToDomain function test", () => {
  it("maps null description to undefined and converts dates to ISO strings", () => {
    const createdAt = new Date("2024-02-03T10:20:30.400Z");
    const updatedAt = new Date("2024-03-04T05:06:07.890Z");

    const row = {
      id: "a",
      name: "Milk",
      description: null,
      quantity: 1,
      purchased: false,
      createdAt,
      updatedAt,
    };

    const item = mapPrismaItemToDomain(row);

    expect(item).toEqual({
      id: "a",
      name: "Milk",
      description: undefined,
      quantity: 1,
      purchased: false,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it("preserves non-null description and does not mutate the input row", () => {
    const createdAt = new Date("2024-05-01T00:00:00.000Z");
    const updatedAt = new Date("2024-05-02T00:00:00.000Z");

    const row = {
      id: "b",
      name: "Eggs",
      description: "Dozen",
      quantity: 12,
      purchased: true,
      createdAt,
      updatedAt,
    };

    const before = { ...row };
    const item = mapPrismaItemToDomain(row);

    expect(item.description).toBe("Dozen");
    expect(item.createdAt).toBe(createdAt.toISOString());
    expect(item.updatedAt).toBe(updatedAt.toISOString());

    // Ensure the function is pure with respect to the input
    expect(row).toEqual(before);
  });

  it("keeps empty string descriptions as empty string (not undefined)", () => {
    const createdAt = new Date("2024-06-10T12:34:56.000Z");
    const updatedAt = new Date("2024-06-10T12:35:56.000Z");

    const row = {
      id: "c",
      name: "Bread",
      description: "", // empty string should be preserved (?? only changes null/undefined)
      quantity: 1,
      purchased: false,
      createdAt,
      updatedAt,
    };

    const item = mapPrismaItemToDomain(row);

    expect(item.description).toBe("");
    expect(item.createdAt).toBe(createdAt.toISOString());
    expect(item.updatedAt).toBe(updatedAt.toISOString());
  });
});
