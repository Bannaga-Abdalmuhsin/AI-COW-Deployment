import { FormEvent, useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  CalendarDays,
  Database,
  MapPin,
  MessageSquareText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type MovementRecord = {
  recordNo: number | null;
  cowId: string | null;
  movedAt: string | null;
  reachedAt: string | null;
  fromLocation: string | null;
  toLocation: string | null;
  eventName: string | null;
  subLocation: string | null;
  category: string | null;
  administrativeRegion: string | null;
  regionFrom: string | null;
  regionTo: string | null;
  cityDistrict: string | null;
  vendor: string | null;
  distanceKm: number | null;
  priority: string | null;
  statusRemarks: string | null;
  managementComments: string | null;
  [key: string]: unknown;
};

type KnowledgePayload = { source: string; recordCount: number; fieldCount: number; records: MovementRecord[] };
type RankedPrediction = { name: string; probability: number };
type Prediction = { cowId: string; expectedDate: string; currentLocation: string; currentRegion: string; nextRegion: RankedPrediction; nextLocationCategory: RankedPrediction };
type PredictionPayload = { predictions: Prediction[] };
type Evidence = Pick<MovementRecord, "recordNo" | "cowId" | "movedAt" | "fromLocation" | "toLocation" | "eventName" | "regionTo" | "vendor" | "statusRemarks">;
type AgentAnswer = { question: string; answer: string; detail?: string; evidence: Evidence[]; confidence: "High" | "Medium" | "Limited" };

const suggestions = [
  "Show the movement history for COW005",
  "Which COWs moved to Jeddah Season?",
  "How many movements were recorded in West region in 2025?",
  "What are the next predicted movements?",
  "Show recent movements to ACES Muzahmiya WH",
  "Which events used Huawei COWs?",
];

const stopWords = new Set(["a", "about", "all", "and", "answer", "any", "are", "at", "by", "did", "do", "for", "from", "give", "how", "in", "is", "list", "me", "movement", "movements", "of", "on", "please", "recorded", "show", "site", "sites", "tell", "the", "to", "what", "which", "with"]);

export default function OperationsAgent() {
  const [knowledge, setKnowledge] = useState<KnowledgePayload | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<AgentAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}operations-knowledge.json`).then((response) => response.json()),
      fetch(`${import.meta.env.BASE_URL}movement-predictions.json`).then((response) => response.json()),
    ]).then(([data, predictionData]: [KnowledgePayload, PredictionPayload]) => {
      setKnowledge(data);
      setPredictions(predictionData.predictions ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const indexedRecords = useMemo(() => (knowledge?.records ?? []).map((record) => ({
    record,
    search: [record.cowId, record.eventName, record.fromLocation, record.toLocation, record.subLocation, record.category, record.administrativeRegion, record.regionFrom, record.regionTo, record.cityDistrict, record.vendor, record.priority, record.statusRemarks, record.managementComments].filter(Boolean).join(" ").toLowerCase(),
  })), [knowledge]);

  const ask = (prompt: string) => {
    const clean = prompt.trim();
    if (!clean || !knowledge) return;
    setAnswers((current) => [...current, answerQuestion(clean, indexedRecords, predictions)]);
    setQuestion("");
  };

  const submit = (event: FormEvent) => { event.preventDefault(); ask(question); };

  return <div className="min-h-screen bg-[#f7f4f8]">
    <Navigation />
    <header className="border-b border-[#e6dce9] bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 px-5 py-7 lg:flex-row lg:items-end lg:px-8">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8c2ca8]">AI Operations Agent</p><h1 className="mt-2 flex items-center gap-3 text-3xl font-bold text-[#25102f]"><Bot className="h-8 w-8 text-[#8c2ca8]" /> Ask the movement database</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Ask in plain language about any COW, event, site, region, date, vendor, status, historical movement, or model expectation. Answers are grounded in the uploaded workbook.</p></div>
        <div className="flex flex-wrap gap-2"><Badge variant="outline" className="border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Source grounded</Badge><Badge className="bg-[#25102f] px-3 py-1">{knowledge?.recordCount.toLocaleString() ?? "—"} records</Badge></div>
      </div>
    </header>

    <main className="mx-auto grid max-w-[1500px] gap-6 px-5 py-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
      <aside className="space-y-5">
        <Card className="border-[#e6dce9] shadow-sm"><CardContent className="pt-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#8c2ca8]/10 p-2.5 text-[#8c2ca8]"><Database className="h-5 w-5" /></span><div><p className="font-semibold text-[#25102f]">Knowledge coverage</p><p className="text-xs text-slate-500">Complete movement workbook</p></div></div><div className="mt-5 space-y-3 text-sm"><Coverage label="Movement records" value={knowledge?.recordCount.toLocaleString() ?? "Loading"} /><Coverage label="Available fields" value={knowledge?.fieldCount.toString() ?? "—"} /><Coverage label="ML expectations" value={predictions.length.toString()} /></div></CardContent></Card>
        <Card className="border-[#e6dce9] shadow-sm"><CardContent className="pt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">Suggested questions</p><div className="space-y-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)} disabled={loading} className="w-full rounded-xl border border-[#eee7f0] bg-white p-3 text-left text-xs leading-5 text-slate-600 transition hover:border-[#8c2ca8]/40 hover:bg-[#faf7fb] hover:text-[#25102f]">{suggestion}</button>)}</div></CardContent></Card>
      </aside>

      <section className="flex min-h-[680px] flex-col overflow-hidden rounded-2xl border border-[#e6dce9] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eee7f0] px-5 py-4"><div className="flex items-center gap-3"><span className="relative rounded-xl bg-[#25102f] p-2 text-white"><Sparkles className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" /></span><div><p className="font-semibold text-[#25102f]">COW Intelligence Assistant</p><p className="text-xs text-slate-500">Grounded retrieval · no invented records</p></div></div><Badge variant="outline" className="hidden border-[#d8c9dc] text-[#8c2ca8] sm:inline-flex">Excel source</Badge></div>
        <div className="flex-1 space-y-5 overflow-y-auto bg-[#fcfbfc] p-5 md:p-7">
          {answers.length === 0 && <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center"><span className="rounded-2xl bg-[#8c2ca8]/10 p-4 text-[#8c2ca8]"><MessageSquareText className="h-8 w-8" /></span><h2 className="mt-5 text-xl font-bold text-[#25102f]">What would you like to know?</h2><p className="mt-2 text-sm leading-6 text-slate-500">Try a COW ID, event name, destination site, region, vendor, year, or ask for the next predicted movement.</p></div>}
          {answers.map((item, index) => <Answer key={`${item.question}-${index}`} item={item} />)}
        </div>
        <form onSubmit={submit} className="border-t border-[#eee7f0] bg-white p-4 md:p-5"><div className="flex gap-3"><div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={question} onChange={(event) => setQuestion(event.target.value)} disabled={loading} placeholder={loading ? "Loading the movement knowledge base…" : "Ask about a COW, event, site, date, region, vendor, or prediction…"} className="h-12 w-full rounded-xl border border-[#dcd1df] bg-[#faf8fb] pl-11 pr-4 text-sm outline-none transition focus:border-[#8c2ca8] focus:ring-2 focus:ring-[#8c2ca8]/10" /></div><Button type="submit" disabled={loading || !question.trim()} className="h-12 bg-[#8c2ca8] px-5 text-white hover:bg-[#6f1f86]"><Send className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Ask agent</span></Button></div><p className="mt-2 text-[10px] text-slate-400">Verify operational decisions against the evidence rows and current field instructions.</p></form>
      </section>
    </main>
  </div>;
}

function answerQuestion(question: string, indexed: { record: MovementRecord; search: string }[], predictions: Prediction[]): AgentAnswer {
  const lower = question.toLowerCase();
  const cow = [...new Set(indexed.map(({ record }) => record.cowId).filter((value): value is string => Boolean(value)))].find((id) => lower.includes(id.toLowerCase()));
  if (lower.includes("next") && (lower.includes("predict") || lower.includes("expect") || lower.includes("movement"))) {
    const matches = cow ? predictions.filter((item) => item.cowId.toLowerCase() === cow.toLowerCase()) : predictions;
    if (!matches.length) return { question, answer: `No upcoming model expectation is available for ${cow ?? "that request"}.`, detail: "The published model queue contains five upcoming expectations.", evidence: [], confidence: "Limited" };
    const summary = matches.map((item) => `${item.cowId}: ${formatDate(item.expectedDate)} to ${item.nextLocationCategory.name} in ${item.nextRegion.name} (${Math.round(item.nextRegion.probability * 100)}% region confidence)`).join(" · ");
    return { question, answer: matches.length === 1 ? summary : `${matches.length} upcoming expectations: ${summary}`, detail: "Expected dates use the model estimate; the prediction cards apply a ±20-day planning allowance.", evidence: [], confidence: "Medium" };
  }

  const year = lower.match(/\b(20\d{2})\b/)?.[1];
  const region = ["central", "west", "east", "south"].find((value) => lower.includes(value));
  const vendor = ["ericsson", "huawei", "nokia"].find((value) => lower.includes(value));
  const tokens = lower.replace(/[^\p{L}\p{N}]+/gu, " ").split(/\s+/).filter((token) => token.length > 1 && !stopWords.has(token) && token !== year && token !== region && token !== vendor);
  let candidates = indexed.filter(({ record }) => {
    if (cow && record.cowId?.toLowerCase() !== cow.toLowerCase()) return false;
    if (year && !record.movedAt?.startsWith(year)) return false;
    if (region && ![record.regionFrom, record.regionTo, record.administrativeRegion].some((value) => value?.toLowerCase().includes(region))) return false;
    if (vendor && record.vendor?.toLowerCase() !== vendor) return false;
    return true;
  });
  if (tokens.length) {
    const scored = candidates.map((item) => ({ ...item, score: tokens.reduce((total, token) => total + (item.search.includes(token) ? 1 : 0), 0) })).filter((item) => item.score > 0);
    const maxScore = Math.max(0, ...scored.map((item) => item.score));
    candidates = scored.filter((item) => item.score === maxScore || item.score >= Math.max(1, maxScore - 1));
  }
  const records = candidates.map(({ record }) => record).sort((a, b) => (b.movedAt ?? "").localeCompare(a.movedAt ?? ""));
  if (!records.length) return { question, answer: "I could not find a matching movement record in the uploaded workbook.", detail: "Try the exact COW ID, event name, site name, region, vendor, or year.", evidence: [], confidence: "Limited" };

  const uniqueCows = new Set(records.map((record) => record.cowId).filter(Boolean)).size;
  const uniqueEvents = new Set(records.map((record) => record.eventName).filter(Boolean)).size;
  const totalDistance = records.reduce((sum, record) => sum + (typeof record.distanceKm === "number" ? record.distanceKm : 0), 0);
  const topRegions = topValues(records.map((record) => record.regionTo));
  const latest = records[0];
  let answer = `${records.length.toLocaleString()} matching movement records were found across ${uniqueCows.toLocaleString()} COWs.`;
  if (cow) answer = `${cow} has ${records.length} matching movements. Its latest recorded movement was ${formatDate(latest.movedAt)} from ${latest.fromLocation ?? "an unspecified origin"} to ${latest.toLocation ?? "an unspecified destination"}${latest.eventName ? ` for ${latest.eventName}` : ""}.`;
  else if (lower.includes("event")) answer = `${records.length.toLocaleString()} matching event-related movements were found across ${uniqueEvents.toLocaleString()} named events and ${uniqueCows.toLocaleString()} COWs.`;
  else if (lower.includes("how many") || lower.includes("count")) answer = `${records.length.toLocaleString()} movements match the requested criteria, covering ${uniqueCows.toLocaleString()} COWs and ${uniqueEvents.toLocaleString()} named events.`;
  else if (lower.includes("site") || lower.includes("location") || lower.includes("moved to")) answer = `${records.length.toLocaleString()} matching site movements were found. The most recent was ${formatDate(latest.movedAt)} to ${latest.toLocation ?? "an unspecified destination"} by ${latest.cowId ?? "an unspecified COW"}.`;
  const detail = `${topRegions ? `Most common destination region: ${topRegions}. ` : ""}Recorded distance across matches: ${Math.round(totalDistance).toLocaleString()} km.`;
  return { question, answer, detail, evidence: records.slice(0, 8).map(toEvidence), confidence: tokens.length || cow || year || region || vendor ? "High" : "Medium" };
}

function toEvidence(record: MovementRecord): Evidence { return { recordNo: record.recordNo, cowId: record.cowId, movedAt: record.movedAt, fromLocation: record.fromLocation, toLocation: record.toLocation, eventName: record.eventName, regionTo: record.regionTo, vendor: record.vendor, statusRemarks: record.statusRemarks }; }
function topValues(values: (string | null)[]) { const counts = new Map<string, number>(); values.filter(Boolean).forEach((value) => counts.set(value!, (counts.get(value!) ?? 0) + 1)); return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ""; }
function formatDate(value: string | null) { if (!value) return "an unknown date"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date); }

function Coverage({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-[#f0ebf1] pb-2 last:border-0"><span className="text-slate-500">{label}</span><span className="font-semibold text-[#25102f]">{value}</span></div>; }

function Answer({ item }: { item: AgentAnswer }) {
  return <div className="space-y-3"><div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#25102f] px-4 py-3 text-sm text-white">{item.question}</div><div className="max-w-[95%] rounded-2xl rounded-bl-md border border-[#e7ddea] bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><span className="rounded-lg bg-[#8c2ca8]/10 p-2 text-[#8c2ca8]"><Bot className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-[#25102f]">Grounded answer</p><Badge variant="outline" className={item.confidence === "High" ? "border-emerald-300 text-emerald-700" : item.confidence === "Medium" ? "border-amber-300 text-amber-700" : "border-slate-300 text-slate-600"}>{item.confidence} confidence</Badge></div><p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p>{item.detail && <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>}</div></div>{item.evidence.length > 0 && <div className="mt-5 overflow-x-auto rounded-xl border border-[#eee7f0]"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[#f7f4f8] text-slate-500"><tr><th className="px-3 py-2.5">Date</th><th className="px-3 py-2.5">COW ID</th><th className="px-3 py-2.5">From</th><th className="px-3 py-2.5">To / event</th><th className="px-3 py-2.5">Region</th><th className="px-3 py-2.5">Vendor</th></tr></thead><tbody>{item.evidence.map((record, index) => <tr key={`${record.recordNo}-${index}`} className="border-t border-[#f0ebf1]"><td className="whitespace-nowrap px-3 py-3"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#8c2ca8]" />{formatDate(record.movedAt)}</span></td><td className="px-3 py-3 font-semibold text-[#25102f]">{record.cowId ?? "—"}</td><td className="max-w-[170px] px-3 py-3 text-slate-500">{record.fromLocation ?? "—"}</td><td className="max-w-[190px] px-3 py-3"><span className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff375e]" />{record.eventName ?? record.toLocation ?? "—"}</span></td><td className="px-3 py-3">{record.regionTo ?? "—"}</td><td className="px-3 py-3">{record.vendor ?? "—"}</td></tr>)}</tbody></table></div>}</div></div>;
}
