#!/usr/bin/env python3
"""Train chronological COW movement models from the cumulative Excel tracker."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score, top_k_accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


REGION_MAP = {
    "CR": "Central",
    "CENTRAL": "Central",
    "ER": "East",
    "EAST": "East",
    "WR": "West",
    "WEST": "West",
    "SR": "South",
    "SOUTH": "South",
}

CATEGORICAL_FEATURES = [
    "current_region",
    "current_category",
    "movement_type",
    "vendor",
    "city_district",
]
NUMERIC_FEATURES = [
    "month",
    "quarter",
    "distance_km",
    "transit_hours",
    "movement_number",
    "days_since_previous",
]
FEATURES = CATEGORICAL_FEATURES + NUMERIC_FEATURES


def clean_text(value: object, fallback: str = "Unknown") -> str:
    if pd.isna(value):
        return fallback
    value = " ".join(str(value).strip().split())
    return fallback if not value or value.upper() in {"NA", "N/A", "NAN", "NONE"} else value


def normalize_region(value: object) -> str:
    text = clean_text(value).upper()
    return REGION_MAP.get(text, text.title() if text != "UNKNOWN" else "Unknown")


def normalize_movement_type(value: object) -> str:
    text = clean_text(value).upper()
    if "FULL" in text:
        return "Full"
    if "HALF" in text:
        return "Half"
    if "ZERO" in text or text == "0":
        return "Zero"
    return "Unknown"


def normalize_category(value: object, destination: object) -> str:
    text = clean_text(value).upper()
    destination_text = clean_text(destination, "").upper()
    if text == "WH" or "WAREHOUSE" in text or destination_text.endswith(" WH"):
        return "Warehouse"
    if text in {"EVENT", "ROYAL", "MEGA PROJECT"}:
        return text.title()
    return "Other" if text in {"UNKNOWN", "OTHER"} else text.title()


def load_tracker(path: Path) -> pd.DataFrame:
    raw = pd.read_excel(path, sheet_name="COW Movement tracker")
    raw.columns = [clean_text(c, "") for c in raw.columns]
    required = {
        "COWs ID",
        "Moved Date/Time",
        "Reached Date/Time",
        "From Location",
        "To Location",
        "Region from",
        "Region to",
    }
    missing = sorted(required - set(raw.columns))
    if missing:
        raise ValueError(f"Missing required tracker columns: {', '.join(missing)}")

    data = pd.DataFrame(
        {
            "source_row": np.arange(2, len(raw) + 2),
            "cow_id": raw["COWs ID"].map(clean_text),
            "moved_at": pd.to_datetime(raw["Moved Date/Time"], errors="coerce"),
            "reached_at": pd.to_datetime(raw["Reached Date/Time"], errors="coerce"),
            "from_location": raw["From Location"].map(clean_text),
            "from_latitude": pd.to_numeric(raw.get("From Latitude"), errors="coerce"),
            "from_longitude": pd.to_numeric(raw.get("From Longitude"), errors="coerce"),
            "to_location": raw["To Location"].map(clean_text),
            "to_sub_location": raw.get("sub location", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "to_latitude": pd.to_numeric(raw.get("To Latitude"), errors="coerce"),
            "to_longitude": pd.to_numeric(raw.get("To Longitude"), errors="coerce"),
            "category": [normalize_category(v, d) for v, d in zip(raw.get("Catogery"), raw["To Location"])],
            "event_name": raw.get("Event name", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "administrative_region": raw.get("Administrative Region", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "distance_km": pd.to_numeric(raw.get("Distance (KM)"), errors="coerce"),
            "movement_type": raw.get("Movement type", pd.Series(index=raw.index, dtype=object)).map(normalize_movement_type),
            "region_from": raw["Region from"].map(normalize_region),
            "region_to": raw["Region to"].map(normalize_region),
            "city_district": raw.get("City/District", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "vendor": raw.get("Vendor", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "priority": raw.get("Priority", pd.Series(index=raw.index, dtype=object)).map(clean_text),
            "status": raw.get("Status/Exclusion Remarks", pd.Series(index=raw.index, dtype=object)).map(clean_text),
        }
    )

    # Covers the operational naming families in the tracker: COW, CWS, CWN,
    # CWH, CWA, COWE and GAT followed by a numeric identifier.
    data = data[
        data["cow_id"].str.upper().str.match(r"^(?:COW|CW|GAT)[A-Z]*\d+$", na=False)
    ].copy()
    data = data.dropna(subset=["moved_at", "reached_at"])
    data = data[data["reached_at"] >= data["moved_at"]]
    data = data.drop_duplicates(
        subset=["cow_id", "moved_at", "from_location", "to_location"], keep="last"
    )
    data["transit_hours"] = (
        (data["reached_at"] - data["moved_at"]).dt.total_seconds() / 3600
    ).clip(lower=0, upper=24 * 14)
    data["distance_km"] = data["distance_km"].clip(lower=0, upper=3000)
    return data.sort_values(["cow_id", "moved_at", "source_row"]).reset_index(drop=True)


def build_sequences(data: pd.DataFrame) -> pd.DataFrame:
    seq = data.copy()
    grouped = seq.groupby("cow_id", sort=False)
    seq["movement_number"] = grouped.cumcount() + 1
    seq["previous_moved_at"] = grouped["moved_at"].shift(1)
    seq["days_since_previous"] = (
        (seq["moved_at"] - seq["previous_moved_at"]).dt.total_seconds() / 86400
    ).clip(lower=0, upper=3650)
    seq["month"] = seq["moved_at"].dt.month
    seq["quarter"] = seq["moved_at"].dt.quarter
    seq["current_region"] = seq["region_to"]
    seq["current_category"] = seq["category"]
    seq["next_region"] = grouped["region_to"].shift(-1)
    seq["next_category"] = grouped["category"].shift(-1)
    seq["next_moved_at"] = grouped["moved_at"].shift(-1)
    seq["days_to_next_move"] = (
        (seq["next_moved_at"] - seq["moved_at"]).dt.total_seconds() / 86400
    ).clip(lower=0, upper=3650)
    return seq


def preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        [
            (
                "categorical",
                Pipeline(
                    [
                        ("impute", SimpleImputer(strategy="most_frequent")),
                        ("encode", OneHotEncoder(handle_unknown="ignore")),
                    ]
                ),
                CATEGORICAL_FEATURES,
            ),
            (
                "numeric",
                Pipeline(
                    [
                        ("impute", SimpleImputer(strategy="median")),
                        ("scale", StandardScaler()),
                    ]
                ),
                NUMERIC_FEATURES,
            ),
        ]
    )


def classifier(seed: int) -> Pipeline:
    return Pipeline(
        [
            ("prepare", preprocessor()),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=400,
                    min_samples_leaf=3,
                    class_weight="balanced_subsample",
                    random_state=seed,
                    n_jobs=-1,
                ),
            ),
        ]
    )


def regressor(seed: int) -> Pipeline:
    return Pipeline(
        [
            ("prepare", preprocessor()),
            (
                "model",
                RandomForestRegressor(
                    n_estimators=400,
                    min_samples_leaf=3,
                    random_state=seed,
                    n_jobs=-1,
                ),
            ),
        ]
    )


def classification_metrics(model: Pipeline, x: pd.DataFrame, y: pd.Series) -> dict:
    pred = model.predict(x)
    probabilities = model.predict_proba(x)
    classes = model.named_steps["model"].classes_
    top_k = min(3, len(classes))
    return {
        "accuracy": round(float(accuracy_score(y, pred)), 4),
        "top3Accuracy": round(float(top_k_accuracy_score(y, probabilities, labels=classes, k=top_k)), 4),
        "records": int(len(y)),
    }


def to_dashboard_json(data: pd.DataFrame) -> list[dict]:
    def date_text(value: pd.Timestamp) -> str:
        return value.strftime("%d %b %Y")

    records = []
    for _, r in data.iterrows():
        event = r["event_name"] if r["event_name"] != "Unknown" else r["category"]
        records.append(
            {
                "cows_id": r["cow_id"],
                "site_label": r["priority"],
                "current_locationlat": "",
                "current_location_lng": "",
                "ebu_royal": "ROYAL" if "royal" in event.lower() else "NON EBU",
                "shelter_outdoor": "",
                "tower_type": "",
                "tower_sytem": "",
                "tower_hieght": "",
                "2g_4g_lte_5g": "",
                "vehicle_make": "",
                "top_events": event,
                "moved_date_time": date_text(r["moved_at"]),
                "moved_month_year": r["moved_at"].strftime("%b-%y"),
                "reached_date_time": date_text(r["reached_at"]),
                "reached_month_year": r["reached_at"].strftime("%b-%y"),
                "from_location": r["from_location"],
                "from_sub_location": "",
                "from_latitude": "" if pd.isna(r["from_latitude"]) else str(r["from_latitude"]),
                "from_longitude": "" if pd.isna(r["from_longitude"]) else str(r["from_longitude"]),
                "to_location": r["to_location"],
                "to_sub_location": "" if r["to_sub_location"] == "Unknown" else r["to_sub_location"],
                "to_latitude": "" if pd.isna(r["to_latitude"]) else str(r["to_latitude"]),
                "to_longitude": "" if pd.isna(r["to_longitude"]) else str(r["to_longitude"]),
                "distance": "" if pd.isna(r["distance_km"]) else str(r["distance_km"]),
                "movement_type": r["movement_type"],
                "region_from": r["region_from"],
                "region_to": r["region_to"],
                "vendor": r["vendor"],
                "goverment": r["administrative_region"] if r["administrative_region"] != "Unknown" else r["city_district"],
                "remarks": r["status"],
            }
        )
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--cutoff", default="2025-01-01")
    parser.add_argument("--seed", type=int, default=1446)
    args = parser.parse_args()

    repo = args.repo.resolve()
    public_dir = repo / "public"
    artifact_dir = repo / "ml" / "artifacts"
    artifact_dir.mkdir(parents=True, exist_ok=True)

    data = load_tracker(args.workbook)
    seq = build_sequences(data)
    supervised = seq.dropna(subset=["next_region", "next_category", "next_moved_at"]).copy()
    cutoff = pd.Timestamp(args.cutoff)
    train = supervised[supervised["next_moved_at"] < cutoff]
    test = supervised[supervised["next_moved_at"] >= cutoff]
    if train.empty or test.empty:
        raise ValueError("Chronological split produced an empty train or validation set")

    region_model = classifier(args.seed).fit(train[FEATURES], train["next_region"])
    category_model = classifier(args.seed + 1).fit(train[FEATURES], train["next_category"])
    stay_train = train.dropna(subset=["days_to_next_move"])
    stay_test = test.dropna(subset=["days_to_next_move"])
    timing_model = regressor(args.seed + 2).fit(stay_train[FEATURES], stay_train["days_to_next_move"])

    latest = seq.sort_values("moved_at").groupby("cow_id", as_index=False).tail(1).copy()
    region_prob = region_model.predict_proba(latest[FEATURES])
    region_classes = region_model.named_steps["model"].classes_
    category_prob = category_model.predict_proba(latest[FEATURES])
    category_classes = category_model.named_steps["model"].classes_
    days_pred = np.maximum(0, timing_model.predict(latest[FEATURES]))

    predictions = []
    for idx, (_, row) in enumerate(latest.iterrows()):
        region_order = np.argsort(region_prob[idx])[::-1][:3]
        category_order = np.argsort(category_prob[idx])[::-1][:3]
        predictions.append(
            {
                "cowId": row["cow_id"],
                "lastMovementDate": row["moved_at"].date().isoformat(),
                "currentLocation": row["to_location"],
                "currentRegion": row["current_region"],
                "predictedDaysToNextMove": int(round(days_pred[idx])),
                "nextRegion": [
                    {"region": str(region_classes[i]), "probability": round(float(region_prob[idx][i]), 4)}
                    for i in region_order
                ],
                "nextLocationCategory": [
                    {"category": str(category_classes[i]), "probability": round(float(category_prob[idx][i]), 4)}
                    for i in category_order
                ],
            }
        )

    region_metrics = classification_metrics(region_model, test[FEATURES], test["next_region"])
    category_metrics = classification_metrics(category_model, test[FEATURES], test["next_category"])
    timing_prediction = timing_model.predict(stay_test[FEATURES])
    result = {
        "modelVersion": "2.0.0",
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "source": args.workbook.name,
        "method": "Chronological validation: train before 2025-01-01; validate on 2025 and later next movements",
        "data": {
            "cleanMovementRows": int(len(data)),
            "uniqueCows": int(data["cow_id"].nunique()),
            "firstMovementDate": data["moved_at"].min().date().isoformat(),
            "lastMovementDate": data["moved_at"].max().date().isoformat(),
            "trainingSequences": int(len(train)),
            "validationSequences": int(len(test)),
        },
        "metrics": {
            "nextRegion": region_metrics,
            "nextLocationCategory": category_metrics,
            "daysToNextMove": {
                "maeDays": round(float(mean_absolute_error(stay_test["days_to_next_move"], timing_prediction)), 2),
                "r2": round(float(r2_score(stay_test["days_to_next_move"], timing_prediction)), 4),
                "records": int(len(stay_test)),
            },
        },
        "predictions": predictions,
    }

    with (public_dir / "movement-data.json").open("w", encoding="utf-8") as handle:
        json.dump(to_dashboard_json(data), handle, ensure_ascii=False, indent=2)
    with (public_dir / "ml-model-results.json").open("w", encoding="utf-8") as handle:
        json.dump(result, handle, ensure_ascii=False, indent=2)
    data.to_csv(repo / "movement-data-latest.csv", index=False)
    joblib.dump(
        {"region": region_model, "category": category_model, "timing": timing_model, "features": FEATURES},
        artifact_dir / "movement-models.joblib",
        compress=3,
    )
    print(json.dumps(result["data"] | result["metrics"], indent=2))


if __name__ == "__main__":
    main()
