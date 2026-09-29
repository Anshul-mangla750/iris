# RetailEdge AI

**Fully Complete Implementation Plan, Technology Stack, Architecture & Laptop + Phone Prototype Guide**

**Objective:** Build one integrated Intelligent Retail Analytics System with seven connected capabilities: Shopper Analytics, Inventory Monitoring, Queue Intelligence, Edge AI Processing, Privacy-Aware Analytics, Store Operations Dashboard, and Scalable Multi-Store/POS/ERP Deployment.

**Current constraint:** The complete prototype is designed to run using only a laptop and Android phone. Jetson, CCTV, RFID, IoT and other dedicated hardware are future deployment options.

---

## 1. System Overview

```
Phone / webcam / recorded video → OpenCV → YOLO → ByteTrack / rules → AI events → FastAPI → Node/Express → MongoDB → React Dashboard
```

The laptop acts as the development machine, AI server and simulated edge node. The phone provides realistic camera footage. This lets all seven features be implemented before buying physical retail hardware.

---

## 2. Complete Architecture

| Layer | Technology | Role now | Future role |
|---|---|---|---|
| Video input | Android phone / webcam / MP4 | Collect test footage | IP/RTSP CCTV |
| Computer vision | Python + OpenCV | Frames, zones, lines | Same |
| Detection | YOLO | People/products/objects | Optimized edge model |
| Tracking | ByteTrack | Anonymous tracks | Same on edge |
| Prediction | XGBoost | Queue prediction | Production model |
| AI service | FastAPI | AI/inference APIs | Edge microservice |
| Backend | Node.js + Express | Business APIs/auth | Central backend |
| Central DB | MongoDB | Events/products/stores | Managed DB |
| Offline DB | SQLite | Local event buffer | SQLite on edge |
| Messaging | MQTT | Edge simulation | Store edge messaging |
| Realtime | Socket.IO | Live dashboard | Same |
| Frontend | React + TypeScript + Tailwind | Dashboard | Hosted dashboard |
| Charts | Recharts | KPIs/reports | Same |
| Containers | Docker | Run services | Edge/cloud deployment |
| Model format | ONNX | Model portability | Jetson deployment |
| NVIDIA optimization | TensorRT | Not required now | Jetson acceleration |
| Video pipeline | GStreamer | Optional now | Production RTSP |
| Security | JWT + RBAC + HTTPS/TLS | Auth/access | Production security |

---

## 3. Technology Dictionary — What Each Technology Does

| Technology | What it is | Purpose in project | Features |
|---|---|---|---|
| Python | Programming language | AI, computer vision and ML | 1–5 |
| OpenCV | Computer vision library | Video frames, zones, lines, image processing | 1–5 |
| YOLO | Real-time object detector | People/product/object detection | 1–3 |
| ByteTrack | Multi-object tracker | Anonymous IDs, counting, dwell/wait time | 1, 3 |
| PyTorch | Deep-learning framework | Train/fine-tune/load models | 1–3 |
| XGBoost | Gradient boosting ML | Queue congestion prediction | 3 |
| FastAPI | Python web framework | Serve AI/inference APIs | 1–5 |
| Node.js | JavaScript runtime | Application backend | 6, 7 |
| Express.js | Node web framework | REST APIs/auth/integrations | 6, 7 |
| React | Frontend library | Operations dashboard | 6 |
| TypeScript | Typed JavaScript | Maintainable frontend | 6, 7 |
| Tailwind CSS | Utility CSS | Dashboard styling | 6 |
| Recharts | React chart library | KPI/report charts | 6 |
| Socket.IO | Realtime communication | Live alerts/metrics | 6 |
| MongoDB | Document database | Events/products/stores/alerts | 1, 2, 3, 6, 7 |
| SQLite | Embedded database | Offline event buffer | 4 |
| MQTT | Messaging protocol | Edge-to-server events | 4, 7 |
| Docker | Containerization | Package/run services | 4, 7 |
| ONNX | Portable ML format | Model portability | 4 future |
| TensorRT | NVIDIA optimizer | Fast edge inference later | 4 future |
| GStreamer | Video pipeline | RTSP/camera processing later | 4 future |
| JWT | Auth token standard | Secure login/API access | 5, 6, 7 |
| RBAC | Role-based access | Staff/manager/admin permissions | 5, 6, 7 |
| HTTPS/TLS | Encrypted transport | Protect API/data traffic | 5, 7 |

