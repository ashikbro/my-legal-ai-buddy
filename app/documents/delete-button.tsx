"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteDocumentButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteDocument() {
    if (!window.confirm(`Delete "${title}" and all of its versions?`)) return;
    setDeleting(true);
    const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
      return;
    }
    setDeleting(false);
    window.alert("The document could not be deleted.");
  }

  return <button className="secondary" onClick={deleteDocument} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>;
}
