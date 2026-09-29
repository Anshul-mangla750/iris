# RetailEdge AI — Intelligent Retail Analytics System

A production-grade, 3-tier intelligent retail analytics system providing real-time Shopper Analytics, Inventory Monitoring, Queue Intelligence, Edge AI Processing, Privacy-Aware Analytics, Store Operations Dashboard, and Multi-Store Management.

---

## 🏛️ System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │          React + TypeScript Frontend         │
                  │   Port 5173 (Vite Dev) or Static Dashboard  │
                  └───────────────▲──────────────▲───────────────┘
                                  │ REST API     │ WebSocket
                                  │ (/api/*)     │ (/socket.io)
                  ┌───────────────▼──────────────┴───────────────┐
                  │         Node.js / Express Backend            │
                  │   Port 5000: Aggregation, REST & Socket.io   │
                  └───────────────────────▲──────────────────────┘
                                          │ HTTP Proxy
                                          │ (/metrics, /camera, ...)
                  ┌───────────────────────▼──────────────────────┐
                  │             FastAPI AI Service               │
                  │   Port 8100: YOLO, ByteTrack, OpenCV, Queue  │
                  └──────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (All Services)

To start the entire system with one command on Windows, double-click or run:

```bat
run_all.bat
```

This launches three dedicated terminal windows:
1. **AI Service** on `http://localhost:8100` (Swagger UI at `/docs`)
2. **Backend Server** on `http://localhost:5000` (Health at `/api/health`)
3. **Frontend Dashboard** on `http://localhost:5173`

---

## 🛠️ Manual Step-by-Step Execution

### 1. AI Service (Python / FastAPI)
```bash
cd ai-service
# Activate virtual environment
.\venv\Scripts\activate
# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload
```

### 2. Backend Server (Node.js / Express / Socket.IO)
```bash
cd backend
npm install
npm start
```
*Runs on port 5000 and bridges requests between frontend and the AI service, with real-time WebSocket metric broadcasting.*

### 3. Frontend Dashboard (React / Vite / Tailwind)
```bash
cd RetailEdge-main/frontend
npm install
npm run dev
```
*Runs on port 5173 and automatically proxies `/api` and `/socket.io` to the Node.js backend.*

---

## 📡 Key API Routes

### Backend (`http://localhost:5000/api`)
- `GET /api/health` — System and AI connection health check
- `GET /api/analytics/overview` — Dashboard KPIs, footfall trends, zone dwell, AI insights
- `GET /api/cameras` — Real-time camera feeds, status, resolution, FPS
- `GET /api/cameras/stream/live` — Proxied MJPEG live camera stream
- `GET /api/inventory/overview` — Out-of-stock items, health distribution, shelf alerts
- `GET /api/queues/overview` — Active queues, wait times, ML congestion predictions
- `GET /api/shopper/overview` — Hourly footfall, zone heatmaps, dwell times
- `GET /api/stores` — Multi-store status and regional metrics
- `GET /api/alerts` — Real-time operational alerts with resolution actions
- `GET /api/integrations` — POS and ERP terminal synchronization status

### AI Service (`http://localhost:8100`)
- `GET /health` — Hardware device (CPU/CUDA), pipeline, and model statuses
- `GET /camera/stream` — Multi-part MJPEG video stream with bounding boxes
- `GET /metrics/live` — Real-time inference metrics from active camera pipelines
- `GET /shopper/metrics` — Person tracking, entry/exit counts, and dwell times
- `GET /inventory/status` — Shelf facing occupancy and stock detection
- `GET /queue/status` — Counter queues and queue length estimation
- `GET /queue/prediction` — Machine learning congestion classification
- `POST /config/geometry` — Zone and shelf polygon calibration
