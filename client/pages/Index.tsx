import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: TrendingUp,
      title: "Demand Prediction",
      description:
        "AI-powered forecasting of COW deployment demand by region and event type",
    },
    {
      icon: CheckCircle2,
      title: "Success Scoring",
      description:
        "Predict deployment success probability based on site characteristics and history",
    },
    {
      icon: MapPin,
      title: "Site Optimization",
      description:
        "Smart recommendations matching COWs to sites with vendor and tech constraints",
    },
    {
      icon: Zap,
      title: "Logistics Planning",
      description:
        "Estimate setup time and logistics requirements for seamless deployments",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Prepare Data",
      description: "Upload your events, deployments, sites, and warehouse data",
    },
    {
      number: "2",
      title: "Train Models",
      description:
        "ML models learn from 3+ years of deployment history to predict success",
    },
    {
      number: "3",
      title: "Get Insights",
      description:
        "Dashboard shows demand heatmaps and AI-ranked site recommendations",
    },
    {
      number: "4",
      title: "Optimize Placement",
      description:
        "Make data-driven decisions with explainable ML recommendations",
    },
  ];

  const dataRequirements = [
    { table: "Events", rows: "Religious / Sport / National / Incident" },
    { table: "Deployment History", rows: "3-year historical deployment data" },
    { table: "Site Master", rows: "Vendor, region, tech capabilities" },
    { table: "Warehouse (ACES)", rows: "COW inventory locations" },
    { table: "COW Assets", rows: "Tech specs, height, VSAT capabilities" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 rounded-lg p-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">COW Deploy AI</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-700"></div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200"
              alt="STC"
              className="h-6"
            />
          </div>
          <Link to="/dashboard">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered COW Deployment Planning
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Predict demand, optimize site selection, and ensure deployment
            success with machine learning-driven recommendations
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg flex items-center gap-2">
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-slate-600 text-white hover:bg-slate-800"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
              >
                <Icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-sm">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-3 text-blue-500/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Requirements */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            What You Need
          </h2>
          <p className="text-slate-300 text-center mb-8">
            Prepare 5 clean data tables to train our ML models
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {dataRequirements.map((req, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <h4 className="font-semibold text-white">{req.table}</h4>
                </div>
                <p className="text-slate-400 text-sm">{req.rows}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ML Models Section */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 mb-24">
          <h2 className="text-2xl font-bold text-white mb-8">
            Three Powerful ML Models
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">Demand Prediction</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Forecasts COW demand by region and event type based on temporal
                patterns and historical trends
              </p>
              <p className="text-xs text-slate-400">
                Output: demand_score (0–1) | Runs: Monthly
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">
                  Site Success Scoring
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Predicts deployment success probability considering site vendor,
                tech specs, and historical performance
              </p>
              <p className="text-xs text-slate-400">
                Output: success_probability (0–1) | Runs: On-demand
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">Logistics Planning</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Estimates setup time and logistics risks based on warehouse
                distance, terrain, and equipment requirements
              </p>
              <p className="text-xs text-slate-400">
                Output: predicted_time_hours | Runs: On-demand
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Deployments?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start with our interactive dashboard and upload your data today
          </p>
          <Link to="/dashboard">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg font-semibold">
              Launch Dashboard Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>
            COW Deploy AI • ML-Powered Cell on Wheels Deployment Optimization
          </p>
        </div>
      </footer>
    </div>
  );
}
