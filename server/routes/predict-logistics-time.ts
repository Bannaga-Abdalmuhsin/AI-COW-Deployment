import { RequestHandler } from "express";

export interface PredictLogisticsTimeRequest {
  warehouse_id: string;
  site_id: string;
  distance_km?: number;
  region?: string;
  tower_height?: number;
  vsat?: boolean;
}

export interface PredictLogisticsTimeResponse {
  warehouse_id: string;
  site_id: string;
  predicted_time_hours: number;
  risk_level: "low" | "medium" | "high";
  confidence: number;
  breakdown: {
    transport_hours: number;
    setup_hours: number;
    contingency_hours: number;
  };
  explanation: string;
}

export const handlePredictLogisticsTime: RequestHandler = (req, res) => {
  const { warehouse_id, site_id, distance_km = 20, region = "KSA", tower_height = 40, vsat = false } = req.body as PredictLogisticsTimeRequest;

  if (!warehouse_id || !site_id) {
    return res.status(400).json({
      error: "warehouse_id and site_id are required",
    });
  }

  // Calculate base transport time (assumes ~40 km/h average)
  const transportHours = Math.ceil(distance_km / 40);

  // Setup time based on tower height and VSAT
  let setupHours = 8; // Base setup time
  setupHours += (tower_height - 30) / 10; // Additional time for taller towers
  if (vsat) {
    setupHours += 4; // Additional VSAT setup time
  }

  // Contingency based on risk factors
  let contingencyHours = 4;
  if (distance_km > 100) {
    contingencyHours += 6; // Long distance risk
  }
  if (vsat) {
    contingencyHours += 3; // VSAT complexity
  }

  const totalHours = transportHours + setupHours + contingencyHours;

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (totalHours > 35) {
    riskLevel = "high";
  } else if (totalHours > 25) {
    riskLevel = "medium";
  }

  const response: PredictLogisticsTimeResponse = {
    warehouse_id,
    site_id,
    predicted_time_hours: totalHours,
    risk_level: riskLevel,
    confidence: 0.82,
    breakdown: {
      transport_hours: transportHours,
      setup_hours: Math.round(setupHours),
      contingency_hours: Math.round(contingencyHours),
    },
    explanation: `Estimated deployment time of ${totalHours} hours from ${warehouse_id} to ${site_id}. 
      Transport: ${transportHours}h, Setup: ${Math.round(setupHours)}h, Contingency: ${Math.round(contingencyHours)}h. 
      ${vsat ? "VSAT configuration adds complexity. " : ""}
      ${riskLevel === "high" ? "High risk due to distance and complexity factors." : "Risk factors are acceptable."}`,
  };

  res.json(response);
};
