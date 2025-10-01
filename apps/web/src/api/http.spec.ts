import { describe, it, expect, beforeEach } from "@jest/globals";
import { http, HttpError } from "./http";

const mockFetch = jest.fn();

beforeEach(() => {
  mockFetch.mockReset();
  // Note: Cast to any so TS doesn't complain about assignment
  (globalThis as any).fetch = mockFetch;
});

describe("http()", () => {
  it("performs a GET by default and returns parsed JSON when content-type is application/json", async () => {
    const body = { foo: "bar" };
    const res = new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
    mockFetch.mockResolvedValue(res);

    const data = await http<typeof body>("/api/test");

    expect(data).toEqual(body);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/test", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: undefined,
      signal: undefined,
    });
  });

  it("returns text when content-type is not JSON", async () => {
    const res = new Response("OK TEXT", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
    mockFetch.mockResolvedValue(res);

    const data = await http<string>("/api/text");
    expect(data).toBe("OK TEXT");
  });

  it("throws HttpError with message, code, and details from JSON error payload", async () => {
    const errorPayload = {
      message: "Invalid input",
      code: "E_INVALID",
      details: { field: "name", reason: "required" },
    };
    const res = new Response(JSON.stringify(errorPayload), {
      status: 400,
      statusText: "Bad Request",
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValue(res);

    await expect(http("/api/items")).rejects.toEqual(
      expect.objectContaining({
        constructor: HttpError,
        status: 400,
        message: "Invalid input",
        code: "E_INVALID",
        details: { field: "name", reason: "required" },
      }),
    );
  });

  it("throws HttpError with plain text message when error payload is not JSON", async () => {
    const res = new Response("Server exploded", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "content-type": "text/plain" },
    });
    mockFetch.mockResolvedValue(res);

    await expect(http("/api/broken")).rejects.toEqual(
      expect.objectContaining({
        constructor: HttpError,
        status: 500,
        message: "Server exploded",
        code: undefined,
        details: undefined,
      }),
    );
  });

  it("sends method, merges headers with default Content-Type, and stringifies body", async () => {
    const res = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValue(res);

    const controller = new AbortController();
    const payload = { a: 1 };

    await http<{ ok: true }>("/api/merge", {
      method: "POST",
      headers: { "X-Test": "1" },
      body: payload,
      signal: controller.signal,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "X-Test": "1",
    });
    expect(init.body).toBe(JSON.stringify(payload));
    expect(init.signal).toBe(controller.signal);
  });

  it("does not include a body when opts.body is undefined", async () => {
    const res = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValue(res);

    await http<{ ok: true }>("/api/nobody", {
      method: "POST",
      headers: { A: "B" },
    });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBeUndefined();
  });
});
