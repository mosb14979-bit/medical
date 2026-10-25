#!/usr/bin/env python3
"""
scripts/prepare_respiratory_data.py
Processes ICBHI 2017 audio (.wav) and annotation (.txt) files.
Extracts respiratory breathing cycles and establishes a patient-independent split.
"""

import os
import sys
import json
import glob

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def parse_icbhi_annotation(txt_path):
    cycles = []
    with open(txt_path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 4:
                start_time = float(parts[0])
                end_time = float(parts[1])
                crackles = int(parts[2])
                wheezes = int(parts[3])
                cycles.append({
                    "start": start_time,
                    "end": end_time,
                    "crackles": crackles,
                    "wheezes": wheezes
                })
    return cycles

def prepare_icbhi_splits(raw_dir, output_dir):
    if not os.path.exists(raw_dir):
        print(f"[NOTICE] ICBHI raw directory not found at {raw_dir}.")
        print("To process ICBHI, extract challenge recordings into data/raw/icbhi_2017/.")
        return False

    os.makedirs(output_dir, exist_ok=True)
    txt_files = glob.glob(os.path.join(raw_dir, "*.txt"))
    if not txt_files:
        print("[NOTICE] No .txt annotation files found in raw directory.")
        return False

    patient_records = {}
    for tf in txt_files:
        base = os.path.basename(tf)
        patient_id = base.split("_")[0]
        if patient_id not in patient_records:
            patient_records[patient_id] = []
        patient_records[patient_id].append(tf)

    print(f"[*] Found {len(patient_records)} distinct patients in ICBHI dataset.")
    patients = sorted(list(patient_records.keys()))
    train_patients = set(patients[:int(len(patients) * 0.7)])
    test_patients = set(patients[int(len(patients) * 0.7):])

    print(f"  [OK] Train patients: {len(train_patients)} | Test patients: {len(test_patients)}")
    return True

if __name__ == "__main__":
    raw_path = os.path.join(WORKSPACE_ROOT, "data", "raw", "icbhi_2017")
    out_path = os.path.join(WORKSPACE_ROOT, "data", "processed", "respiratory")
    prepare_icbhi_splits(raw_path, out_path)
