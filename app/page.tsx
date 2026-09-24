import Link from "next/link";
import {ArrowRight, Music2, Users, Megaphone, Upload, Menu as MenuIcon} from "lucide-react";

const services=[
 {title:"Artist Profile",text:"Manage your artist identity and music profile.",icon:Music2,href:"/dashboard"},
 {title:"Join Artists Community",text:"Connect, share and collaborate with active artists.",icon:Users,service:"community"},
 {title:"Promote Your Song",text:"Submit your song for promotion and audience growth.",icon:Megaphone,service:"promotion"},
 {title:"Distribute Your Song",text:"Submit your release for distribution support.",icon:Upload,service:"distribution"}
];

export default function Home(){
 return <main className="shell home-page">
  <nav className="nav"><Link href="/" className="brand"><span className="brand-mark"><Music2 size={15}/></span>TREKO <span>MUSIC</span></Link>
   <details className="menu"><summary className="menu-trigger"><MenuIcon size={14}/><span>Menu</span></summary><div className="menu-dropdown"><Link href="#services">Services</Link><Link href="/plans?service=community">Community</Link><Link href="/plans?service=promotion">Promotion</Link><Link href="/plans?service=distribution">Distribution</Link><Link href="/login">Artist Login</Link></div></details>
  </nav>
  <section className="hero compact-hero"><div>
   <div className="eyebrow">Treko Music</div><h1>Build your audience.<br/><span>Grow your music.</span></h1>
   <p>A platform for artists to grow their audience, promote music, connect, and grow their careers.</p>
   <div className="actions"><Link className="btn primary" href="/register">Create Artist Account <ArrowRight size={14}/></Link><Link className="btn ghost" href="/login">Artist Login</Link></div>
  </div></section>
  <section id="services" className="home-services"><div className="service-grid">{services.map(({title,text,icon:Icon,href,service})=><div className="card service-card" key={title}><div className="service-icon"><Icon size={18}/></div><div><h3>{title}</h3><p className="muted">{text}</p></div><Link className="btn ghost service-button" href={href || "/plans?service="+service}>Get Started <ArrowRight size={12}/></Link></div>)}</div></section>
  <footer className="footer">© 2026 Treko Music • Treko Music Artists</footer>
 </main>
}