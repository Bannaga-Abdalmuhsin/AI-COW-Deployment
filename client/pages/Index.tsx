import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen bg-stc-lilac">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-stc-purple-dark mb-6 leading-tight">
            AI-Powered COW Deployment Planning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Predict demand, optimize site selection, and ensure deployment
            success with machine learning-driven recommendations
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button className="bg-stc-purple hover:bg-stc-purple/90 text-white px-8 py-6 text-lg flex items-center gap-2 shadow-lg">
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-stc-purple text-stc-purple hover:bg-stc-purple/10"
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
                className="bg-white border border-stc-purple/10 rounded-lg p-6 hover:shadow-lg transition-all hover:border-stc-purple/30"
              >
                <Icon className="w-8 h-8 text-stc-purple mb-4" />
                <h3 className="text-lg font-semibold text-stc-purple-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-stc-purple-dark mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-stc-lavender/30 to-stc-purple/20 border border-stc-purple/20 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-stc-purple text-white rounded-full font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-stc-purple-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-3 text-stc-purple/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Requirements */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-stc-purple-dark mb-12 text-center">
            What You Need
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Prepare 5 clean data tables to train our ML models
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {dataRequirements.map((req, idx) => (
              <div
                key={idx}
                className="bg-white border border-stc-purple/10 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-stc-purple rounded-full"></div>
                  <h4 className="font-semibold text-stc-purple-dark">{req.table}</h4>
                </div>
                <p className="text-gray-600 text-sm">{req.rows}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ML Models Section */}
        <div className="bg-gradient-to-br from-stc-lavender/20 to-stc-purple/10 border border-stc-purple/20 rounded-xl p-8 mb-24">
          <h2 className="text-2xl font-bold text-stc-purple-dark mb-8">
            Three Powerful ML Models
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-stc-purple" />
                <h3 className="font-semibold text-stc-purple-dark">Demand Prediction</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Forecasts COW demand by region and event type based on temporal
                patterns and historical trends
              </p>
              <p className="text-xs text-gray-500">
                Output: demand_score (0–1) | Runs: Monthly
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-stc-purple" />
                <h3 className="font-semibold text-stc-purple-dark">
                  Site Success Scoring
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Predicts deployment success probability considering site vendor,
                tech specs, and historical performance
              </p>
              <p className="text-xs text-gray-500">
                Output: success_probability (0–1) | Runs: On-demand
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-stc-purple" />
                <h3 className="font-semibold text-stc-purple-dark">Logistics Planning</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Estimates setup time and logistics risks based on warehouse
                distance, terrain, and equipment requirements
              </p>
              <p className="text-xs text-gray-500">
                Output: predicted_time_hours | Runs: On-demand
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-stc-purple to-stc-purple/90 rounded-xl p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Deployments?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Start with our interactive dashboard and upload your data today
          </p>
          <Link to="/dashboard">
            <Button className="bg-white text-stc-purple hover:bg-white/90 px-8 py-6 text-lg font-semibold">
              Launch Dashboard Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stc-purple/20 bg-stc-lilac py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 mb-8">
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200"
                alt="STC Logo"
                className="h-8"
              />
              <div className="hidden sm:block h-8 w-px bg-stc-purple/20"></div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fed947135ce9d4b3a8b599f5a859cf435?format=webp&width=300"
                alt="ACES Managed Services Logo"
                className="h-8"
              />
            </div>
            <p className="text-center text-gray-600">
              COW Deploy AI • ML-Powered Cell on Wheels Deployment Optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