---

## 4. Feature 1 — Shopper Analytics

**Goal:** Detect and count customers entering/exiting, measure dwell time, analyze zones and generate movement heatmaps.

**Current input:** Android phone video, laptop webcam or MP4. No dedicated camera required.

```
Video → OpenCV → YOLO person detection → ByteTrack → entry/exit line → zones → dwell/heatmap → MongoDB → dashboard
```

| Function | Implementation | Technology |
|---|---|---|
| Entry/exit | Virtual line; count anonymous track crossing direction | YOLO + ByteTrack + OpenCV |
| Footfall | Aggregate entry/exit by hour/day/zone | Python + MongoDB |
| Dwell time | Zone entry/exit timestamps per track | ByteTrack + OpenCV |
| Heatmap | Convert coordinates into density grid | OpenCV + React |
| Zone analysis | Polygon zones for departments/promotions | OpenCV + MongoDB |

**Implementation:** Record 1–3 minute videos. Read them with OpenCV. Run YOLO person detection and ByteTrack. Configure an entrance line and 3–5 zones. Record anonymous track events, calculate dwell time, aggregate coordinates into a heatmap and display footfall/dwell/zone trends.

---

## 5. Feature 2 — Inventory Monitoring

**Goal:** Detect low-stock/out-of-stock products and basic planogram violations.

**Current input:** Phone photographs/videos of a small mock shelf. Start with 5–10 products.

```
Shelf video → YOLO product detection → facing count → thresholds → planogram check → alert
```

| Function | Implementation | Technology |
|---|---|---|
| Product detection | Train/fine-tune model for selected products | YOLO + PyTorch |
| Facing count | Count visible product instances | YOLO + OpenCV |
| Low stock | Compare count with minimum facing threshold | Python rules |
| Out of stock | Expected position empty for defined period | Python + MongoDB |
| Planogram | Compare actual class/position with shelf grid | YOLO + OpenCV |
| OCR optional | Read label/SKU if detection is insufficient | OCR library |

**Implementation:** Capture varied phone images, label product bounding boxes, train/fine-tune YOLO, configure shelf positions and minimum facings, then generate stock and compliance alerts. A small product set is sufficient for a convincing prototype.

---

## 6. Feature 3 — Queue Intelligence

**Goal:** Measure queue length, waiting/service times and predict congestion.

```
Checkout video → YOLO → ByteTrack → queue polygon → queue metrics → XGBoost → alert
```

| Metric | How it is calculated |
|---|---|
| Queue length | Active anonymous tracks inside queue polygon |
| Waiting time | Queue entry timestamp to queue exit/service timestamp |
| Arrival rate | Customers entering queue per unit time |
| Service rate | Customers leaving queue per unit time |
| Congestion | Threshold rules plus XGBoost prediction |
| Recommendation | Recommend opening another counter if predicted wait/queue exceeds configured limit |

**XGBoost inputs:** current queue length, arrival rate, service rate, active counters, time of day, day of week and recent queue history. Output can be Normal, Warning or High congestion.

---

## 7. Feature 4 — Edge AI Processing Without Hardware

Simulate the future edge node on the laptop. Docker packages the local AI service and SQLite acts as the local event buffer. During an offline test, the AI still processes local video and stores events. After connectivity returns, a sync process sends pending events to MongoDB.

```
Video → Docker edge service → YOLO/tracking → SQLite → local alerts → connection restored → sync → MongoDB
```

| Current laptop version | Future production version |
|---|---|
| Docker container on laptop | Same container on Jetson |
| Laptop CPU/GPU | Jetson accelerator |
| SQLite local buffer | SQLite on edge device |
| OpenCV/YOLO | ONNX/TensorRT optimized model |
| Phone/MP4/webcam | IP/RTSP camera |

> **Important:** Jetson and TensorRT are not required now. They become relevant when you migrate the software to physical NVIDIA edge hardware.

---

## 8. Feature 5 — Privacy-Aware Analytics

| Do | Avoid |
|---|---|
| Anonymous IDs such as PERSON_023 | Facial recognition |
| Local processing where possible | Unnecessary continuous cloud video |
| Store metrics/events instead of unnecessary footage | Indefinite identifiable video storage |
| JWT authentication and RBAC | Shared admin credentials |
| TLS/HTTPS | Unencrypted production APIs |
| Configurable retention/deletion | Uncontrolled retention |

