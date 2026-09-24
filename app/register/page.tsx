"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = params.get("plan");
  const plan = selected === "Growth" || selected === "Pro" ? selected : "Artist";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(f)),
    });

    const d = await r.json();
    setLoading(false);

    if (!r.ok) {
      setError(d.error || "Registration failed");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">
          TREKO <span>MUSIC</span>
        </Link>
      </nav>

      <section className="section" style={{ maxWidth: 650 }}>
        <div className="card">
          <div className="eyebrow">Artist Registration</div>
          <h2>Create your artist account</h2>
          <p className="muted">
            Selected plan: <strong>{plan}</strong>
          </p>

          {error && <p style={{ color: "#ffd400" }}>{error}</p>}

          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <input
              name="stageName"
              required
              placeholder="Artist / Stage name"
              className="field"
            />
            <input
              name="fullName"
              required
              placeholder="Full name"
              className="field"
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              className="field"
            />
            <input
              name="password"
              required
              minLength={8}
              type="password"
              placeholder="Password (8+ characters)"
              className="field"
            />
            <input
              name="phone"
              placeholder="WhatsApp number"
              className="field"
            />
            <input type="hidden" name="membershipPlan" value={plan} />
            <input
              name="genre"
              placeholder="Music genre"
              className="field"
            />

            <button disabled={loading} className="btn primary">
              {loading ? "Creating..." : "Create Account & Continue"}
            </button>
          </form>

          <p className="muted">
            Already registered? <Link href="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<main className="shell" />}>
      <RegisterForm />
    </Suspense>
  );
}
