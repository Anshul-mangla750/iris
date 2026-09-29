"""
Product Detection Fine-Tuning Script.
Trains or fine-tunes YOLO model on retail shelf products (e.g. SKU-110K or custom phone dataset).
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "ai-service"))

from app.core.config import settings


def train(data_yaml: str = "datasets/processed/sku110k_yolo/data.yaml", epochs: int = 30, imgsz: int = 640):
    print("=" * 60)
    print("RetailEdge AI — Product Detection Training")
    print("=" * 60)
    
    yaml_path = Path(data_yaml)
    if not yaml_path.exists():
        print(f"[ERROR] Data config not found: {yaml_path}")
        print("Please run dataset_tools/prepare_sku110k.py or prepare custom shelf data first.")
        return 1

    from ultralytics import YOLO

    base_model = ROOT / "models" / "person" / "yolo11n.pt"
    model_src = str(base_model) if base_model.exists() else "yolo11n.pt"
    
    print(f"Loading base model: {model_src}")
    model = YOLO(model_src)
    
    out_dir = ROOT / "models" / "product"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Starting training on {yaml_path} for {epochs} epochs...")
    results = model.train(
        data=str(yaml_path),
        epochs=epochs,
        imgsz=imgsz,
        project=str(out_dir),
        name="run",
        exist_ok=True,
    )
    
    best_weights = out_dir / "run" / "weights" / "best.pt"
    target_weights = settings.product_model_path
    if best_weights.exists():
        import shutil
        shutil.copy2(best_weights, target_weights)
        print(f"[SUCCESS] Product model saved to: {target_weights}")
    return 0


if __name__ == "__main__":
    train()
