import type { ZodError } from "zod";

export function getFirstZodError(error: ZodError): string {
  const issues = error.issues;
  return issues[0]?.message || "Invalid input";
}
