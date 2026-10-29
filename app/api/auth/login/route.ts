import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().email().transform((value) => value.toLowerCase()), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const session = await createSession(user.id);
  await setSessionCookie(session.token, session.expiresAt);
  return NextResponse.json({ email: user.email });
}
