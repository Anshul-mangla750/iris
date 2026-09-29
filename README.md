# RetailEdge AI / IRIS

Real-time retail analytics from actual camera inference: shopper analytics, shelf/inventory intelligence, and queue management.

**This system runs real models on real frames.** There is no simulated data anywhere in production paths — when data or a model is unavailable, APIs return `DATA_NOT_AVAILABLE` / `MODEL_NOT_TRAINED` / `NO_DATA` instead of fabricated numbers.

## What it does

| Domain | Capabilities | Backed by |
|---|---|---|
| Shopper | entry/exit counts, footfall, zones, dwell time, heatmap, trajectories | YOLO person detector + ByteTrack |
| Inventory | visible facings, shelf occupancy, empty gaps, LOW_STOCK / OUT_OF_STOCK (temporally confirmed), planogram violations | custom YOLO product detector + catalog recognition + shelf polygons |
| Queue | queue length from queue polygons, arrival/service rates, real wait durations, congestion prediction | tracker + queue polygons + XGBoost/sklearn model trained on collected observations |
| Alerts | LOW_STOCK, OUT_OF_STOCK, EMPTY_SHELF, PLANOGRAM_VIOLATION, QUEUE_WARNING/HIGH, CAMERA_OFFLINE | event engine with debouncing |
| Privacy | anonymous track IDs only, no face recognition, optional head blur, retention limits | pipeline design |

## Quickstart (5 commands)

```bash
# 1. Python env (3.10–3.14) — from repo root
py -3 -m venv ai-service/venv && .\ai-service\venv\Scripts\python -m pip install -r ai-service/requirements.txt

# 2. Base person-detector weights (COCO yolo11n)
.\ai-service\venv\Scripts\python scripts/download_models.py

# 3. Configure (optional wizard; or copy .env.example → .env and edit)
copy .env.example .env

# 4. Run the API
cd ai-service && .\venv\Scripts\python -m uvicorn app.main:app --port 8100 --reload

# 5. Dashboard (second terminal)
cd RetailEdge-main\frontend && npm install && npm run dev    # → http://localhost:5173
```

Alternatively, to start all 3 services at once on Windows:
```bat
run_all.bat
```

Open `http://localhost:5173`, enter source `0` (webcam) or `http://<phone-ip>:8080/video`
(IP camera), press **Start**. Bounding boxes, track IDs, FPS and latency come from
actual inference.

## Reality constraints (read this first)

- **Person detection works out of the box** (COCO-pretrained YOLO + ByteTrack).
- **Product/rack/shelf detection requires training** on real retail data. Until you train
  and deploy weights, `/models/status` honestly reports `NOT_TRAINED` and those detectors
  contribute nothing. See `docs/TRAINING.md` (SKU-110K / custom store pipeline).
- **Product/SKU recognition requires reference images** per catalog product. Without them,
  recognition reports `NO_REFERENCE_DATA` and per-product inventory stays `NO_DATA`.
- **Queue congestion prediction requires collected data.** The live pipeline stores real
  observations from your queue polygon into `queue_observations`; after ~30+ rows with at
  least two congestion states, run `python training/train_queue.py` (or POST `/queue/train`).
  Thresholds used for labels are your configured operational thresholds, not learned facts.
- Shelf geometry (racks/shelves/lines/zones/queues) is **calibration, not training**:
  configure polygons via the wizard or `POST /config/*`; no retraining needed.

## Architecture

```
Camera (webcam / IP / RTSP / file)
  → OpenCV capture thread (bounded queue, auto-reconnect)
  → Person YOLO + ByteTrack (every frame)
  → Product/Rack/Shelf YOLO + recognizer (interval)
  → Analytics engines (shopper / inventory / queue)
  → Alert engine (debounced, persisted)
  → FastAPI (MJPEG stream + REST) → React dashboard
  → SQLite edge buffer when the backend/DB is unreachable (sync later)
```

See `docs/MODEL_ARCHITECTURE.md` for model-by-model detail and `ai-service/app/` for code.

## Repository layout

```
retail-edge/
├── ai-service/        FastAPI app (api, core, models, tracking, pipelines, analytics,
│                      inventory, queue, alerts, privacy, database) + tests/
├── training/          train_person/product/shelf/segmentation/queue, evaluate.py
├── dataset_tools/     annotate_tool, prepare_sku110k, validate_dataset
├── scripts/           setup_store.py wizard, download_models.py
├── RetailEdge-main/   React+TS operations dashboard (14 pages)
├── backend/           Node.js/Express aggregation target & Socket.IO broadcaster
├── models/            weights per domain (person/product/rack/shelf/segmentation/queue)
├── datasets/          raw/ processed/ custom_store/ (see docs/DATASET_REGISTRY.md)
├── docs/              TRAINING, MODEL_ARCHITECTURE, MODEL_CARD, etc.
└── run_all.bat        Windows master launcher for all 3 services
```

## Live camera sources

| Source | `CAMERA_SOURCE` / UI field |
|---|---|
| Laptop webcam | `0` |
| Android IP camera (e.g. IP Webcam app) | `http://<phone-ip>:8080/video` |
| RTSP | `rtsp://user:pass@cam-ip:554/stream` |
| Video file | `D:/clips/aisle.mp4` |

Same pipeline for all; files stop gracefully at end (`video ended`).

## Tests

```bash
.\ai-service\venv\Scripts\pytest.exe ai-service/tests -q
```

All 64 unit/integration tests cover entry/exit crossing, zones, dwell, queue membership and
wait measurement, facing counts, low-stock classification, OOS temporal confirmation,
planogram violations, alert debouncing, model-status honesty, camera failure handling,
and all API endpoints.

## No-fake-data policy

Production paths never emit random or placeholder values. Model readiness is factual
(`READY` only when weights loaded). Analytics endpoints return `DATA_NOT_AVAILABLE`
until real frames are processed. Evaluation metrics in `docs/MODEL_CARD.md` are filled
only from measured runs on held-out data — never estimated.
