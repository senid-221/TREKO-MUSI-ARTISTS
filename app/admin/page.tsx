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
      setError("This login is for administrators only.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">
          TREKO <span>MUSIC</span>
        </Link>
      </nav>

      <section className="section" style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="eyebrow">Admin Portal</div>
          <h2>Administrator Login</h2>
          <p className="muted">Sign in with your Treko Music administrator account.</p>

          {error && <p style={{ color: "#ffd400" }}>{error}</p>}

          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <input
              name="email"
              required
              className="field"
              type="email"
              placeholder="Admin email"
              autoComplete="username"
            />
            <input
              name="password"
              required
              className="field"
              type="password"
              placeholder="Admin password"
              autoComplete="current-password"
            />
            <button disabled={loading} className="btn primary">
              {loading ? "Signing in..." : "Sign in to Admin Portal"}
            </button>
          </form>

          <p className="muted">
            <Link href="/">Back to Treko Music</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
