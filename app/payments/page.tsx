"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Payment = {
  id: string; amount: number; currency: string; provider: string; phone: string | null;
  reference: string | null; status: string; createdAt: string; verifiedAt: string | null;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/payments/history", { cache: "no-store" })
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Unable to load payments.");
        setPayments(d.payments || []);
      })
      .catch(e => setError(e.message));
  }, []);

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">TREKO <span>MUSI</span></Link>
        <Link href="/dashboard" className="btn ghost">Dashboard</Link>
      </nav>
      <section className="section">
        <div className="eyebrow">Artist Payments</div>
        <h2>Payment History</h2>
        <p className="muted">Track your Treko Musi membership payment requests and verification status.</p>
        {error && <p style={{color:"#ffd400"}}>{error}</p>}
        <div style={{display:"grid",gap:12,marginTop:18}}>
          {payments.length === 0 && !error && <div className="card"><p className="muted">No membership payments yet.</p><Link href="/payment" className="btn primary">Make a Payment</Link></div>}
          {payments.map(p => (
            <div className="card" key={p.id}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <div><h3>{p.amount.toLocaleString()} {p.currency}</h3><p className="muted">{p.provider} · {p.phone || "No phone"}</p></div>
                <strong style={{color:p.status==="PAID" ? "#ffd400" : "#fff"}}>{p.status}</strong>
              </div>
              <p className="muted">Reference: {p.reference || "Waiting for MTN reference"}</p>
              <p className="muted">{new Date(p.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
