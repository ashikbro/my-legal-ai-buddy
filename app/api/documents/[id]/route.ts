import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { analyzeDocument } from "@/lib/analyze";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(1_000_000),
});

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Title and document text are required." }, { status: 400 });

    const document = await prisma.document.findUnique({
      where: { id, ownerId: user.id },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    });
    if (!document || !document.versions[0]) return NextResponse.json({ error: "Document not found." }, { status: 404 });

    const nextVersion = document.versions[0].version + 1;
    await prisma.$transaction([
      prisma.document.update({ where: { id }, data: { title: parsed.data.title } }),
      prisma.version.create({
        data: {
          documentId: id,
          version: nextVersion,
          content: parsed.data.content,
          analysis: analyzeDocument(parsed.data.content),
        },
      }),
    ]);
    return NextResponse.json({ id, version: nextVersion });
  } catch (error) {
    console.error("Document update failed", error);
    return NextResponse.json({ error: "Unable to update document." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const deleted = await prisma.document.deleteMany({ where: { id, ownerId: user.id } });
    if (deleted.count === 0) return NextResponse.json({ error: "Document not found." }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Document deletion failed", error);
    return NextResponse.json({ error: "Unable to delete document." }, { status: 500 });
  }
}
