import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Analysis } from "@/lib/analyze";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const document = await prisma.document.findFirst({ where: { id, ownerId: user.id }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (!document || !document.versions[0]) notFound();
  const analysis = document.versions[0].analysis as unknown as Analysis;

  return (
    <main>
      <Link href="/">← Home</Link>
      <p className="eyebrow" style={{ marginTop: 28 }}>Document review</p>
      <div className="page-heading">
        <div><h1>{document.title}</h1></div>
        <Link href={`/documents/${document.id}/edit`}><button className="secondary">Edit document</button></Link>
      </div>
      <p className="muted">Version {document.versions[0].version} · Saved {document.updatedAt.toLocaleString()}</p>
      <p className="disclaimer"><strong>Human review required:</strong> These heuristic findings do not establish that a clause is valid, invalid, safe, or harmful.</p>
      <section className="card" style={{ marginTop: 20 }}><h2>Summary</h2><p>{analysis.summary}</p></section>
      <div className="grid" style={{ marginTop: 20 }}>
        <section className="card"><h2>Extracted details</h2><h3>Dates</h3>{analysis.dates.length ? <ul>{analysis.dates.map((date) => <li key={date}>{date}</li>)}</ul> : <p className="muted">No dates detected.</p>}<h3>Possible parties</h3>{analysis.parties.length ? <ul>{analysis.parties.map((party) => <li key={party}>{party}</li>)}</ul> : <p className="muted">No party lines detected.</p>}</section>
        <section className="card"><h2>Sections detected</h2>{analysis.sections.length ? <ul>{analysis.sections.map((section) => <li key={section}>{section}</li>)}</ul> : <p className="muted">No clear section headings detected.</p>}</section>
      </div>
      <section className="card" style={{ marginTop: 20 }}><h2>Review findings ({analysis.findings.length})</h2>{analysis.findings.length ? analysis.findings.map((finding) => <article className={`finding ${finding.severity}`} key={finding.category}><strong>{finding.title} · {finding.severity}</strong><p>{finding.explanation}</p><small><strong>Source excerpt:</strong> {finding.excerpt}</small></article>) : <p>No configured clause patterns were detected. This does not mean the document has no risks.</p>}</section>
      <section className="card" style={{ marginTop: 20 }}><h2>Original text</h2><pre>{document.versions[0].content}</pre></section>
    </main>
  );
}
