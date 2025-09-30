import { describe, it, expect } from "@jest/globals";
import { z, ZodError } from "zod";
import { getErrorDescription } from "./errors";

describe("getErrorDescription", () => {
  it("returns first Zod issue message when ZodError has issues", async () => {
    const schema = z.object({
      name: z.string().min(2, "name too short"),
      age: z.number().min(1, "age too small"),
    });

    const result = schema.safeParse({ name: "", age: 0 });
    expect(result.success).toBe(false);

    const msg = await getErrorDescription((result as any).error);
    expect(msg).toBe("name too short"); // first issue message
  });

  it('returns "Validation error." when ZodError has no issues', async () => {
    const emptyZodError = new ZodError([]);
    const msg = await getErrorDescription(emptyZodError);
    expect(msg).toBe("Validation error.");
  });

  it("returns response.data.message when provided (axios-like error)", async () => {
    const err = {
      isAxiosError: true,
      response: {
        status: 400,
        statusText: "Bad Request",
        data: { message: "invalid payload" },
      },
    };
    const msg = await getErrorDescription(err as unknown);
    expect(msg).toBe("invalid payload");
  });

  it("returns response.data.error when message is absent (axios-like error)", async () => {
    const err = {
      isAxiosError: true,
      response: {
        status: 401,
        statusText: "Unauthorized",
        data: { error: "auth failed" },
      },
    };
    const msg = await getErrorDescription(err as unknown);
    expect(msg).toBe("auth failed");
  });

  it("falls back to error.message when response.data lacks message/error (axios-like error)", async () => {
    const err = {
      isAxiosError: true,
      message: "network down",
      response: { status: 503, statusText: "Service Unavailable", data: {} },
    };
    const msg = await getErrorDescription(err as unknown);
    expect(msg).toBe("network down");
  });

  it('falls back to "status statusText" when no data/message present (axios-like error)', async () => {
    const err = {
      isAxiosError: true,
      response: { status: 500, statusText: "Server Error" },
    };
    const msg = await getErrorDescription(err as unknown);
    expect(msg).toBe("500 Server Error");
  });

  it('falls back to "Request failed" when axios-like has no status/statusText/message', async () => {
    const err = {
      isAxiosError: true,
      response: {},
    };
    const msg = await getErrorDescription(err as unknown);
    expect(msg).toBe("Request failed");
  });

  it("returns body.message when Response has JSON with message", async () => {
    const res = new Response(JSON.stringify({ message: "nope" }), {
      status: 400,
      statusText: "Bad Request",
      headers: { "Content-Type": "application/json" },
    });
    const msg = await getErrorDescription(res as unknown);
    expect(msg).toBe("nope");
  });

  it("returns body.error when Response has JSON with error but no message", async () => {
    const res = new Response(JSON.stringify({ error: "boom" }), {
      status: 422,
      statusText: "Unprocessable Entity",
      headers: { "Content-Type": "application/json" },
    });
    const msg = await getErrorDescription(res as unknown);
    expect(msg).toBe("boom");
  });

  it("returns native Error.message", async () => {
    const msg = await getErrorDescription(new Error("kaboom"));
    expect(msg).toBe("kaboom");
  });

  it("returns string if a string is thrown", async () => {
    const msg = await getErrorDescription("plain string error");
    expect(msg).toBe("plain string error");
  });

  it('returns "Unexpected error." for unknown values', async () => {
    const msg = await getErrorDescription({ not: "an error" });
    expect(msg).toBe("Unexpected error.");
  });
});
