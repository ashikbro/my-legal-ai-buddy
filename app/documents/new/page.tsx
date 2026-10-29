"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDocument() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Unable to save document");
        return;
      }
      router.push(`/documents/${payload.id}`);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function readFile(file: File) {
    setContent(await file.text());
  }

  return (
    <main>
      <p className="eyebrow">New review</p>
      <h1>Review a document</h1>
      <p className="disclaimer"><strong>Before you continue:</strong> Do not rely on this review as legal advice. Check every finding against the source and consult a qualified lawyer for consequential decisions.</p>
      <form className="card" onSubmit={submit}>
        <label htmlFor="title">Document title</label>
        <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Contractor agreement" required maxLength={120} />
        <label htmlFor="file">Optional plain-text file</label>
        <input id="file" type="file" accept=".txt,.md,text/plain" onChange={(event) => event.target.files?.[0] && readFile(event.target.files[0])} />
        <label htmlFor="content">Document text</label>
        <textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Paste the document text here..." required />
        {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
        <div className="actions"><button disabled={saving}>{saving ? "Analyzing…" : "Save and analyze"}</button></div>
      </form>
    </main>
  );
}
