"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(data.error || "Login failed");
      return;
    }
    if (data.role !== "ADMIN") {
      await fetch("/api/auth/logout", { method: "POST" });
      setError("Administrators only.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="shell">
      <section className="section admin-login-page">
        <div className="card admin-login-card">
          <Link className="brand admin-login-brand" href="/">
            TREKO <span>MUSIC</span>
          </Link>
          <div className="eyebrow">Admin Portal</div>
          <h2 className="admin-login-title">Administrator Login</h2>
          {error && <p className="admin-login-error">{error}</p>}
          <form onSubmit={submit} className="admin-login-form">
            <input name="email" required className="field" type="email" placeholder="Admin email" autoComplete="username" />
            <input name="password" required className="field" type="password" placeholder="Admin password" autoComplete="current-password" />
            <button disabled={loading} className="btn primary">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <Link className="muted admin-back" href="/">Back to Treko Music</Link>
        </div>
      </section>
    </main>
  );
}
