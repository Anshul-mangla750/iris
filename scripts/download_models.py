"""
Download base model weights for RetailEdge AI.
Downloads Ultralytics YOLOv11 nano model for COCO person detection and copies to models/person/yolo11n.pt.
"""
from __future__ import annotations

import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PERSON_DIR = ROOT / "models" / "person"

def download_models():
    print("=" * 60)
    print("RetailEdge AI — Downloading Base Models")
    print("=" * 60)
    
    PERSON_DIR.mkdir(parents=True, exist_ok=True)
    target = PERSON_DIR / "yolo11n.pt"
    
    if target.exists():
        print(f"[OK] Person model already exists at: {target}")
        return 0

    print("Fetching yolo11n.pt via Ultralytics...")
    try:
        from ultralytics import YOLO
        # Trigger automatic download from Ultralytics assets
        model = YOLO("yolo11n.pt")
        # Find where it downloaded (usually working directory or torch cache)
        if Path("yolo11n.pt").exists():
            shutil.move("yolo11n.pt", target)
            print(f"[SUCCESS] Moved yolo11n.pt to: {target}")
        else:
            # Fallback direct download
            import urllib.request
            url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt"
            print(f"Downloading from {url}...")
            urllib.request.urlretrieve(url, str(target))
            print(f"[SUCCESS] Downloaded to: {target}")
    except Exception as exc:
        print(f"[WARN] Ultralytics download error ({exc}), attempting direct HTTPS download...")
        import urllib.request
        url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt"
        urllib.request.urlretrieve(url, str(target))
        print(f"[SUCCESS] Downloaded to: {target}")
        
    print(f"[DONE] File size: {target.stat().st_size / (1024*1024):.2f} MB")
    return 0

if __name__ == "__main__":
    download_models()
