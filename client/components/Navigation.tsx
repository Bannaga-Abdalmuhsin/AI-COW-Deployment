import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, BrainCircuit, Database, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

const stcLogo = "https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, signOut } = useAuth();
  const links = [
    { label: "Overview", path: "/", icon: LayoutDashboard },
    { label: "Movement Intelligence", path: "/dashboard", icon: BarChart3 },
    { label: "Predictive Models", path: "/movement-predictions", icon: BrainCircuit },
    { label: "Data Governance", path: "/data", icon: Database },
  ];
  return <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#25102f]/95 text-white shadow-xl backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 lg:px-8">
      <Link to="/" className="flex items-center gap-3"><img src={stcLogo} alt="stc" className="h-7 brightness-0 invert" /><span className="hidden h-7 w-px bg-white/20 sm:block" /><div><p className="text-sm font-bold tracking-wide">Movement Intelligence</p><p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Predictive & Analysis Tool</p></div></Link>
      <div className="hidden items-center gap-1 lg:flex">{links.map(({label,path,icon:Icon}) => <Link key={path} to={path} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${location.pathname===path?"bg-white/15 text-white":"text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</div>
      <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-semibold">{username}</p><p className="flex items-center justify-end gap-1 text-[10px] text-emerald-300"><ShieldCheck className="h-3 w-3" />Secure session</p></div><button aria-label="Sign out" onClick={() => { signOut(); navigate("/login", {replace:true}); }} className="rounded-lg border border-white/15 p-2 text-white/70 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></button></div>
    </div>
    <div className="flex overflow-x-auto border-t border-white/5 px-3 lg:hidden">{links.map(({label,path}) => <Link key={path} to={path} className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs ${location.pathname===path?"border-[#ff375e] text-white":"border-transparent text-white/55"}`}>{label}</Link>)}</div>
  </nav>;
}
