import { RequestHandler } from "express";

export interface PredictSiteSuccessRequest {
  region: string;
  event_type: string;
  site_id?: string;
}

export interface SiteRecommendation {
  site_id: string;
  region: string;
  success_probability: number;
  vendor: string;
  tech: string;
  distance_km: number;
  explanation: string;
}

export interface PredictSiteSuccessResponse {
  recommendations: SiteRecommendation[];
  top_score: number;
  model_version: string;
}

export const handlePredictSiteSuccess: RequestHandler = (req, res) => {
  const { region, event_type } = req.body as PredictSiteSuccessRequest;

  if (!region || !event_type) {
    return res.status(400).json({
      error: "region and event_type are required",
    });
  }

  // Mock site database
  const mockSites: Record<string, SiteRecommendation[]> = {
    "Riyadh": [
      {
        site_id: "SITE-RYD-001",
        region: "Riyadh",
        success_probability: 0.94,
        vendor: "Ericsson",
        tech: "5G",
        distance_km: 12,
        explanation:
          "High success rate (94%), compatible vendor, nearest warehouse, proven 5G deployment history",
      },
      {
        site_id: "SITE-RYD-002",
        region: "Riyadh",
        success_probability: 0.87,
        vendor: "Nokia",
        tech: "4G/5G",
        distance_km: 18,
        explanation:
          "Strong vendor match, adequate tower height, VSAT capable, 87% historical success",
      },
      {
        site_id: "SITE-RYD-003",
        region: "Riyadh",
        success_probability: 0.79,
        vendor: "Huawei",
        tech: "4G",
        distance_km: 8,
        explanation:
          "Closest warehouse location, but lower tech capability. Still viable for 4G deployment",
      },
    ],
    "Jeddah": [
      {
        site_id: "SITE-JED-001",
        region: "Jeddah",
        success_probability: 0.91,
        vendor: "Ericsson",
        tech: "5G",
        distance_km: 15,
        explanation:
          "Excellent success rate, nearby warehouse, full 5G capability, VSAT ready",
      },
      {
        site_id: "SITE-JED-002",
        region: "Jeddah",
        success_probability: 0.85,
        vendor: "Nokia",
        tech: "4G/5G",
        distance_km: 22,
        explanation:
          "Reliable vendor, adequate distance from warehouse, good tower specifications",
      },
    ],
    "Dammam": [
      {
        site_id: "SITE-DAM-001",
        region: "Dammam",
        success_probability: 0.88,
        vendor: "Huawei",
        tech: "5G",
        distance_km: 10,
        explanation:
          "Very close to warehouse, modern 5G infrastructure, proven in industrial zones",
      },
    ],
    "Mecca": [
      {
        site_id: "SITE-MEC-001",
        region: "Mecca",
        success_probability: 0.96,
        vendor: "Ericsson",
        tech: "5G",
        distance_km: 20,
        explanation:
          "Premium location for religious events, highest success probability, full infrastructure support",
      },
    ],
    "Medina": [
      {
        site_id: "SITE-MED-001",
        region: "Medina",
        success_probability: 0.93,
        vendor: "Nokia",
        tech: "4G/5G",
        distance_km: 16,
        explanation:
          "High reliability, experienced with large event deployments, strong logistics",
      },
    ],
  };

  const recommendations = mockSites[region] || mockSites["Riyadh"];

  // Add some randomization to success probability based on event type
  const eventMultiplier: Record<string, number> = {
    Religious: 1.0,
    Sport: 0.95,
    National: 0.92,
    Incident: 0.85,
  };

  const multiplier = eventMultiplier[event_type] || 0.90;

  const adjustedRecommendations = recommendations
    .map((site) => ({
      ...site,
      success_probability: Math.min(1, site.success_probability * multiplier),
    }))
    .sort((a, b) => b.success_probability - a.success_probability);

  const response: PredictSiteSuccessResponse = {
    recommendations: adjustedRecommendations,
    top_score: adjustedRecommendations[0]?.success_probability || 0,
    model_version: "v1.2.0",
  };

  res.json(response);
};
