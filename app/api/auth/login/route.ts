import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { allowAuthAttempt, clientKey, isSameOrigin } from "@/lib/security";

const schema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).refine((value) => new TextEncoder().encode(value).length <= 72, "Password must be at most 72 UTF-8 bytes."),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!allowAuthAttempt(`login:${clientKey(request)}`)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const session = await createSession(user.id);
  await setSessionCookie(session.token, session.expiresAt);
  return NextResponse.json({ email: user.email });
}
