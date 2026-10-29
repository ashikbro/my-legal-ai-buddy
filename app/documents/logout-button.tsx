"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.push("/login");
      router.refresh();
    } catch {
      window.alert("Unable to sign out. Please try again.");
    }
  }

  return <button className="secondary" onClick={logout}>Sign out</button>;
}
