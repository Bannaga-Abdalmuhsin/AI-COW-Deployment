import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, BrainCircuit, CalendarClock, MapPin, Search, Target } from "lucide-react";

type RankedPrediction = { region?: string; category?: string; probability: number };
type CowPrediction = {
  cowId: string;
  lastMovementDate: string;
  currentLocation: string;
  currentRegion: string;
  predictedDaysToNextMove: number;
  nextRegion: RankedPrediction[];
  nextLocationCategory: RankedPrediction[];
};
type ModelResults = {
  modelVersion: string;
  trainedAt: string;
  source: string;
  method: string;
  data: { cleanMovementRows: number; uniqueCows: number; firstMovementDate: string; lastMovementDate: string; trainingSequences: number; validationSequences: number };
  metrics: {
    nextRegion: { accuracy: number; top3Accuracy: number };
    nextLocationCategory: { accuracy: number; top3Accuracy: number };
    daysToNextMove: { maeDays: number; r2: number };
  };
  predictions: CowPrediction[];
};

const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function MovementPredictions() {
  const [results, setResults] = useState<ModelResults | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}ml-model-results.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setResults)
      .catch((cause) => setError(`Prediction data could not be loaded: ${cause.message}`));
  }, []);

  const predictions = useMemo(() => {
    if (!results) return [];
    const normalized = query.trim().toLowerCase();
    return results.predictions
      .filter((item) => !normalized || item.cowId.toLowerCase().includes(normalized) || item.currentLocation.toLowerCase().includes(normalized) || item.currentRegion.toLowerCase().includes(normalized))
      .sort((a, b) => a.predictedDaysToNextMove - b.predictedDaysToNextMove);
  }, [query, results]);

  return (
    <div className="min-h-screen bg-stc-lilac">
      <Navigation />
      <header className="border-b border-stc-purple/10 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-stc-purple-dark"><BrainCircuit className="h-8 w-8 text-stc-purple" /> Movement Predictive Analysis</h1>
              <p className="mt-1 text-gray-600">Models trained from the cumulative historical movement tracker</p>
            </div>
            {results && <Badge className="w-fit bg-stc-purple text-white">Model v{results.modelVersion}</Badge>}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {error && <Card className="border-red-300"><CardContent className="pt-6 text-red-700">{error}</CardContent></Card>}
        {!results && !error && <Card><CardContent className="pt-6 text-gray-600">Loading trained movement model results…</CardContent></Card>}
        {results && <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={<Activity />} label="Historical movements" value={results.data.cleanMovementRows.toLocaleString()} />
            <MetricCard icon={<MapPin />} label="Unique COWs" value={results.data.uniqueCows.toLocaleString()} />
            <MetricCard icon={<Target />} label="Next-region accuracy" value={pct(results.metrics.nextRegion.accuracy)} note={`Top-3 ${pct(results.metrics.nextRegion.top3Accuracy)}`} />
            <MetricCard icon={<CalendarClock />} label="Timing MAE" value={`${results.metrics.daysToNextMove.maeDays.toFixed(0)} days`} note="Experimental estimate" />
          </section>
          <Card className="border-stc-purple/10 bg-white shadow-sm">
            <CardHeader><CardTitle className="text-stc-purple-dark">Training coverage</CardTitle><CardDescription>{results.method}</CardDescription></CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-4">
              <Info label="Source" value={results.source} />
              <Info label="History" value={`${results.data.firstMovementDate} – ${results.data.lastMovementDate}`} />
              <Info label="Training sequences" value={results.data.trainingSequences.toLocaleString()} />
              <Info label="Validation sequences" value={results.data.validationSequences.toLocaleString()} />
            </CardContent>
          </Card>
          <Card className="border-stc-purple/10 bg-white shadow-sm">
            <CardHeader><CardTitle className="text-stc-purple-dark">COW movement forecasts</CardTitle><CardDescription>Search by COW ID, current location, or region. Forecasts are sorted by expected movement timing.</CardDescription></CardHeader>
            <CardContent>
              <div className="relative mb-5 max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search COW ID, location, or region" className="pl-9" /></div>
              <div className="space-y-3">
                {predictions.slice(0, 100).map((item) => <div key={item.cowId} className="grid gap-4 rounded-lg border border-stc-purple/10 p-4 lg:grid-cols-[1.2fr_1fr_1fr_0.7fr]">
                  <div><p className="font-bold text-stc-purple-dark">{item.cowId}</p><p className="text-sm text-gray-600">{item.currentLocation}</p><Badge variant="outline" className="mt-2">{item.currentRegion}</Badge></div>
                  <PredictionList title="Next region" items={item.nextRegion} keyName="region" />
                  <PredictionList title="Location type" items={item.nextLocationCategory} keyName="category" />
                  <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Expected move</p><p className="mt-1 text-2xl font-bold text-stc-purple">{item.predictedDaysToNextMove}</p><p className="text-xs text-gray-500">days (estimate)</p></div>
                </div>)}
                {!predictions.length && <p className="py-8 text-center text-gray-500">No matching COW prediction found.</p>}
              </div>
              {predictions.length > 100 && <p className="mt-4 text-sm text-gray-500">Showing the first 100 of {predictions.length} matching predictions.</p>}
            </CardContent>
          </Card>
        </>}
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) {
  return <Card className="border-stc-purple/10 bg-white shadow-sm"><CardContent className="flex items-start justify-between pt-6"><div><p className="text-sm text-gray-600">{label}</p><p className="mt-1 text-3xl font-bold text-stc-purple-dark">{value}</p>{note && <p className="mt-1 text-xs text-gray-500">{note}</p>}</div><span className="text-stc-purple">{icon}</span></CardContent></Card>;
}
function Info({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-stc-lilac p-3"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 font-medium text-stc-purple-dark">{value}</p></div>;
}
function PredictionList({ title, items, keyName }: { title: string; items: RankedPrediction[]; keyName: "region" | "category" }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p><div className="mt-2 space-y-1">{items.slice(0, 3).map((entry) => <div key={`${entry[keyName]}-${entry.probability}`} className="flex justify-between gap-2 text-sm"><span>{entry[keyName]}</span><span className="font-semibold text-stc-purple">{pct(entry.probability)}</span></div>)}</div></div>;
}
