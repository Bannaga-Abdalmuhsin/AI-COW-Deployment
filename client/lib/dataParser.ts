export interface ParsedCOWAsset {
  cowid: string;
  site_label: string;
  region: string;
  district: string;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  last_deploying_date: string;
  vendor: string;
  shelter_outdoor: string;
  remarks: string;
}

export interface ParsedMovement {
  movement_id: string;
  cowid: string;
  site_label: string;
  region: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  vendor: string;
  tech_used: string;
  tower_height: number;
  vsat: boolean;
  warehouse_id: string;
  deploy_start_date: string;
  deploy_end_date: string;
  success_flag: 0 | 1;
  issue_type: string;
  remarks: string;
}

export interface DataImportResult {
  cowAssets: ParsedCOWAsset[];
  movements: ParsedMovement[];
  errors: string[];
  warnings: string[];
}

export class DataParser {
  static parseCOWMasterFromCSV(csvContent: string): ParsedCOWAsset[] {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file is empty or contains only headers");
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const assets: ParsedCOWAsset[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const rowData: Record<string, string> = {};

      headers.forEach((header, idx) => {
        rowData[header] = values[idx] || "";
      });

      try {
        const asset = this.validateCOWAsset(rowData, i + 1);
        assets.push(asset);
      } catch (error) {
        errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return assets;
  }

  static parseMovementArchiveFromCSV(csvContent: string): ParsedMovement[] {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file is empty or contains only headers");
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const movements: ParsedMovement[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const rowData: Record<string, string> = {};

      headers.forEach((header, idx) => {
        rowData[header] = values[idx] || "";
      });

      try {
        const movement = this.validateMovement(rowData, i + 1);
        movements.push(movement);
      } catch (error) {
        errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return movements;
  }

  private static validateCOWAsset(
    data: Record<string, string>,
    rowNumber: number,
  ): ParsedCOWAsset {
    const required = ["cowid", "site_label", "region", "vendor"];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const latitude = parseFloat(data["latitude"] || "0");
    const longitude = parseFloat(data["longitude"] || "0");

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Invalid latitude/longitude values");
    }

    if (!data["last_deploying_date"]) {
      throw new Error("Missing last_deploying_date");
    }

    return {
      cowid: data["cowid"],
      site_label: data["site_label"],
      region: data["region"],
      district: data["district"] || "",
      city: data["city"] || "",
      location: data["location"] || "",
      latitude,
      longitude,
      last_deploying_date: data["last_deploying_date"],
      vendor: data["vendor"],
      shelter_outdoor: data["shelter_outdoor"] || "Outdoor",
      remarks: data["remarks"] || "",
    };
  }

  private static validateMovement(
    data: Record<string, string>,
    rowNumber: number,
  ): ParsedMovement {
    const required = [
      "movement_id",
      "cowid",
      "region",
      "deploy_start_date",
      "success_flag",
    ];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const latitude = parseFloat(data["latitude"] || "0");
    const longitude = parseFloat(data["longitude"] || "0");
    const tower_height = parseFloat(data["tower_height"] || "0");
    const success_flag = parseInt(data["success_flag"]) as 0 | 1;

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Invalid latitude/longitude values");
    }

    if (![0, 1].includes(success_flag)) {
      throw new Error("success_flag must be 0 or 1");
    }

    return {
      movement_id: data["movement_id"],
      cowid: data["cowid"],
      site_label: data["site_label"] || "",
      region: data["region"],
      district: data["district"] || "",
      city: data["city"] || "",
      latitude,
      longitude,
      vendor: data["vendor"] || "",
      tech_used: data["tech_used"] || "",
      tower_height,
      vsat: data["vsat"]?.toLowerCase() === "yes" || data["vsat"] === "1",
      warehouse_id: data["warehouse_id"] || "",
      deploy_start_date: data["deploy_start_date"],
      deploy_end_date: data["deploy_end_date"] || "",
      success_flag,
      issue_type: data["issue_type"] || "",
      remarks: data["remarks"] || "",
    };
  }

  static validateDataStructure(file: File): {
    isValid: boolean;
    error?: string;
    sheetName?: string;
  } {
    const validSheets = [
      "COW Master",
      "COW Master & Distribution",
      "Movement Archive",
    ];
    const fileName = file.name.toLowerCase();

    if (file.type.includes("spreadsheet") || fileName.endsWith(".xlsx")) {
      return {
        isValid: true,
        sheetName: "Requires manual sheet selection",
      };
    }

    if (file.type === "text/csv" || fileName.endsWith(".csv")) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: "Please upload CSV or Excel (.xlsx) files only",
    };
  }
}
