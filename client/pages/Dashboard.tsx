import { useState, useEffect } from "react";
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
import { DataStoreManager } from "@/lib/dataStore";
import { SAMPLE_COW_ASSETS } from "@/lib/sampleData";

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
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("KSA");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from store on component mount
  useEffect(() => {
    const loadStoredData = () => {
      const storedAssets = DataStoreManager.getCOWAssets();

      if (storedAssets.length > 0) {
        setCowData(storedAssets);
        setDataLoaded(true);
      } else {
        // Use sample data if no data is stored
        setCowData(SAMPLE_COW_ASSETS as unknown as COWAsset[]);
        setDataLoaded(false);
      }

      setLoading(false);
    };

    loadStoredData();
  }, []);

  // Sample COW distribution data (fallback)
  const mockCOWData: COWAsset[] = SAMPLE_COW_ASSETS as unknown as COWAsset[] || [
    {
      cowid: "COW001",
      site_label: "Riyadh Central",
      region: "Riyadh",
      district: "Central",
      city: "Riyadh",
      latitude: 24.7136,
      longitude: 46.6753,
      vendor: "Ericsson",
      shelter_outdoor: "Outdoor",
      last_deploying_date: "2024-01-15",
      remarks: "Active, excellent signal",
    },
    {
      cowid: "COW002",
      site_label: "Jeddah North",
      region: "Jeddah",
      district: "North",
      city: "Jeddah",
      latitude: 21.5921,
      longitude: 39.1721,
      vendor: "Nokia",
      shelter_outdoor: "Shelter",
      last_deploying_date: "2024-01-10",
      remarks: "Under maintenance",
    },
    {
      cowid: "COW003",
      site_label: "Dammam East",
      region: "Dammam",
      district: "East",
      city: "Dammam",
      latitude: 26.3954,
      longitude: 50.1957,
      vendor: "Huawei",
      shelter_outdoor: "Outdoor",
      last_deploying_date: "2024-01-20",
      remarks: "Ready for deployment",
    },
    {
      cowid: "COW004",
      site_label: "Riyadh South",
      region: "Riyadh",
      district: "South",
      city: "Riyadh",
      latitude: 24.6282,
      longitude: 46.7104,
      vendor: "Ericsson",
      shelter_outdoor: "Shelter",
      last_deploying_date: "2024-01-18",
      remarks: "Active deployment",
    },
    {
      cowid: "COW005",
      site_label: "Mecca Al Haram",
      region: "Mecca",
      district: "Central",
      city: "Mecca",
      latitude: 21.4225,
      longitude: 39.8262,
      vendor: "Nokia",
      shelter_outdoor: "Outdoor",
      last_deploying_date: "2024-01-12",
      remarks: "Recent event deployment",
    },
  ];

  // Calculate regional statistics
  const calculateRegionalStats = (data: COWAsset[]): RegionalStats[] => {
    const regions = new Map<string, COWAsset[]>();
    data.forEach((cow) => {
      if (!regions.has(cow.region)) {
        regions.set(cow.region, []);
      }
      regions.get(cow.region)!.push(cow);
    });

    return Array.from(regions.entries()).map(([region, cows]) => ({
      region,
      total_cows: cows.length,
      vendors: [...new Set(cows.map((c) => c.vendor))],
      avg_lat: cows.reduce((sum, c) => sum + c.latitude, 0) / cows.length,
      avg_lon: cows.reduce((sum, c) => sum + c.longitude, 0) / cows.length,
    }));
  };

  const displayData = cowData.length > 0 ? cowData : mockCOWData;

  const filteredCOWData = displayData.filter((cow) => {
    const regionMatch =
      selectedRegion === "KSA" || cow.region === selectedRegion;
    const vendorMatch =
      selectedVendor === "All" || cow.vendor === selectedVendor;
    return regionMatch && vendorMatch;
  });

  const uniqueVendors = [...new Set(displayData.map((cow) => cow.vendor))];

  const handleLoadData = async () => {
    setLoading(true);
    try {
      setRegionalStats(calculateRegionalStats(displayData));
    } catch (error) {
      console.error("Error loading COW data:", error);
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
                COW Asset Distribution
              </h1>
              <p className="text-gray-600 mt-1">
                Current asset locations and regional inventory
              </p>
            </div>
            <div className="flex items-center gap-2 bg-stc-purple text-white px-4 py-2 rounded-lg shadow-md">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Live Distribution</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Panel */}
        <Card className="bg-white border-stc-purple/10 mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stc-purple-dark">
              Filter & View COW Distribution
            </CardTitle>
            <CardDescription className="text-gray-600">
              Filter assets by region and vendor to analyze current distribution
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
                  <option value="KSA">All Regions (KSA)</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="Dammam">Dammam</option>
                  <option value="Mecca">Mecca</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stc-purple/20 text-gray-900 rounded-md focus:border-stc-purple focus:ring-stc-purple"
                >
                  <option value="All">All Vendors</option>
                  {uniqueVendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleLoadData}
                  disabled={loading}
                  className="bg-stc-purple hover:bg-stc-purple/90 text-white flex-1"
                >
                  Load Data
                </Button>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  className="border-stc-purple text-stc-purple hover:bg-stc-purple/10 flex-1"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="distribution" className="space-y-4">
          <TabsList className="bg-white border-stc-purple/10">
            <TabsTrigger
              value="distribution"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Current Distribution
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Inventory by Region
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-gray-600 data-[state=active]:text-stc-purple"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-4">
            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Current COW Distribution
                </CardTitle>
                <CardDescription className="text-gray-600">
                  All active COW assets and their current locations (
                  {filteredCOWData.length} assets)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredCOWData.length > 0 ? (
                  filteredCOWData.map((cow, idx) => (
                    <div
                      key={cow.cowid}
                      className="border border-stc-purple/10 rounded-lg p-4 hover:border-stc-purple/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-stc-purple text-white text-sm font-semibold rounded-full">
                              {idx + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-stc-purple-dark">
                              {cow.cowid}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {cow.site_label}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-semibold rounded px-2 py-1 ${
                              cow.shelter_outdoor === "Shelter"
                                ? "bg-stc-purple/20 text-stc-purple"
                                : "bg-success/20 text-success"
                            }`}
                          >
                            {cow.shelter_outdoor}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-b border-stc-purple/10">
                        <div>
                          <p className="text-xs text-gray-600">Region</p>
                          <p className="text-sm font-semibold text-stc-purple-dark">
                            {cow.region}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Vendor</p>
                          <p className="text-sm font-semibold text-stc-purple-dark">
                            {cow.vendor}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Coordinates</p>
                          <p className="text-sm font-semibold text-stc-purple-dark">
                            {cow.latitude.toFixed(3)},{" "}
                            {cow.longitude.toFixed(3)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Last Deploy</p>
                          <p className="text-sm font-semibold text-stc-purple-dark">
                            {new Date(
                              cow.last_deploying_date,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-stc-purple/10 border border-stc-purple/20 rounded p-3">
                        <AlertCircle className="w-4 h-4 text-stc-purple flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-stc-purple-dark">
                          <span className="font-semibold">Status: </span>
                          {cow.remarks}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>No COW assets found with selected filters.</p>
                    <p className="text-sm">
                      Try adjusting your region or vendor filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {calculateRegionalStats(filteredCOWData).map((stat) => (
                <Card
                  key={stat.region}
                  className="bg-white border-stc-purple/10 shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.region}</p>
                        <p className="text-3xl font-bold text-stc-purple-dark">
                          {stat.total_cows}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">COW Assets</p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-stc-purple" />
                    </div>
                    <div className="pt-3 border-t border-stc-purple/10">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Vendors
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {stat.vendors.map((vendor) => (
                          <span
                            key={vendor}
                            className="inline-block bg-stc-purple/20 text-stc-purple text-xs px-2 py-1 rounded"
                          >
                            {vendor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Regional Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600">
                  COW asset distribution by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={calculateRegionalStats(filteredCOWData)}>
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
                    <Bar dataKey="total_cows" fill="#6E2B8C" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-white border-stc-purple/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total COW Assets</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        {filteredCOWData.length}
                      </p>
                    </div>
                    <MapPin className="w-8 h-8 text-stc-purple" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-stc-purple/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Unique Vendors</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        {
                          [...new Set(filteredCOWData.map((c) => c.vendor))]
                            .length
                        }
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
                      <p className="text-gray-600 text-sm">Active Regions</p>
                      <p className="text-3xl font-bold text-stc-purple-dark">
                        {calculateRegionalStats(filteredCOWData).length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Vendor Distribution
                </CardTitle>
                <CardDescription className="text-gray-600">
                  COW count by vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={uniqueVendors.map((vendor) => ({
                      name: vendor,
                      count: filteredCOWData.filter(
                        (cow) => cow.vendor === vendor,
                      ).length,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5DCEC" />
                    <XAxis dataKey="name" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F6F0FA",
                        border: "1px solid #E5DCEC",
                        color: "#1F1F1F",
                      }}
                      cursor={{ fill: "rgba(110, 43, 140, 0.1)" }}
                    />
                    <Bar dataKey="count" fill="#6E2B8C" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-stc-purple/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-stc-purple-dark">
                  Shelter Type Distribution
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Assets by deployment type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={["Shelter", "Outdoor"].map((type) => ({
                      type,
                      count: filteredCOWData.filter(
                        (cow) => cow.shelter_outdoor === type,
                      ).length,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5DCEC" />
                    <XAxis dataKey="type" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F6F0FA",
                        border: "1px solid #E5DCEC",
                        color: "#1F1F1F",
                      }}
                      cursor={{ fill: "rgba(110, 43, 140, 0.1)" }}
                    />
                    <Bar dataKey="count" fill="#6E2B8C" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-stc-lilac border border-stc-purple/20 rounded-lg text-gray-600 text-sm">
          <p>
            💡 This dashboard displays current COW asset distribution based on
            the COW Master sheet. Upload Movement Archive with historical data
            to enable ML predictions for demand forecasting and site success
            scoring.
          </p>
        </div>
      </div>
    </div>
  );
}