Example event:

```
trackId=PERSON_023, zone=electronics, dwellSeconds=84
```

The system does not need a person's name or identity.

---

## 9. Feature 6 — Store Operations Dashboard

React + TypeScript builds the UI, Tailwind CSS styles it, Recharts displays trends, and Socket.IO pushes live events.

| Page | Main content |
|---|---|
| Live Overview | Footfall, active queues, stock alerts, congestion alerts, camera/edge status |
| Shopper Analytics | Footfall, entry/exit, dwell, zone heatmap |
| Inventory | Availability, low/out-of-stock, planogram alerts |
| Queue Intelligence | Queue length, wait/service time, prediction |
| Alerts | Severity, store, timestamp, acknowledgement/resolution |
| Reports | Daily/weekly KPIs and trends |
| Store Configuration | Cameras, zones, shelf layouts, thresholds |
| Users/Roles | Staff, manager, regional manager, admin |
| Multi-Store | Centralized store monitoring |

---

## 10. Feature 7 — Scalable Deployment + POS/ERP

Use Store ID, Edge ID, Camera ID and Product/SKU IDs from the beginning. The same architecture can represent one simulated store or many stores.

| Integration | Current prototype | Future |
|---|---|---|
| POS | Mock REST/JSON transactions | Real POS API |
| ERP | Mock inventory/product API | ERP connector |
| Stores | Multiple simulated Store IDs | Real branches |
| Edge | Docker on laptop | Edge device per store |
| Monitoring | Central React dashboard | Regional/global dashboard |

---

## 11. Backend & API Design

| Service | Example endpoints | Purpose |
|---|---|---|
| Auth | `POST /api/auth/login`; `GET /api/users` | Login/RBAC |
| Stores | `GET /api/stores`; `GET /api/stores/:id/cameras` | Configuration |
| Shopper | `GET /api/analytics/footfall`; `/dwell`; `/heatmap` | Shopper analytics |
| Inventory | `GET /api/inventory/status`; `/alerts`; `/products` | Inventory |
| Queue | `GET /api/queue/live`; `/history`; `/prediction` | Queue intelligence |
| Alerts | `GET /api/alerts`; `PATCH /api/alerts/:id` | Operational alerts |
| POS | `GET /api/pos/sales`; `POST /api/pos/events` | POS integration |
| ERP | `GET /api/erp/inventory`; `POST /api/erp/replenishment` | ERP integration |
| Edge | `POST /api/edge/events`; `POST /api/edge/sync` | Offline synchronization |

---

## 12. Database Design

- **stores:** storeId, name, location, configuration
- **cameras:** cameraId, storeId, type, source, zones, status
- **products:** productId, SKU, name, category, minimumFacing, planogram
- **shopper_events:** anonymousTrackId, zoneId, eventType, timestamp
- **inventory_events:** productId, shelfId, status, count, timestamp
- **queue_events:** counterId, queueLength, waitTime, serviceTime, timestamp
- **alerts:** type, severity, storeId, status, createdAt
- **users:** userId, role, permissions
- **daily_metrics:** storeId, date, footfall, dwell, stock and queue KPIs

---

## 13. Project Folder Structure

```
retailedge-ai/
├── frontend/            — React + TypeScript dashboard
├── backend/             — Node.js + Express APIs
├── ai-service/          — FastAPI + Python
│   ├── shopper/
│   ├── inventory/
│   ├── queue/
│   └── privacy/
├── edge-simulator/      — Docker + SQLite + sync
├── models/              — YOLO/XGBoost models
├── datasets/            — training/validation data
├── integrations/        — POS/ERP adapters
├── docker-compose.yml
└── README.md
```

---

## 14. Laptop + Android Phone Setup

**Laptop:** VS Code, Git, Python 3.x, Node.js LTS, npm, Docker Desktop, browser, MongoDB Atlas or local MongoDB. A GPU laptop is helpful but not mandatory; use smaller YOLO models and lower-resolution video on CPU.

**Phone:** Android phone with camera. Record entrance, shelf and checkout footage. Recorded MP4 is the easiest first input. Live streaming can be added later.

**No purchase required:** Jetson, CCTV, RFID, IoT sensors and dedicated edge devices are not needed for the first prototype.

---

## 15. Exact Development Roadmap

