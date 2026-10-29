import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { analyzeDocument } from "@/lib/analyze";
import { getCurrentUser } from "@/lib/auth";

const documentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(1_000_000),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const parsed = documentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Title and document text are required." }, { status: 400 });
    const analysis = analyzeDocument(parsed.data.content);
    const document = await prisma.document.create({
      data: { ownerId: user.id, title: parsed.data.title, versions: { create: { version: 1, content: parsed.data.content, analysis } } },
      select: { id: true },
    });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Document creation failed", error);
    return NextResponse.json({ error: "Unable to save document." }, { status: 500 });
  }
}
