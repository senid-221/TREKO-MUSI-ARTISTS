"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Payment() {
  const [sent, setSent] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!paymentId || status === "PAID" || status === "FAILED") return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/payments/${paymentId}/status`, { cache: "no-store" });
      const data = await response.json();
      if (response.ok) {
        if (data.status) setStatus(data.status);
        if (data.momoStatus === "SUCCESSFUL") setMessage("Payment confirmed. Your membership is now active.");
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paymentId, status]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to start payment.");
      return;
    }

    setPaymentId(result.paymentId);
    setStatus(result.status || "PENDING");
    setMessage(result.message || "Approve the payment on your MTN MoMo phone.");
    setSent(true);
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">TREKO <span>MUSI</span></Link>
      </nav>

      <section className="section" style={{ maxWidth: 700 }}>
        <div className="card">
          <div className="eyebrow">Membership Payment</div>
          <h2>Activate your artist account</h2>
          <p className="muted">
            Choose a membership plan and enter your MTN Mobile Money number.
            Treko Musi will send an MTN payment request to your phone.
          </p>

          {error && <p style={{ color: "#ffd400" }}>{error}</p>}

          {sent ? (
            <>
              <h3>{status === "PAID" ? "Payment confirmed ✓" : "Payment request sent"}</h3>
              <p className="muted">{message || "Approve the request on your MTN MoMo phone. We will verify the transaction automatically."}</p>
              <p className="muted">Status: <strong>{status}</strong></p>
              <Link href="/dashboard" className="btn primary">Go to Dashboard</Link>
            </>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <select name="plan" className="field" defaultValue="Artist">
                <option value="Artist">Artist — 10,000 RWF</option>
                <option value="Growth">Growth — 25,000 RWF</option>
                <option value="Pro">Pro — 50,000 RWF</option>
              </select>
              <input name="phone" className="field" placeholder="MTN Mobile Money number" required />
              <button className="btn primary">Pay with MTN MoMo</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
