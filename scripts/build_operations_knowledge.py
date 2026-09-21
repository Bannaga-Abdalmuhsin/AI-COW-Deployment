#!/usr/bin/env python3
"""Build the public operations knowledge index from the source movement workbook."""

from __future__ import annotations

import json
import sys
from datetime import date, datetime, time, timedelta
from pathlib import Path

from openpyxl import load_workbook


FIELDS = [
    "recordNo", "cowId", "bpmRequestId", "planStatus", "movedAt", "reachedAt",
    "fromLocation", "fromLatitude", "fromLongitude", "category", "toLocation",
    "eventName", "subLocation", "toLatitude", "toLongitude", "administrativeRegion",
    "distanceKm", "radiusUnderContractKm", "movementType", "regionFrom", "regionTo",
    "cityDistrict", "vendor", "kpiScope", "slaSeconds", "kpiSeconds", "exceededSeconds",
    "priority", "cancelled", "statusRemarks", "managementComments", "month",
]


def clean(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, time):
        return value.isoformat()
    if isinstance(value, timedelta):
        return int(value.total_seconds())
    if isinstance(value, str):
        value = " ".join(value.split())
        return None if not value or value.upper() == "NA" else value
    return value


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: build_operations_knowledge.py INPUT.xlsx OUTPUT.json")
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    workbook = load_workbook(source, read_only=True, data_only=True)
    sheet = workbook[workbook.sheetnames[0]]
    records = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        record = {key: clean(value) for key, value in zip(FIELDS, row)}
        if any(value is not None for value in record.values()):
            records.append(record)
    payload = {
        "source": source.name,
        "sheet": sheet.title,
        "recordCount": len(records),
        "fieldCount": len(FIELDS),
        "fields": FIELDS,
        "records": records,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(records):,} records to {output}")


if __name__ == "__main__":
    main()
