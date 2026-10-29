"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDocumentForm({ id, title: initialTitle, content: initialContent }: { id: string; title: string; content: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Unable to save document");
        return;
      }
      router.push(`/documents/${id}`);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <label htmlFor="title">Document title</label>
      <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} />
      <label htmlFor="content">Document text</label>
      <textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} required />
      {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
      <div className="actions"><button disabled={saving}>{saving ? "Saving…" : "Save new version"}</button></div>
    </form>
  );
}
