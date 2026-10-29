import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main>
      <p className="eyebrow">Local-first document review</p>
      <h1>My Legal AI Buddy</h1>
      <p className="muted">Understand important contract language before discussing it with a qualified professional.</p>
      <p className="disclaimer"><strong>Important:</strong> This is a document-assistance tool, not legal advice. Its findings are heuristic and may be incomplete.</p>
      <div className="card" style={{ marginTop: 24 }}>
        <h2>Start a review</h2>
        <p>Paste a contract or upload a text file. Analysis runs locally and is stored in your SQLite database.</p>
        <div className="actions">
          <Link href={user ? "/documents/new" : "/login"}><button>{user ? "Review a document" : "Sign in to begin"}</button></Link>
          {user && <Link href="/documents"><button className="secondary">Saved documents</button></Link>}
        </div>
      </div>
    </main>
  );
}
