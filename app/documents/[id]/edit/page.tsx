import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditDocumentForm from "./form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const document = await prisma.document.findFirst({
    where: { id, ownerId: user.id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });
  if (!document || !document.versions[0]) notFound();

  return (
    <main>
      <Link href={`/documents/${id}`}>← Back to document</Link>
      <p className="eyebrow" style={{ marginTop: 28 }}>New version</p>
      <h1>Edit {document.title}</h1>
      <p className="muted">Saving creates version {document.versions[0].version + 1}; previous versions remain stored.</p>
      <EditDocumentForm id={id} title={document.title} content={document.versions[0].content} />
    </main>
  );
}
