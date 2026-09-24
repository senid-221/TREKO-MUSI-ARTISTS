"use client";
import {useSearchParams,useRouter} from "next/navigation";
import {Suspense,useState} from "react";
import Link from "next/link";

const plans=[{name:"Artist",amount:10000,text:"Profile, community and releases"},{name:"Growth",amount:25000,text:"Community and promotion support"},{name:"Pro",amount:50000,text:"Priority artist growth support"}];

function PlansForm(){
 const params=useSearchParams(); const router=useRouter();
 const service=params.get("service")||"community"; const [loading,setLoading]=useState(""); const [error,setError]=useState("");
 const labels:{[key:string]:string}={community:"Join Artists Community",promotion:"Promote Your Song",distribution:"Distribute Your Song"};
 async function choose(plan:string){
  setLoading(plan);setError("");
  const r=await fetch("/api/service-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service,plan})});
  const d=await r.json();setLoading("");
  if(!r.ok){if(r.status===401){router.push("/login");return}setError(d.error||"Unable to submit request");return}
  router.push("/payment?plan="+encodeURIComponent(plan)+"&requestId="+encodeURIComponent(d.requestId)+"&service="+encodeURIComponent(service));
 }
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">TREKO <span>MUSIC</span></Link><Link href="/dashboard" className="btn ghost">Profile</Link></nav>
 <section className="section compact-page"><div className="eyebrow">Choose a Plan</div><h2>{labels[service]||"Artist Service"}</h2><p className="muted">Select a plan. Your request is sent to the Treko Music admin dashboard, then you will be taken to payment proof.</p>{error&&<p className="login-error">{error}</p>}
 <div className="plan-grid">{plans.map(p=><div className="card plan" key={p.name}><h3>{p.name}</h3><div className="plan-price">{p.amount.toLocaleString()} RWF <span>/ month</span></div><p className="muted">{p.text}</p><button className="btn primary" disabled={!!loading} onClick={()=>choose(p.name)}>{loading===p.name?"Submitting...":"Get Started"}</button></div>)}</div></section></main>
}
export default function Plans(){return <Suspense fallback={<main className="shell"/>}><PlansForm/></Suspense>}