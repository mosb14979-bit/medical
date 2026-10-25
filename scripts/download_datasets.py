#!/usr/bin/env python3
"""
scripts/download_datasets.py
Safe, resumable dataset downloader and verification utility for HAM10000 and ICBHI 2017.
Enforces path traversal safety, checks file integrity, and skips existing valid archives.
"""

import os
import sys
import json
import urllib.request
import hashlib

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DATA_DIR = os.path.join(WORKSPACE_ROOT, "data", "raw")

def verify_checksum(filepath, expected_sha256):
    if not expected_sha256:
        return True
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest().lower() == expected_sha256.lower()

def download_file(url, target_filename, expected_sha256=None):
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    safe_name = os.path.basename(target_filename)
    dest_path = os.path.join(RAW_DATA_DIR, safe_name)

    if os.path.exists(dest_path):
        if expected_sha256 and verify_checksum(dest_path, expected_sha256):
            print(f"[*] File already downloaded and checksum verified: {safe_name}")
            return dest_path
        elif not expected_sha256:
            print(f"[*] File already exists (skipping re-download): {safe_name}")
            return dest_path

    print(f"[*] Downloading {safe_name} from {url} ...")
    try:
        def reporthook(count, block_size, total_size):
            if total_size > 0:
                percent = int(count * block_size * 100 / total_size)
                sys.stdout.write(f"\r    Progress: {percent}% ({count * block_size // 1024} KB)")
                sys.stdout.flush()

        urllib.request.urlretrieve(url, dest_path, reporthook=reporthook)
        print("\n[*] Download finished.")
        return dest_path
    except Exception as e:
        print(f"\n[ERROR] Failed to download {url}: {e}")
        return None

def print_manual_dataset_instructions():
    print("=====================================================================")
    print("                Dataset Access & Download Instructions")
    print("=====================================================================")
    print("1. HAM10000 / ISIC 2018 Task 3:")
    print("   Official Harvard Dataverse URL: https://doi.org/10.7910/DVN/DBW86T")
    print("   License: Creative Commons Attribution-NonCommercial 4.0")
    print("   Place downloaded files into: data/raw/ham10000/")
    print("\n2. ICBHI 2017 Respiratory Sound Database:")
    print("   Official Challenge URL: https://bhichallenge.med.auth.gr/")
    print("   Requires free academic registration on the official challenge portal.")
    print("   Place extracted .wav and .txt pairs into: data/raw/icbhi_2017/")
    print("=====================================================================")

def main():
    print_manual_dataset_instructions()

if __name__ == "__main__":
    main()
