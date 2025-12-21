import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Upload, Database } from "lucide-react";

const datasetTypes = [
  {
    name: "COW Master & Distribution",
    description: "Current COW asset locations and site assignments",
    columns: [
      "COWID",
      "Site label",
      "Region",
      "District",
      "City",
      "Location",
      "Latitude",
      "Longitude",
      "Last Deploying Date",
      "Vendor",
      "Shelter/Outdoor",
      "Remarks",
    ],
  },
  {
    name: "Movement Archive",
    description: "Historical deployment records for each COW asset",
    columns: [
      "movement_id",
      "cowid",
      "site_label",
      "region",
      "district",
      "city",
      "latitude",
      "longitude",
      "vendor",
      "tech_used",
      "tower_height",
      "vsat",
      "warehouse_id",
      "deploy_start_date",
      "deploy_end_date",
      "success_flag",
      "issue_type",
      "remarks",
    ],
  },
];

export default function DataManagement() {
  return (
    <div className="min-h-screen bg-stc-lilac">
      <Navigation />

      {/* Page Header */}
      <div className="border-b border-stc-purple/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-stc-purple-dark">
              Data Management
            </h1>
            <p className="text-gray-600 mt-1">
              Upload and manage your deployment data
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Guide */}
        <Card className="bg-white border-stc-purple/10 mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stc-purple-dark flex items-center gap-2">
              <Upload className="w-5 h-5 text-stc-purple" />
              Current COW Distribution Upload
            </CardTitle>
            <CardDescription className="text-gray-600">
              Upload your current COW asset distribution from Google Sheets in CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-stc-purple/10 border border-stc-purple/20 rounded-lg p-4 mb-6">
              <p className="text-stc-purple-dark text-sm">
                ⚠️ <span className="font-semibold">Important:</span> The COW Master sheet
                is required to display current asset distribution. Movement Archive with
                historical deployments can be added later to enable ML model training.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Each dataset should include the following columns:
            </p>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasetTypes.map((dataset) => (
            <Card
              key={dataset.name}
              className="bg-white border-stc-purple/10 flex flex-col shadow-sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-stc-purple-dark text-lg">
                    {dataset.name}
                  </CardTitle>
                  <Database className="w-5 h-5 text-stc-purple flex-shrink-0" />
                </div>
                <CardDescription className="text-gray-600">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold text-stc-purple-dark mb-2 uppercase">
                    Columns
                  </p>
                  <ul className="space-y-1">
                    {dataset.columns.map((col) => (
                      <li
                        key={col}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-stc-purple rounded-full"></span>
                        {col}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-stc-purple hover:bg-stc-purple/90 text-white">
                  Upload {dataset.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Future ML Training Guide */}
        <Card className="bg-white border-stc-purple/10 mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stc-purple-dark">
              ML Model Training (Future)
            </CardTitle>
            <CardDescription className="text-gray-600">
              Upload Movement Archive historical data to enable ML model training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-stc-purple pl-4">
                <h4 className="font-semibold text-stc-purple-dark mb-1">
                  Step 1: Upload Movement Archive
                </h4>
                <p className="text-gray-600 text-sm">
                  Historical deployment records with success flags, dates, and technical specifications
                </p>
              </div>
              <div className="border-l-4 border-stc-purple pl-4">
                <h4 className="font-semibold text-stc-purple-dark mb-1">
                  Step 2: Model Training
                </h4>
                <p className="text-gray-600 text-sm">
                  70% training / 15% validation / 15% testing split. Trains 3
                  models: demand prediction, site success, logistics time
                </p>
              </div>
              <div className="border-l-4 border-stc-purple pl-4">
                <h4 className="font-semibold text-stc-purple-dark mb-1">
                  Step 3: Model Deployment
                </h4>
                <p className="text-gray-600 text-sm">
                  Models deployed as APIs and integrated into the dashboard.
                  Runs automatically monthly or on-demand
                </p>
              </div>
            </div>
            <Button
              className="mt-6 bg-stc-purple hover:bg-stc-purple/90 text-white w-full"
              disabled
            >
              Start Training (Upload Movement Archive first)
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-stc-lilac border border-stc-purple/20 rounded-lg">
          <h3 className="text-stc-purple-dark font-semibold mb-3">
            Need Sample Data?
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Download our template Excel files to get started with the correct
            column structure.
          </p>
          <Button
            variant="outline"
            className="border-stc-purple text-stc-purple hover:bg-stc-purple/10"
          >
            Download Templates
          </Button>
        </div>
      </div>
    </div>
  );
}
