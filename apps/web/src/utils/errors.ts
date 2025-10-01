import { ZodError } from "zod";
import { ApiErrorBody } from "@app/shared";

function isAxiosError(e: unknown): e is {
  isAxiosError: true;
  message?: string;
  response?: { status?: number; statusText?: string; data?: ApiErrorBody };
} {
  return !!e && typeof e === "object" && (e as any).isAxiosError === true;
}

function isResponse(e: unknown): e is Response {
  return !!e && typeof e === "object" && "ok" in e && "status" in e;
}

export async function getErrorDescription(err: unknown): Promise<string> {
  // Zod validation error
  if (err instanceof ZodError) {
    return err.issues?.[0]?.message ?? "Validation error.";
  }

  // Axios-style error
  if (isAxiosError(err)) {
    const body = err.response?.data;
    return (
      body?.message ??
      body?.error ??
      err.message ??
      `${err.response?.status ?? ""} ${err.response?.statusText ?? "Request failed"}`.trim()
    );
  }

  // Fetch Response thrown by your requester
  if (isResponse(err)) {
    try {
      const body: ApiErrorBody = await err.clone().json();
      return body.message ?? body.error ?? `${err.status} ${err.statusText}`;
    } catch {
      return `${err.status} ${err.statusText}`;
    }
  }

  // Native Error
  if (err instanceof Error) return err.message;

  // String or other
  if (typeof err === "string") return err;
  return "Unexpected error.";
}
