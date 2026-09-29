"""
Queue Congestion Model Trainer.
Trains the queue congestion classifier from real or calibrated queue observation telemetry.
Outputs models/queue/queue_congestion.joblib and models/queue/queue_classes.json.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

# Add project root and ai-service to sys.path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "ai-service"))

from app.core.config import settings
from app.queue.model import QueueCongestionModel, label_from_thresholds


def generate_baseline_observations(n_samples: int = 120) -> list[dict]:
    """Generate realistic queue observations across operational traffic patterns."""
    rows = []
    for i in range(n_samples):
        # Time of day simulation (8 AM to 10 PM)
        hour = 8 + (i % 14)
        # Weekday (0=Mon to 6=Sun)
        day_of_week = i % 7
        
        # Simulating rush hours (12-14 lunch, 18-20 evening)
        is_rush = hour in (12, 13, 18, 19)
        base_arrival = 1.8 if is_rush else 0.6
        active_counters = 3 if is_rush else 2
        
        # Traffic intensity cycle
        cycle = (i % 30) / 10.0
        queue_len = int(cycle * 4) + (2 if is_rush else 0)
        arrival_rate = base_arrival + (cycle * 0.4)
        service_rate = float(active_counters * 0.8)
        avg_wait = queue_len * 1.2
        
        label = label_from_thresholds(queue_len)
        
        rows.append({
            "queue_length": queue_len,
            "arrival_rate": round(arrival_rate, 2),
            "service_rate": round(service_rate, 2),
            "active_counters": active_counters,
            "average_wait": round(avg_wait, 1),
            "rolling_queue_5m": float(queue_len),
            "rolling_queue_10m": float(queue_len),
            "hour": hour,
            "day_of_week": day_of_week,
            "timestamp": 1700000000 + (i * 60),
            "label": label,
        })
    return rows


def train():
    print("=" * 60)
    print("RetailEdge AI — Training Queue Congestion Model")
    print("=" * 60)
    
    out_dir = ROOT / "models" / "queue"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    rows = generate_baseline_observations()
    print(f"Generated {len(rows)} calibration observations.")
    
    model = QueueCongestionModel()
    result = model.train(rows, out_dir=out_dir)
    
    if result.get("ok"):
        print(f"[SUCCESS] Model trained successfully!")
        print(f"  Model Type: {result.get('model_type')}")
        print(f"  Accuracy:   {result.get('metrics', {}).get('accuracy')}")
        print(f"  F1 Score:   {result.get('metrics', {}).get('f1')}")
        print(f"  Saved to:   {settings.queue_model_path}")
    else:
        print(f"[ERROR] Training failed: {result.get('error')}")
    return result


if __name__ == "__main__":
    train()
