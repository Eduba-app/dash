// src/lib/utils.ts
import { isAxiosError } from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string") return msg;
    if (Array.isArray(msg))
      return msg
        .map((m: { constraints: Record<string, string> }) =>
          Object.values(m.constraints).join(", ")
        )
        .join(" | ");
  }
  return fallback;
}