import Link from "next/link";
import {ArrowRight, Music2, Users, Megaphone, Upload, Menu as MenuIcon, MessageCircle, Instagram, Facebook, Mail, Phone} from "lucide-react";
import {getCurrentArtist} from "@/lib/auth";

const partners=[
 {name:"Country Records",logo:"https://pbs.twimg.com/profile_images/1609316068207509504/UpcikZhx.jpg"},
 {name:"1:55 AM",logo:"https://pbs.twimg.com/profile_images/1866865047856615424/jPedRpsu_400x400.jpg"},
 {name:"CB Records",logo:"https://st.fl.ru/users/pe/pekktasdesign/portfolio/f_197631a3c16c56c8.jpg"},
 {name:"OutRage Music Records",logo:null},
 {name:"Capital Records",logo:null}
];

const services=[
 {title:"Artist Profile",text:"Manage your artist identity and music profile.",icon:Music2,href:"/dashboard"},
 {title:"Join Artists Community",text:"Connect, share and collaborate with active artists.",icon:Users,service:"community"},
 {title:"Promote Your Song",text:"Submit your song for promotion and audience growth.",icon:Megaphone,service:"promotion"},
 {title:"Distribute Your Song",text:"Submit your release for distribution support.",icon:Upload,service:"distribution"}
];

export default async function Home(){
 const artist=await getCurrentArtist();
 return <main className="shell home-page">
  <nav className="nav"><Link href="/" className="brand"><span className="brand-mark"><Music2 size={15}/></span>TREKO <span>MUSIC</span></Link>
   <details className="menu"><summary className="menu-trigger"><MenuIcon size={14}/><span>Menu</span></summary><div className="menu-dropdown"><Link href="#services">Services</Link><Link href="/plans?service=community">Community</Link><Link href="/plans?service=promotion">Promotion</Link><Link href="/plans?service=distribution">Distribution</Link><Link href="#contact">Contact</Link><Link href="/login">Artist Login</Link></div></details>
  </nav>
  <section className="hero compact-hero"><div>
   <div className="eyebrow">Treko Music</div><h1>Build your audience.<br/><span>Grow your music.</span></h1>
   <p>A platform for artists to grow their audience, promote music, connect, and grow their careers.</p>
   <div className="actions">{artist?<Link className="btn primary" href="/dashboard">Artist Profile <ArrowRight size={14}/></Link>:<><Link className="btn primary" href="/register">Create Artist Account <ArrowRight size={14}/></Link><Link className="btn ghost" href="/login">Artist Login</Link></>}</div>
  </div></section>
  <section id="services" className="home-services"><div className="service-grid">{services.map(({title,text,icon:Icon,href,service})=><div className="card service-card" key={title}><div className="service-icon"><Icon size={18}/></div><div><h3>{title}</h3><p className="muted">{text}</p></div><Link className="btn ghost service-button" href={href || "/plans?service="+service}>Get Started <ArrowRight size={12}/></Link></div>)}</div></section>
  <footer className="site-footer">
   <div className="footer-inner">
    <div className="footer-brand"><Link href="/" className="brand footer-logo"><span className="brand-mark"><Music2 size={13}/></span>TREKO <span>MUSIC</span></Link><p>Music promotion, distribution and artist growth platform in Rwanda.</p></div>
    <div className="footer-block" id="contact"><h4>Contact</h4><a href="https://wa.me/250726969060" target="_blank" rel="noreferrer"><MessageCircle size={13}/> WhatsApp</a><a href="tel:+250726969060"><Phone size={13}/> +250 726 969 060</a><a href="mailto:info@trekomusic.com"><Mail size={13}/> info@trekomusic.com</a></div>
    <div className="footer-block social-column"><h4>Social</h4><div className="social-links"><a href={process.env.NEXT_PUBLIC_TREKO_INSTAGRAM || "#"} target="_blank" rel="noreferrer"><Instagram size={15}/><span>Instagram</span></a><a href={process.env.NEXT_PUBLIC_TREKO_FACEBOOK || "#"} target="_blank" rel="noreferrer"><Facebook size={15}/><span>Facebook</span></a><a href={process.env.NEXT_PUBLIC_TREKO_TIKTOK || "#"} target="_blank" rel="noreferrer"><Music2 size={15}/><span>TikTok</span></a></div></div>
   </div>
   <div className="partners"><div className="partners-heading"><span>Partners & Studios</span><small>Rwanda</small></div><div className="partner-grid">{partners.map((partner)=><a className="partner" href={`https://wa.me/${process.env.NEXT_PUBLIC_TREKO_WHATSAPP_NUMBER || "250726969060"}?text=${encodeURIComponent("Hello Treko Music Admin, I would like to contact you about " + partner.name)}`} target="_blank" rel="noreferrer" key={partner.name}><div className="partner-logo">{partner.logo ? <img src={partner.logo} alt={partner.name+" logo"} loading="lazy"/> : <span className="partner-text-logo">{partner.name}</span>}</div><span>{partner.name}</span></a>)}</div></div>
   <div className="footer-bottom">© 2026 Treko Music • Treko Music Artists</div>
  </footer>
 </main>
}