import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Upload, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { DataParser } from "@/lib/dataParser";
import { DataStoreManager } from "@/lib/dataStore";
import { SAMPLE_COW_ASSETS, SAMPLE_MOVEMENTS } from "@/lib/sampleData";

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
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
    dataType?: string;
  }>({ type: null, message: "" });
  const [cowAssetsCount, setCowAssetsCount] = useState(0);
  const [movementsCount, setMovementsCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadDataFromStore = () => {
    const assets = DataStoreManager.getCOWAssets();
    const movements = DataStoreManager.getMovements();
    const updated = DataStoreManager.getLastUpdated();

    setCowAssetsCount(assets.length);
    setMovementsCount(movements.length);
    setLastUpdated(updated);
  };

  const handleLoadSampleData = async () => {
    setUploadStatus({ type: "loading", message: "Loading sample data..." });

    try {
      DataStoreManager.importCOWAssets(SAMPLE_COW_ASSETS, "sample");
      DataStoreManager.importMovements(SAMPLE_MOVEMENTS, "sample");

      setCowAssetsCount(SAMPLE_COW_ASSETS.length);
      setMovementsCount(SAMPLE_MOVEMENTS.length);
      setLastUpdated(new Date().toISOString());

      setUploadStatus({
        type: "success",
        message: `Sample data loaded: ${SAMPLE_COW_ASSETS.length} COW assets and ${SAMPLE_MOVEMENTS.length} movement records`,
      });

      setTimeout(() => setUploadStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setUploadStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to load sample data",
      });
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    dataType: "cow" | "movement",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus({
      type: "loading",
      message: `Processing ${dataType} file...`,
    });

    try {
      const text = await file.text();

      if (dataType === "cow") {
        const assets = DataParser.parseCOWMasterFromCSV(text);
        DataStoreManager.importCOWAssets(assets, "uploaded");
        setCowAssetsCount(assets.length);

        setUploadStatus({
          type: "success",
          message: `COW Master: ${assets.length} assets uploaded successfully`,
          dataType: "cow",
        });
      } else {
        const movements = DataParser.parseMovementArchiveFromCSV(text);
        DataStoreManager.importMovements(movements, "uploaded");
        setMovementsCount(movements.length);

        setUploadStatus({
          type: "success",
          message: `Movement Archive: ${movements.length} records uploaded successfully`,
          dataType: "movement",
        });
      }

      setLastUpdated(new Date().toISOString());
      setTimeout(() => setUploadStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setUploadStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to process file",
        dataType,
      });
    }
  };

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
              Upload your current COW asset distribution from Google Sheets in
              CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-stc-purple/10 border border-stc-purple/20 rounded-lg p-4 mb-6">
              <p className="text-stc-purple-dark text-sm">
                ⚠️ <span className="font-semibold">Important:</span> The COW
                Master sheet is required to display current asset distribution.
                Movement Archive with historical deployments can be added later
                to enable ML model training.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Each dataset should include the following columns:
            </p>
          </CardContent>
        </Card>

        {/* Upload Status */}
        {uploadStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              uploadStatus.type === "success"
                ? "bg-success/10 border-success/20 text-success"
                : uploadStatus.type === "error"
                  ? "bg-red-100/10 border-red-200/20 text-red-600"
                  : "bg-blue-100/10 border-blue-200/20 text-blue-600"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : uploadStatus.type === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{uploadStatus.message}</p>
          </div>
        )}

        {/* Data Summary */}
        {(cowAssetsCount > 0 || movementsCount > 0) && (
          <Card className="bg-white border-stc-purple/10 mb-8 shadow-sm">
            <CardHeader>
              <CardTitle className="text-stc-purple-dark">
                Data Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">COW Assets</p>
                    <p className="text-2xl font-bold text-stc-purple-dark">
                      {cowAssetsCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Movement Records</p>
                    <p className="text-2xl font-bold text-stc-purple-dark">
                      {movementsCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm font-semibold text-stc-purple-dark">
                      {lastUpdated
                        ? new Date(lastUpdated).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* COW Master Card */}
          <Card className="bg-white border-stc-purple/10 flex flex-col shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-stc-purple-dark text-lg">
                  {datasetTypes[0].name}
                </CardTitle>
                <Database className="w-5 h-5 text-stc-purple flex-shrink-0" />
              </div>
              <CardDescription className="text-gray-600">
                {datasetTypes[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <p className="text-xs font-semibold text-stc-purple-dark mb-2 uppercase">
                  Columns
                </p>
                <ul className="space-y-1">
                  {datasetTypes[0].columns.map((col) => (
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
              <div className="space-y-2">
                <label className="block">
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => handleFileUpload(e, "cow")}
                    className="hidden"
                    id="cow-upload"
                  />
                  <Button
                    asChild
                    className="w-full bg-stc-purple hover:bg-stc-purple/90 text-white cursor-pointer"
                  >
                    <label htmlFor="cow-upload" className="cursor-pointer">
                      Upload {datasetTypes[0].name}
                    </label>
                  </Button>
                </label>
                <Button
                  onClick={handleLoadSampleData}
                  variant="outline"
                  className="w-full border-stc-purple text-stc-purple hover:bg-stc-purple/10"
                >
                  Load Sample Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Movement Archive Card */}
          <Card className="bg-white border-stc-purple/10 flex flex-col shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-stc-purple-dark text-lg">
                  {datasetTypes[1].name}
                </CardTitle>
                <Database className="w-5 h-5 text-stc-purple flex-shrink-0" />
              </div>
              <CardDescription className="text-gray-600">
                {datasetTypes[1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <p className="text-xs font-semibold text-stc-purple-dark mb-2 uppercase">
                  Columns
                </p>
                <ul className="space-y-1">
                  {datasetTypes[1].columns.map((col) => (
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
              <label className="block">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => handleFileUpload(e, "movement")}
                  className="hidden"
                  id="movement-upload"
                />
                <Button
                  asChild
                  className="w-full bg-stc-purple hover:bg-stc-purple/90 text-white cursor-pointer"
                >
                  <label htmlFor="movement-upload" className="cursor-pointer">
                    Upload {datasetTypes[1].name}
                  </label>
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Future ML Training Guide */}
        <Card className="bg-white border-stc-purple/10 mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-stc-purple-dark">
              ML Model Training (Future)
            </CardTitle>
            <CardDescription className="text-gray-600">
              Upload Movement Archive historical data to enable ML model
              training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-stc-purple pl-4">
                <h4 className="font-semibold text-stc-purple-dark mb-1">
                  Step 1: Upload Movement Archive
                </h4>
                <p className="text-gray-600 text-sm">
                  Historical deployment records with success flags, dates, and
                  technical specifications
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
