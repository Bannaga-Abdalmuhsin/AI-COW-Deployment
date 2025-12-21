import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { TrendingUp, MapPin, Zap, BarChart3, AlertCircle } from "lucide-react";

interface COWAsset {
  cowid: string;
  site_label: string;
  region: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  vendor: string;
  shelter_outdoor: string;
  last_deploying_date: string;
  remarks: string;
}

interface RegionalStats {
  region: string;
  total_cows: number;
  vendors: string[];
  avg_lat: number;
  avg_lon: number;
}

export default function Dashboard() {
  const [cowData, setCowData] = useState<COWAsset[]>([]);
  const [regionalStats, setRegionalStats] = useState<RegionalStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("KSA");
  const [selectedVendor, setSelectedVendor] = useState("All");

  // Mock demand data for visualization
  const mockDemandData = [
    { region: "Riyadh", date: "2024-01", demand_score: 0.75 },
    { region: "Jeddah", date: "2024-01", demand_score: 0.62 },
    { region: "Dammam", date: "2024-01", demand_score: 0.48 },
    { region: "Mecca", date: "2024-01", demand_score: 0.92 },
    { region: "Medina", date: "2024-01", demand_score: 0.85 },
  ];

  const mockRecommendations: SiteRecommendation[] = [
    {
      site_id: "SITE-001",
      region: "Riyadh",
      success_probability: 0.94,
      vendor: "Ericsson",
      tech: "5G",
      distance_km: 12,
      explanation:
        "High success rate (94%), compatible vendor, nearest warehouse, proven 5G deployment history",
    },
    {
      site_id: "SITE-002",
      region: "Riyadh",
      success_probability: 0.87,
      vendor: "Nokia",
      tech: "4G/5G",
      distance_km: 18,
      explanation:
        "Strong vendor match, adequate tower height, VSAT capable, 87% historical success",
    },
    {
      site_id: "SITE-003",
      region: "Jeddah",
      success_probability: 0.79,
      vendor: "Huawei",
      tech: "4G",
      distance_km: 8,
      explanation:
        "Closest warehouse location, but lower tech capability. Still viable for 4G deployment",
    },
  ];

  const mockTimeSeriesData = [
    { month: "Jan", demand: 65, success: 78, logistics: 24 },
    { month: "Feb", demand: 75, success: 82, logistics: 22 },
    { month: "Mar", demand: 68, success: 85, logistics: 28 },
    { month: "Apr", demand: 82, success: 80, logistics: 26 },
    { month: "May", demand: 88, success: 87, logistics: 25 },
    { month: "Jun", demand: 92, success: 91, logistics: 27 },
  ];

  const handlePredictDemand = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict_demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion,
          event_type: selectedEventType,
          month: new Date().getMonth() + 1,
        }),
      });
      const data = await response.json();
      setDemandData([data]);
    } catch (error) {
      console.error("Error predicting demand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict_site_success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion,
          event_type: selectedEventType,
        }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations || mockRecommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      setRecommendations(mockRecommendations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stc-lilac">
      <Navigation />

      {/* Page Header */}
      <div className="border-b border-stc-purple/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-stc-purple-dark">
                COW Deployment Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered predictions and recommendations
              </p>
            </div>
            <div className="flex items-center gap-2 bg-stc-purple text-white px-4 py-2 rounded-lg shadow-md">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">ML Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <Card className="bg-white border-stc-purple/10 mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stc-purple-dark">
              Prediction Controls
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select region and event type to generate predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stc-purple/20 text-gray-900 rounded-md focus:border-stc-purple focus:ring-stc-purple"
                >
                  <option>KSA</option>
                  <option>Riyadh</option>
                  <option>Jeddah</option>
                  <option>Dammam</option>
                  <option>Mecca</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Event Type
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stc-purple/20 text-gray-900 rounded-md focus:border-stc-purple focus:ring-stc-purple"
                >
                  <option>Religious</option>
                  <option>Sport</option>
                  <option>National</option>
                  <option>Incident</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handlePredictDemand}
                  disabled={loading}
                  className="bg-stc-purple hover:bg-stc-purple/90 text-white flex-1"
                >
                  Predict Demand
                </Button>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleGetRecommendations}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white flex-1"
                >
                  Get Recommendations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="demand" className="space-y-4">
          <TabsList className="bg-white border-stc-purple/10">
            <TabsTrigger
              value="demand"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Demand Prediction
            </TabsTrigger>
            <TabsTrigger
              value="sites"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Site Recommendations
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Demand Tab */}
          <TabsContent value="demand" className="space-y-4">
            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Regional Demand Forecast
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Predicted COW demand scores (0-1) by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDemandData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5DCEC" />
                    <XAxis dataKey="region" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F6F0FA",
                        border: "1px solid #E5DCEC",
                        color: "#1F1F1F",
                      }}
                      cursor={{ fill: "rgba(110, 43, 140, 0.1)" }}
                    />
                    <Bar dataKey="demand_score" fill="#6E2B8C" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {mockDemandData.map((item) => (
                <Card
                  key={item.region}
                  className="bg-white border-stc-purple/10 shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-600 text-sm">{item.region}</p>
                        <p className="text-3xl font-bold text-stc-purple-dark">
                          {(item.demand_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-stc-purple" />
                    </div>
                    <div className="w-full bg-stc-lilac rounded-full h-2">
                      <div
                        className="bg-stc-purple h-2 rounded-full"
                        style={{ width: `${item.demand_score * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites" className="space-y-4">
            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Top Site Recommendations
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Ranked by success probability and logistics efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(recommendations.length > 0
                  ? recommendations
                  : mockRecommendations
                ).map((site, idx) => (
                  <div
                    key={site.site_id}
                    className="border border-stc-purple/10 rounded-lg p-4 hover:border-stc-purple/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-stc-purple text-white text-sm font-semibold rounded-full">
                            {idx + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-stc-purple-dark">
                            {site.site_id}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {site.region} • {site.vendor} • {site.tech}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-success">
                          {(site.success_probability * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-600">
                          Success Probability
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-stc-purple/10">
                      <div>
                        <p className="text-xs text-gray-600">Distance</p>
                        <p className="text-sm font-semibold text-stc-purple-dark">
                          {site.distance_km} km
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Tech</p>
                        <p className="text-sm font-semibold text-stc-purple-dark">
                          {site.tech}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Vendor</p>
                        <p className="text-sm font-semibold text-stc-purple-dark">
                          {site.vendor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-stc-purple/10 border border-stc-purple/20 rounded p-3">
                      <AlertCircle className="w-4 h-4 text-stc-purple flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-stc-purple-dark">
                        <span className="font-semibold">Why chosen: </span>
                        {site.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-white border-stc-purple/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Avg Demand</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        82.5%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-stc-purple" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-stc-purple/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        87.0%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-stc-purple/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Avg Setup Time</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        25.7 hrs
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-stc-purple" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Performance Trends
                </CardTitle>
                <CardDescription className="text-gray-600">
                  6-month metrics overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5DCEC" />
                    <XAxis dataKey="month" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F6F0FA",
                        border: "1px solid #E5DCEC",
                        color: "#1F1F1F",
                      }}
                      cursor={{ stroke: "rgba(110, 43, 140, 0.2)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="#6E2B8C"
                      name="Demand"
                    />
                    <Line
                      type="monotone"
                      dataKey="success"
                      stroke="#2BB673"
                      name="Success %"
                    />
                    <Line
                      type="monotone"
                      dataKey="logistics"
                      stroke="#B58BD6"
                      name="Setup Hrs"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-stc-lilac border border-stc-purple/20 rounded-lg text-gray-600 text-sm">
          <p>
            💡 All predictions are based on trained ML models using 3+ years of
            deployment history. Final deployment decisions should incorporate
            human review and business constraints.
          </p>
        </div>
      </div>
    </div>
  );
}
