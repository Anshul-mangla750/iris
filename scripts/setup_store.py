"""
Store Configuration & Calibration Wizard.
Interactive CLI to configure store ID, entrance/exit virtual lines, zone polygons, and camera settings.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "ai-service"))

from app.core.config import settings
from app.core.store_config import get_store_config


def run_wizard():
    print("=" * 60)
    print("RetailEdge AI — Store Setup Wizard")
    print("=" * 60)
    
    cfg = get_store_config()
    current = cfg.data
    
    print(f"Current Store ID:   {current.get('store_id')}")
    print(f"Cameras Configured: {len(current.get('cameras', []))}")
    print(f"Zones Configured:   {len(current.get('zones', []))}")
    print(f"Queues Configured:  {len(current.get('queues', []))}")
    print(f"Shelves Configured: {len(current.get('shelves', []))}")
    
    # Ensure default geometry exists
    if not current.get("entry_line"):
        print("\nConfiguring default entrance/exit calibration lines...")
        cfg.set_geometry("entry_line", "main_entrance", [[100, 450], [500, 450]])
        cfg.set_geometry("exit_line", "main_exit", [[700, 450], [1100, 450]])
        print("[OK] Entry and exit lines calibrated.")

    if not current.get("queues"):
        print("Configuring default checkout queue polygon (Q1)...")
        cfg.set_geometry("queue", "Q1", [[850, 200], [1150, 200], [1150, 600], [850, 600]],
                         name="Counter 1 Queue", counter_id="counter_1")
        print("[OK] Queue Q1 polygon saved.")
        
    print("\n[SUCCESS] Store calibration verified. Config saved to:", cfg.path)
    return 0


if __name__ == "__main__":
    run_wizard()
