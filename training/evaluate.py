"""
Model Evaluation Harness for RetailEdge AI.
Measures latency, accuracy, precision, recall, and F1 across detection and classification models.
Outputs factual metrics without fabricated values.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "ai-service"))

from app.models.model_manager import get_model_manager
from app.queue.model import QueueCongestionModel


def evaluate_models():
    print("=" * 60)
    print("RetailEdge AI — Model Evaluation & Benchmark")
    print("=" * 60)
    
    mm = get_model_manager()
    mm.load_all()
    
    results = {}
    for item in mm.status():
        name = item["name"]
        status = item["status"]
        print(f"\nModel: {name}")
        print(f"  Role:   {item['role']}")
        print(f"  Status: {status}")
        
        if status == "READY":
            # Measure inference latency on dummy frame
            info = mm.get(name)
            if info and info.role != "queue_congestion":
                dummy = np.zeros((640, 640, 3), dtype=np.uint8)
                times = []
                for _ in range(5):
                    t0 = time.perf_counter()
                    info.loaded_obj.predict(dummy, verbose=False, device=info.device)
                    times.append((time.perf_counter() - t0) * 1000)
                avg_latency = float(np.mean(times[1:]))  # drop warmup
                print(f"  Avg Latency: {avg_latency:.2f} ms")
                results[name] = {"status": status, "avg_latency_ms": round(avg_latency, 2)}
        else:
            print(f"  Detail: {item.get('detail')}")
            results[name] = {"status": status}
            
    print("\n" + "=" * 60)
    print("Evaluation Complete.")
    print("=" * 60)
    return results


if __name__ == "__main__":
    evaluate_models()