| Phase | Work | Target |
|---|---|---|
| 1 | Install tools; create Git/monorepo. | Development environment |
| 2 | Create React + Node/Express + FastAPI + MongoDB skeleton. | Connected application |
| 3 | OpenCV phone MP4/webcam pipeline. | Video input |
| 4 | YOLO person detection. | Detection |
| 5 | ByteTrack tracking. | Anonymous tracks |
| 6 | Entry/exit, zones, dwell and heatmap. | Feature 1 |
| 7 | Product dataset and YOLO model. | Product detection |
| 8 | Stock thresholds and planogram logic. | Feature 2 |
| 9 | Queue polygon, waiting/service metrics. | Queue analytics |
| 10 | XGBoost congestion model. | Feature 3 |
| 11 | Docker + SQLite offline buffer + sync. | Feature 4 |
| 12 | Anonymous IDs + JWT + RBAC. | Feature 5 |
| 13 | React + Socket.IO dashboard. | Feature 6 |
| 14 | Mock POS/ERP + Store/Edge IDs. | Feature 7 |
| 15 | End-to-end testing/demo. | All 7 integrated |

---

## 16. MVP Scope — Keep It Buildable

| Feature | First working target |
|---|---|
| Shopper | One video, one entrance line, 3 zones, footfall, dwell, heatmap |
| Inventory | 5–10 product classes, facing count, low/out-of-stock, simple planogram |
| Queue | One checkout, queue count, wait time, 3-class congestion prediction |
| Edge | Docker local inference + SQLite offline buffer + synchronization |
| Privacy | Anonymous IDs + no facial recognition + JWT/RBAC |
| Dashboard | Live KPIs, charts, heatmap, alerts and reports |
| Scalability | Multiple simulated stores + mock POS/ERP APIs |

---

## 17. Testing Plan

- **AI:** detection, tracking, product recognition, shelf status, queue count.
- **Performance:** FPS, inference latency, CPU/GPU and memory.
- **Reliability:** camera/video interruption, internet outage, restart and synchronization.
- **Security:** login, role permissions, token expiry and unauthorized APIs.
- **Privacy:** no facial identification and no unnecessary personal data.
- **Integration:** POS/ERP payloads and duplicate-event handling.

---

## 18. Future Migration to Real Hardware

After the laptop/phone prototype is stable, replace MP4/phone sources with IP/RTSP cameras, move the Docker edge service to Jetson Orin, optimize models with ONNX/TensorRT, keep SQLite as the local edge buffer and connect MQTT to the store network. The React dashboard, business APIs and data model can remain largely unchanged.

```
CURRENT: Phone/MP4 → Laptop Docker Edge → MongoDB → React
FUTURE:  IP Cameras → Jetson Edge → MQTT/Sync → Central Backend → React
```

---

## 19. Final Recommended Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Input | Android phone / webcam / MP4 | Video source |
| AI language | Python | CV and ML |
| Detection | YOLO + PyTorch | People/product detection |
| Tracking | ByteTrack | Anonymous tracking |
| Vision | OpenCV | Video processing |
| Prediction | XGBoost | Queue congestion |
| AI API | FastAPI | Inference endpoints |
| Backend | Node.js + Express | Application APIs |
| Frontend | React + TypeScript | Dashboard |
| UI | Tailwind CSS | Styling |
| Charts | Recharts | Analytics visualization |
| Realtime | Socket.IO | Live metrics/alerts |
| Database | MongoDB | Central data |
| Offline | SQLite | Local event queue |
| Messaging | MQTT | Edge messaging |
| Containers | Docker | Service packaging |
| Security | JWT + RBAC + HTTPS/TLS | Auth/access |
| Future edge | ONNX + TensorRT + Jetson | Hardware acceleration |
| Future video | GStreamer + RTSP | Production camera pipeline |

---

## 20. Final Implementation Strategy

Build every feature first with simulated/recorded inputs on the laptop. Integrate them into one dashboard. Then add offline buffering, privacy, authentication, multi-store IDs and mock POS/ERP integrations. Only after the software prototype is stable should physical edge hardware be introduced. This gives you a complete demonstration now while preserving a realistic production migration path.

**Final target:** one laptop + one Android phone → all seven features → integrated dashboard → offline edge simulation → privacy-aware analytics → scalable APIs → future-ready Jetson/CCTV deployment.
