#!/usr/bin/env python3
"""
scripts/prepare_skin_data.py
Preprocesses HAM10000 metadata and images into train/validation/test splits.
Enforces patient/lesion-level separation (lesion_id partitioning) to prevent data leakage.
"""

import os
import sys
import json
import csv
from collections import defaultdict

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def split_ham10000_metadata(csv_path, output_dir, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15):
    if not os.path.exists(csv_path):
        print(f"[NOTICE] HAM10000 metadata CSV not found at {csv_path}.")
        print("To run full dataset preparation, download HAM10000_metadata.csv into data/raw/.")
        return False

    os.makedirs(output_dir, exist_ok=True)
    print(f"[*] Parsing HAM10000 metadata from: {csv_path}")

    lesion_to_rows = defaultdict(list)
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            lesion_id = row.get("lesion_id", row.get("image_id"))
            lesion_to_rows[lesion_id].append(row)

    unique_lesions = sorted(list(lesion_to_rows.keys()))
    total_lesions = len(unique_lesions)
    print(f"[*] Found {total_lesions} distinct lesions across records.")

    n_train = int(total_lesions * train_ratio)
    n_val = int(total_lesions * val_ratio)

    train_lesions = set(unique_lesions[:n_train])
    val_lesions = set(unique_lesions[n_train:n_train+n_val])
    test_lesions = set(unique_lesions[n_train+n_val:])

    splits = {"train": [], "val": [], "test": []}
    for lesion_id, rows in lesion_to_rows.items():
        if lesion_id in train_lesions:
            splits["train"].extend(rows)
        elif lesion_id in val_lesions:
            splits["val"].extend(rows)
        else:
            splits["test"].extend(rows)

    for split_name, rows in splits.items():
        out_csv = os.path.join(output_dir, f"{split_name}_split.csv")
        if rows:
            with open(out_csv, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
            print(f"  [OK] Generated {split_name} split with {len(rows)} images -> {out_csv}")

    return True

if __name__ == "__main__":
    csv_file = os.path.join(WORKSPACE_ROOT, "data", "raw", "HAM10000_metadata.csv")
    out_dir = os.path.join(WORKSPACE_ROOT, "data", "processed", "skin")
    split_ham10000_metadata(csv_file, out_dir)
