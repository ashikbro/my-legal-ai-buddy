import { timingSafeEqual } from "node:crypto";

const authAttempts = new Map<string, { count: number; resetAt: number }>();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_ATTEMPT_LIMIT = 10;

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return timingSafeEqual(Buffer.from(new URL(origin).origin), Buffer.from(new URL(request.url).origin));
  } catch {
    return false;
  }
}

export function allowAuthAttempt(key: string) {
  const now = Date.now();
  const current = authAttempts.get(key);
  if (!current || current.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return true;
  }
  if (current.count >= AUTH_ATTEMPT_LIMIT) return false;
  current.count += 1;
  return true;
}

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
