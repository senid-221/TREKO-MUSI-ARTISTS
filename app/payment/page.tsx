"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function PaymentForm() {
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const params = useSearchParams();
  const selectedPlan = params.get("plan") || "Artist";
  const requestId = params.get("requestId") || "";
  const service = params.get("service") || "community";

  const whatsappNumber = "250726969060";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Treko Music, I want to send payment proof for ${service} (${selectedPlan} plan).`)}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const response = await fetch("/api/payments", {
      method: "POST",
      body: new FormData(form),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to submit payment proof.");
      return;
    }

    setStatus(result.status || "PENDING");
    setSent(true);
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">TREKO <span>MUSIC</span></Link>
      </nav>

      <section className="section" style={{ maxWidth: 720 }}>
        <div className="card">
          <div className="eyebrow">Membership Payment</div>
          <h2>Subscribe through WhatsApp</h2>
          <p className="muted">
            Request submitted. Contact Treko Music on WhatsApp, pay for your selected plan,
            then return here and upload your payment screenshot or PDF for admin approval.
          </p>

          {whatsappNumber && (
            <p>
              <a className="btn primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                Send Payment Proof on WhatsApp
              </a>
            </p>
          )}

          {error && <p style={{ color: "#ffd400" }}>{error}</p>}

          {sent ? (
            <>
              <h3>Payment proof submitted ✓</h3>
              <p className="muted">
                Your request is <strong>{status}</strong>. Treko Music will review your
                payment proof. Your membership becomes active only after admin approval.
              </p>
              <Link href="/dashboard" className="btn primary">Go to Dashboard</Link>
            </>
          ) : (
            <form onSubmit={submit} encType="multipart/form-data" style={{ display: "grid", gap: 14 }}>
              <input type="hidden" name="requestId" value={requestId}/>
              <select name="plan" className="field" defaultValue={selectedPlan}>
                <option value="Artist">Artist — 10,000 RWF</option>
                <option value="Growth">Growth — 25,000 RWF</option>
                <option value="Pro">Pro — 50,000 RWF</option>
              </select>

              <input name="phone" className="field" placeholder="MTN Mobile Money number used to pay" required />

              <label className="muted">Payment screenshot or receipt (JPG/JPEG/PDF, max 5 MB)</label>
              <input
                name="proof"
                className="field"
                type="file"
                accept=".jpg,.jpeg,.pdf,image/jpeg,application/pdf"
                required
              />

              <button className="btn primary">Submit Payment for Approval</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default function Payment(){return <Suspense fallback={<main className="shell"/>}><PaymentForm/></Suspense>}
