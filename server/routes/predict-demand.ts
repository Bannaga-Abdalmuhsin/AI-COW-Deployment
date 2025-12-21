import { RequestHandler } from "express";

export interface PredictDemandRequest {
  region: string;
  event_type: string;
  month?: number;
}

export interface PredictDemandResponse {
  region: string;
  date: string;
  demand_score: number;
  confidence: number;
  explanation: string;
}

export const handlePredictDemand: RequestHandler = (req, res) => {
  const { region, event_type, month } = req.body as PredictDemandRequest;

  if (!region || !event_type) {
    return res.status(400).json({
      error: "region and event_type are required",
    });
  }

  // Placeholder ML model - in production, this would call actual ML backend
  const baseScores: Record<string, number> = {
    Religious: 0.85,
    Sport: 0.75,
    National: 0.70,
    Incident: 0.90,
  };

  const regionMultipliers: Record<string, number> = {
    "KSA": 0.9,
    "Riyadh": 0.95,
    "Jeddah": 0.85,
    "Dammam": 0.75,
    "Mecca": 0.99,
    "Medina": 0.95,
  };

  const baseScore = baseScores[event_type] || 0.70;
  const multiplier = regionMultipliers[region] || 0.80;
  
  // Add seasonal variation (month-based)
  const currentMonth = month || new Date().getMonth() + 1;
  const seasonalFactor = 0.9 + (Math.sin((currentMonth / 6) * Math.PI) * 0.15);
  
  const demandScore = Math.min(1, baseScore * multiplier * seasonalFactor);

  const response: PredictDemandResponse = {
    region,
    date: new Date().toISOString().split("T")[0],
    demand_score: Math.round(demandScore * 100) / 100,
    confidence: Math.round((0.80 + Math.random() * 0.15) * 100) / 100,
    explanation: `High demand predicted for ${event_type} events in ${region}. Seasonal factors and historical trends indicate ${(demandScore * 100).toFixed(0)}% likelihood of COW deployment need.`,
  };

  res.json(response);
};
