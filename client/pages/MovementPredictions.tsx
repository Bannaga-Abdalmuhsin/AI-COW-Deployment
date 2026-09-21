import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  MapPin,
  MapPinned,
  Search,
  ShieldAlert,
  Target,
  Truck,
} from "lucide-react";

type RankedPrediction = { name: string; probability: number };
type MovementPrediction = {
  cowId: string;
  expectedDate: string;
  lastMovementDate: string;
  currentLocation: string;
  currentRegion: string;
  predictedDaysToNextMove: number;
  nextRegion: RankedPrediction;
  nextLocationCategory: RankedPrediction;
  regionAlternatives: RankedPrediction[];
  categoryAlternatives: RankedPrediction[];
};

type PredictionPayload = {
  modelVersion: string;
  generatedAt: string;
  predictions: MovementPrediction[];
};

const models = [
  { icon: MapPinned, name: "Next Region Classifier", primary: "80.4%", label: "Top-1 accuracy", status: "Production candidate" },
  { icon: Layers3, name: "Location Category Classifier", primary: "49.1%", label: "Top-1 accuracy", status: "Decision support" },
  { icon: Clock3, name: "Movement Timing Regressor", primary: "±128 days", label: "Mean absolute error", status: "Experimental" },
];

export default function MovementPredictions() {
  const [payload, setPayload] = useState<PredictionPayload | null>(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}movement-predictions.json`)
      .then((response) => {
        if (!response.ok) throw new Error("Prediction data is unavailable");
        return response.json();
      })
      .then(setPayload)
      .catch(() => setPayload({ modelVersion: "2.0.0", generatedAt: "", predictions: [] }));
  }, []);

  const predictions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (payload?.predictions ?? [])
      .filter((item) => region === "All regions" || item.nextRegion.name === region)
      .filter((item) => !normalized || item.cowId.toLowerCase().includes(normalized) || item.currentLocation.toLowerCase().includes(normalized))
      .sort((a, b) => a.expectedDate.localeCompare(b.expectedDate));
  }, [payload, query, region]);

  return (
    <div className="min-h-screen bg-[#f7f4f8]">
      <Navigation />
      <header className="border-b border-[#e6dce9] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#8c2ca8]">Predictive Models</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold text-[#25102f]">
                <BrainCircuit className="h-8 w-8 text-[#8c2ca8]" /> Next movement expectations
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Asset-level expectations generated from historical movement sequences. Dates and destinations are probabilistic planning signals, not confirmed work orders.
              </p>
            </div>
            <Badge className="w-fit bg-emerald-600 px-3 py-1">Model v{payload?.modelVersion ?? "2.0"}</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-7 px-5 py-7 lg:px-8">
        <section className="rounded-2xl bg-[#25102f] p-5 text-white shadow-xl md:p-7">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#d8b4e2]"><Truck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[.18em]">Upcoming movement queue</span></div>
              <h2 className="mt-3 text-2xl font-bold">What is expected to move next?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Forecasts are ordered by expected date and shown with an operational planning allowance of ±20 days. The model's wider validation error remains visible below for transparency.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input aria-label="Search COW ID or location" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search COW ID or location" className="h-11 w-full rounded-xl border border-white/15 bg-white/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8b4e2] sm:w-64" />
              </label>
              <select aria-label="Filter predicted region" value={region} onChange={(event) => setRegion(event.target.value)} className="h-11 rounded-xl border border-white/15 bg-[#351641] px-4 text-sm text-white outline-none focus:border-[#d8b4e2]">
                <option>All regions</option><option>Central</option><option>West</option><option>East</option><option>South</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-xl font-bold text-[#25102f]">Predicted next movements</h2><p className="mt-1 text-sm text-slate-500">{predictions.length} upcoming assets match the current view</p></div>
            <Badge variant="outline" className="border-[#8c2ca8]/30 text-[#8c2ca8]">Updated from historical model</Badge>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {predictions.map((prediction, index) => <PredictionCard key={prediction.cowId} prediction={prediction} priority={index + 1} />)}
            {payload && predictions.length === 0 && <Card className="border-dashed border-[#d8c9dc] bg-white lg:col-span-2 xl:col-span-3"><CardContent className="py-14 text-center text-sm text-slate-500">No upcoming movement expectations match this filter.</CardContent></Card>}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {models.map(({ icon: Icon, ...model }) => (
            <Card key={model.name} className="border-[#e6dce9] shadow-sm"><CardContent className="flex items-center gap-4 pt-6"><span className="rounded-xl bg-[#8c2ca8]/10 p-3 text-[#8c2ca8]"><Icon /></span><div className="min-w-0 flex-1"><p className="font-semibold text-[#25102f]">{model.name}</p><p className="mt-1 text-xs text-slate-500">{model.status}</p></div><div className="text-right"><p className="text-xl font-bold text-[#8c2ca8]">{model.primary}</p><p className="text-[10px] text-slate-400">{model.label}</p></div></CardContent></Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
          <Card className="border-[#e6dce9] shadow-sm"><CardHeader><CardTitle className="text-xl text-[#25102f]">How to read each expectation</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-3"><Step icon={<CalendarDays />} title="Planning window" text="Expected movement date with a 20-day allowance before and after." /><Step icon={<MapPinned />} title="Region forecast" text="Highest-ranked destination region and its probability." /><Step icon={<Target />} title="Movement purpose" text="Likely location category, such as event or warehouse." /></CardContent></Card>
          <Card className="border-amber-200 bg-amber-50/70 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-amber-900"><ShieldAlert className="h-5 w-5" /> Responsible use</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-amber-900/70">Predictions support—not replace—operational judgment. Confirm event schedules, site readiness, access, fleet condition, and STC approvals before dispatch.</CardContent></Card>
        </section>
      </main>
    </div>
  );
}

function PredictionCard({ prediction, priority }: { prediction: MovementPrediction; priority: number }) {
  const expectedDate = new Date(`${prediction.expectedDate}T00:00:00Z`);
  const windowStart = new Date(expectedDate);
  const windowEnd = new Date(expectedDate);
  windowStart.setUTCDate(windowStart.getUTCDate() - 20);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 20);
  const fullDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  const shortDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
  const date = fullDate.format(expectedDate);
  const planningWindow = `${shortDate.format(windowStart)} – ${fullDate.format(windowEnd)}`;
  return <Card className="overflow-hidden border-[#e6dce9] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="h-1 bg-gradient-to-r from-[#ff375e] via-[#8c2ca8] to-[#4f008c]" />
    <CardHeader className="pb-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8c2ca8]">Priority {String(priority).padStart(2, "0")}</p><CardTitle className="mt-2 text-2xl text-[#25102f]">{prediction.cowId}</CardTitle></div><div className="rounded-xl bg-[#f5eff7] px-3 py-2 text-right"><p className="text-[10px] uppercase tracking-wide text-slate-400">Expected date</p><p className="mt-1 text-sm font-bold text-[#25102f]">{date}</p><p className="mt-1 text-[10px] font-semibold text-[#8c2ca8]">±20 days: {planningWindow}</p></div></div></CardHeader>
    <CardContent className="space-y-5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-[#faf8fb] p-4"><Location label="Current" value={prediction.currentRegion} detail={prediction.currentLocation} /><ArrowRight className="h-5 w-5 text-[#ff375e]" /><Location label="Expected" value={prediction.nextRegion.name} detail={prediction.nextLocationCategory.name} align="right" /></div>
      <div className="grid grid-cols-2 gap-3"><Confidence label="Region confidence" value={prediction.nextRegion.probability} /><Confidence label="Category confidence" value={prediction.nextLocationCategory.probability} /></div>
      <div className="flex items-center justify-between border-t border-[#eee7f0] pt-4 text-xs text-slate-500"><span>Last moved {prediction.lastMovementDate}</span><span className="font-semibold text-[#8c2ca8]">{prediction.predictedDaysToNextMove} days estimated</span></div>
    </CardContent>
  </Card>;
}

function Location({ label, value, detail, align = "left" }: { label: string; value: string; detail: string; align?: "left" | "right" }) {
  return <div className={align === "right" ? "text-right" : "text-left"}><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#25102f]" style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}><MapPin className="h-3.5 w-3.5 text-[#8c2ca8]" />{value}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500" title={detail}>{detail}</p></div>;
}

function Confidence({ label, value }: { label: string; value: number }) {
  const percentage = Math.round(value * 100);
  return <div className="rounded-xl border border-[#eee7f0] p-3"><div className="flex items-center justify-between"><span className="text-[11px] text-slate-500">{label}</span><span className="text-sm font-bold text-[#8c2ca8]">{percentage}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee7f0]"><div className="h-full rounded-full bg-[#8c2ca8]" style={{ width: `${percentage}%` }} /></div></div>;
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-xl border border-[#eee7f0] p-4"><span className="text-[#ff375e]">{icon}</span><p className="mt-3 font-semibold text-[#25102f]">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div>;
}
