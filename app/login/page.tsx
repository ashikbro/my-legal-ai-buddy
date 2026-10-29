"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch(`/api/auth/${signup ? "signup" : "login"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error ?? "Authentication failed.");
      return;
    }
    router.push("/documents");
  }

  return (
    <main>
      <Link href="/">← Home</Link>
      <div className="card auth-card">
        <p className="eyebrow">{signup ? "Create account" : "Sign in"}</p>
        <h1>{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">Your documents are scoped to this account.</p>
        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={signup ? 12 : 1} autoComplete={signup ? "new-password" : "current-password"} />
          {signup && <p className="muted">Use at least 12 characters.</p>}
          {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
          <div className="actions"><button disabled={busy}>{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button></div>
        </form>
        <button className="secondary auth-toggle" onClick={() => { setSignup(!signup); setError(""); }}>{signup ? "Already have an account? Sign in" : "Need an account? Sign up"}</button>
      </div>
    </main>
  );
}
