import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handlePredictDemand } from "./routes/predict-demand";
import { handlePredictSiteSuccess } from "./routes/predict-site-success";
import { handlePredictLogisticsTime } from "./routes/predict-logistics-time";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ML Prediction API routes
  app.post("/api/predict_demand", handlePredictDemand);
  app.post("/api/predict_site_success", handlePredictSiteSuccess);
  app.post("/api/predict_logistics_time", handlePredictLogisticsTime);

  return app;
}
