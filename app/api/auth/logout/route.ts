import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new Response("Invalid request origin.", { status: 403 });
  await clearSession();
  return new NextResponse(null, { status: 204 });
}
