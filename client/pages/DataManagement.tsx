import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";

const datasetTypes = [
  {
    name: "Events",
    description: "Religious / Sport / National / Incident events",
    columns: [
      "event_id",
      "event_type",
      "region",
      "start_date",
      "end_date",
      "importance",
      "attendance_est",
    ],
  },
  {
    name: "Deployment History",
    description: "3-year historical deployment records (TRAINS ML)",
    columns: [
      "deployment_id",
      "event_id",
      "site_id",
      "cow_id",
      "warehouse_id",
      "tech",
      "tower_height",
      "vsat",
      "success",
      "issues",
    ],
  },
  {
    name: "Site Master",
    description: "Site infrastructure details and capabilities",
    columns: [
      "site_id",
      "vendor",
      "region",
      "lat",
      "lon",
      "supported_tech",
      "max_height",
      "vsat_capable",
    ],
  },
  {
    name: "Warehouse (ACES)",
    description: "COW inventory and warehouse locations",
    columns: ["warehouse_id", "region", "lat", "lon", "cow_inventory"],
  },
  {
    name: "COW Assets",
    description: "Cell on Wheels technical specifications",
    columns: ["cow_id", "tech_capability", "max_height", "vsat", "status"],
  },
];

export default function DataManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Data Management
                </h1>
                <p className="text-slate-400 mt-1">
                  Upload and manage your deployment data
                </p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-slate-700"></div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200"
                alt="STC"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Guide */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Data Upload Requirements
            </CardTitle>
            <CardDescription className="text-slate-400">
              Prepare your 5 clean data tables in Excel or CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-100 text-sm">
                ⚠️ <span className="font-semibold">Important:</span> Deployment
                History table is essential for training ML models. The more
                historical data you provide (3+ years recommended), the better
                the predictions.
              </p>
            </div>
            <p className="text-slate-300 mb-4">
              Each dataset should include the following columns:
            </p>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasetTypes.map((dataset) => (
            <Card
              key={dataset.name}
              className="bg-slate-800/50 border-slate-700 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-white text-lg">
                    {dataset.name}
                  </CardTitle>
                  <Database className="w-5 h-5 text-blue-400 flex-shrink-0" />
                </div>
                <CardDescription className="text-slate-400">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold text-slate-300 mb-2 uppercase">
                    Columns
                  </p>
                  <ul className="space-y-1">
                    {dataset.columns.map((col) => (
                      <li
                        key={col}
                        className="text-xs text-slate-400 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                        {col}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Upload {dataset.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Training Guide */}
        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">ML Model Training</CardTitle>
            <CardDescription className="text-slate-400">
              After uploading all datasets, trigger the training workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-white mb-1">
                  Step 1: Data Validation
                </h4>
                <p className="text-slate-400 text-sm">
                  System validates all uploaded tables for completeness and
                  consistency
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-white mb-1">
                  Step 2: Model Training
                </h4>
                <p className="text-slate-400 text-sm">
                  70% training / 15% validation / 15% testing split. Trains 3
                  models: demand prediction, site success, logistics time
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-white mb-1">
                  Step 3: Model Deployment
                </h4>
                <p className="text-slate-400 text-sm">
                  Models deployed as APIs and integrated into the dashboard.
                  Runs automatically monthly or on-demand
                </p>
              </div>
            </div>
            <Button
              className="mt-6 bg-green-500 hover:bg-green-600 text-white w-full"
              disabled
            >
              Start Training (Upload data first)
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-slate-800/30 border border-slate-700 rounded-lg">
          <h3 className="text-white font-semibold mb-3">Need Sample Data?</h3>
          <p className="text-slate-300 text-sm mb-4">
            Download our template Excel files to get started with the correct
            column structure.
          </p>
          <Button
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            Download Templates
          </Button>
        </div>
      </div>
    </div>
  );
}
