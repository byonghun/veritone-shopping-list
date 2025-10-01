import type { HttpOptions } from "../types/http";

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function http<T>(
  path: string,
  opts: HttpOptions = {}
): Promise<T> {
  const res = await fetch(path, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const code = isJson ? payload.code : undefined;
    const details = isJson ? payload.details : undefined;
    throw new HttpError(
      res.status,
      isJson ? payload.message : String(payload),
      code,
      details
    );
  }
  return payload as T;
}
