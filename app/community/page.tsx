"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [error, setError] = useState("");

  async function load() { const r = await fetch("/api/community/posts"); const d = await r.json(); if (!r.ok) { setError(d.error || "Unable to load"); return; } setPosts(d.posts || []); }
  useEffect(() => { load(); }, []);
  async function post(e: React.FormEvent) { e.preventDefault(); if (!content.trim()) return; const r = await fetch("/api/community/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) }); if (r.ok) { setContent(""); load(); } }
  async function like(id: string) { const r = await fetch("/api/community/posts/" + id + "/like", { method: "POST" }); if (r.ok) load(); }
  async function showComments(id: string) { const r = await fetch("/api/community/posts/" + id + "/comments"); const d = await r.json(); setComments({ ...comments, [id]: d.comments || [] }); }
  async function comment(id: string) { const value = window.prompt("Write your comment"); if (!value?.trim()) return; const r = await fetch("/api/community/posts/" + id + "/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: value }) }); if (r.ok) showComments(id); }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">TREKO <span>MUSIC</span></Link>
        <Link className="btn ghost" href="/dashboard">Dashboard</Link>
      </nav>
      <section className="section">
        <div className="eyebrow">Artists Community</div>
        <h2>Private community for active members</h2>
        <div className="card" style={{ marginTop: 20 }}>
          <form onSubmit={post} style={{ display: "grid", gap: 12 }}>
            <textarea className="field" rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Share a release, idea, opportunity or feedback..." />
            <button className="btn primary">Publish Post</button>
            {error && <p style={{ color: "#ffd400" }}>{error}</p>}
          </form>
        </div>
        <div style={{ display: "grid", gap: 16, marginTop: 28 }}>
          {posts.map(p => (
            <div className="card" key={p.id}>
              <b>{p.artist.stageName}</b>
              <p className="muted">{p.content}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn ghost" onClick={() => like(p.id)}>Like · {p._count.likes}</button>
                <button className="btn ghost" onClick={() => showComments(p.id)}>Comments · {p._count.comments}</button>
                <button className="btn ghost" onClick={() => comment(p.id)}>Comment</button>
              </div>
              {comments[p.id]?.map(c => <p key={c.id} className="muted" style={{ marginLeft: 12 }}><b>{c.artist.stageName}:</b> {c.content}</p>)}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}