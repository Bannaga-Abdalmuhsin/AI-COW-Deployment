import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ArrowRight, BrainCircuit, CalendarRange, CheckCircle2, MapPinned, Route, ShieldCheck, Sparkles } from "lucide-react";

const modules = [
  { icon: Route, title: "Movement Intelligence", text: "Understand regional flows, movement seasonality, event patterns, and fleet utilization." },
  { icon: BrainCircuit, title: "Predictive Models", text: "Forecast next region and movement category with transparent validation metrics." },
  { icon: CalendarRange, title: "Planning Horizon", text: "Use historical patterns to support event readiness and COW allocation planning." },
];

export default function Index() {
  return <div className="min-h-screen bg-[#f7f4f8] text-[#25102f]">
    <Navigation />
    <main>
      <section className="relative overflow-hidden bg-[#25102f] text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#8c2ca8_0,transparent_32%),radial-gradient(circle_at_82%_70%,#ff375e_0,transparent_26%)]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-6 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-white/80"><Sparkles className="h-4 w-4 text-[#ff375e]" />AI-enabled COW operations</div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">Movement Predictive<br/><span className="text-[#ff375e]">& Analysis Tool</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">A decision-support platform that transforms cumulative COW movement history into regional intelligence, model performance indicators, and actionable planning signals.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[#ff375e] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#ff375e]/20 transition hover:-translate-y-0.5">Open movement intelligence <ArrowRight className="h-4 w-4" /></Link><Link to="/movement-predictions" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white hover:bg-white/15">View model performance</Link></div>
          </div>
          <div className="grid content-center gap-3 sm:grid-cols-2">
            <HeroMetric label="Historical movements" value="2,694" note="Validated records" />
            <HeroMetric label="COW fleet coverage" value="447" note="Unique assets" />
            <HeroMetric label="Next-region accuracy" value="80.4%" note="95.2% Top-3" />
            <HeroMetric label="History window" value="5+ yrs" note="Jan 2021 – Apr 2026" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#8c2ca8]">Operational decision support</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">One view from history to action</h2></div><p className="max-w-xl text-sm leading-6 text-slate-500">Designed for planning and leadership review. Operational identifiers and detailed movement records remain outside the public deployment.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{modules.map(({icon:Icon,title,text}) => <div key={title} className="group rounded-2xl border border-[#e6dce9] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8c2ca8]/10 text-[#8c2ca8]"><Icon className="h-6 w-6" /></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></div>)}</div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 pb-20 lg:px-10"><div className="grid gap-6 rounded-3xl border border-[#e6dce9] bg-white p-8 shadow-sm lg:grid-cols-[1fr_1fr] lg:p-10"><div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck /></div><h2 className="mt-5 text-3xl font-bold">Grounded operational intelligence</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">The AI Operations Agent searches the complete uploaded movement workbook and returns evidence rows with every answer. Predictions remain clearly separated from confirmed historical records.</p></div><div className="grid gap-3 sm:grid-cols-2"><Control text="2,917 searchable records"/><Control text="32 operational fields"/><Control text="Evidence-backed answers"/><Control text="Chronological model validation"/></div></div></section>
    </main>
    <footer className="border-t border-[#e6dce9] bg-white"><div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10"><p>stc COW Movement Predictive & Analysis Tool</p><p>Decision support • Aggregated demonstration data</p></div></footer>
  </div>;
}

function HeroMetric({label,value,note}:{label:string;value:string;note:string}) { return <div className="rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur"><p className="text-xs uppercase tracking-[.15em] text-white/45">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-white/45">{note}</p></div>; }
function Control({text}:{text:string}) { return <div className="flex items-center gap-3 rounded-xl bg-[#f7f4f8] p-4 text-sm font-semibold"><CheckCircle2 className="h-5 w-5 text-emerald-600" />{text}</div>; }
