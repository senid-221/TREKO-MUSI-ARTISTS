"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Releases() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", type: "Song", artworkUrl: "", musicUrl: "" });

  async function load() { const r = await fetch("/api/releases"); if (r.status === 401) { location.href = "/login"; return; } const d = await r.json(); setItems(d.releases || []); }
  useEffect(() => { load(); }, []);
  async function submit(e: React.FormEvent) { e.preventDefault(); setError(""); const r = await fetch("/api/releases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await r.json(); if (!r.ok) { setError(d.error || "Unable to create release"); return; } setForm({ title: "", type: "Song", artworkUrl: "", musicUrl: "" }); load(); }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">TREKO <span>MUSIC</span></Link>
        <Link href="/dashboard" className="btn ghost">Dashboard</Link>
      </nav>
      <section className="section" style={{ maxWidth: 850 }}>
        <div className="eyebrow">Artist Releases</div>
        <h2>Your music</h2>
        <div className="card">
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <input className="field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Release title" required />
            <select className="field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Song</option><option>Album</option><option>EP</option><option>Music Video</option></select>
            <input className="field" value={form.artworkUrl} onChange={e => setForm({ ...form, artworkUrl: e.target.value })} placeholder="Artwork URL (optional)" />
            <input className="field" value={form.musicUrl} onChange={e => setForm({ ...form, musicUrl: e.target.value })} placeholder="Music / video URL (optional)" />
            <button className="btn primary">Add Release</button>
            {error && <p style={{ color: "#ffd400" }}>{error}</p>}
          </form>
        </div>
        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          {items.map(x => <div className="card" key={x.id}><h3>{x.title}</h3><p className="muted">{x.type}</p>{x.musicUrl && <a className="btn ghost" href={x.musicUrl} target="_blank" rel="noreferrer">Open Media</a>}</div>)}
        </div>
      </section>
    </main>
  );
}