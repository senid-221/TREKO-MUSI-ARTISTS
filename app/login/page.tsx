"use client";
import {useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import Link from "next/link";
export default function Login(){
 const router=useRouter(); const params=useSearchParams(); const next=params.get("next");
 const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setLoading(true);setError("");
  const f=new FormData(e.currentTarget);
  const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f))});
  const d=await r.json();setLoading(false);
  if(!r.ok){setError(d.error||"Login failed");return}
  router.push(d.role==="ADMIN"?"/admin/dashboard":(next||"/dashboard")); router.refresh();
 }
 return <main className="shell"><section className="section login-page" style={{maxWidth:500}}>
  <div className="card">
   <div className="eyebrow">Artist Portal</div><h2>Welcome back</h2>
   {params.get("registered")==="1"&&<p className="login-success">Account created. Please login to continue.</p>}
   {error&&<p className="login-error">{error}</p>}
   <form onSubmit={submit} className="compact-form"><input name="email" required className="field" type="email" placeholder="Email"/><input name="password" required className="field" type="password" placeholder="Password"/><button disabled={loading} className="btn primary">{loading?"Signing in...":"Login"}</button></form>
   <p className="muted">New artist? <Link href="/register">Create an account</Link></p>
  </div>
 </section></main>
}