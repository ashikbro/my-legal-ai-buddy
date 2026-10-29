import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteDocumentButton from "./delete-button";
import LogoutButton from "./logout-button";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const documents = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { versions: true } } },
  });

  return (
    <main>
      <Link href="/">← Home</Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Document library</p>
          <h1>Saved documents</h1>
          <p className="muted">Documents are stored locally in the configured database.</p>
        </div>
        <div className="actions">
          <Link href="/documents/new"><button>New review</button></Link>
          <LogoutButton />
        </div>
      </div>
      {documents.length === 0 ? (
        <section className="card">
          <h2>No documents yet</h2>
          <p className="muted">Start by adding a contract or other text document for local review.</p>
          <Link href="/documents/new"><button>Review a document</button></Link>
        </section>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <article className="card document-row" key={document.id}>
              <div>
                <h2><Link href={`/documents/${document.id}`}>{document.title}</Link></h2>
                <p className="muted">
                  Updated {document.updatedAt.toLocaleString()} · {document._count.versions} version{document._count.versions === 1 ? "" : "s"}
                </p>
              </div>
              <DeleteDocumentButton id={document.id} title={document.title} />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
