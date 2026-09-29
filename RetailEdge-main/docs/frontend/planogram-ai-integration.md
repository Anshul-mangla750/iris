# Planogram Computer Vision & AI Integration Architecture

## Architecture Overview
The Products & Planogram module acts as the **configuration and operational management interface**, while the AI/ML pipeline provides automated computer vision inference from in-store cameras.

The frontend **never** connects directly to camera feeds, edge devices, or OpenCV/YOLO inference models. All AI insights flow through the centralized backend service layer.

```
┌─────────────────────┐
│ In-Store Overhead   │
│ & Shelf Cameras     │
└──────────┬──────────┘
           │ RTSP Video Stream
           ▼
┌─────────────────────┐
│ Edge AI Appliance   │ (YOLOv8 / Shelf Object Detection)
└──────────┬──────────┘
           │ Detected Bounding Boxes & Confidence Scores
           ▼
┌─────────────────────┐
│ AI Integration API  │
│ Gateway             │
└──────────┬──────────┘
           │ Normalized Shelf Placement Events
           ▼
┌─────────────────────┐
│ RetailEdge Core API │
│ & Planogram Engine  │
└──────────┬──────────┘
           │ REST API / WebSocket Events
           ▼
┌─────────────────────┐
│ RetailEdge Frontend │ (/products-planogram & /planogram)
└─────────────────────┘
```

---

## AI Detection Capabilities

1. **Product Placement & Localization**
   - Detects brand, SKU packaging, and coordinate bounding boxes within shelf rows.
2. **Missing Product Detection**
   - Identifies empty gaps in planned facing positions.
3. **Misplaced Product Detection**
   - Compares detected SKU barcodes/facings against the canonical planogram schema.
4. **Extra Product Detection**
   - Identifies unexpected items intruding on designated shelf space.
5. **Shelf Occupancy & Facing Compliance Rate**
   - Computes real-time compliance percentage:
     $$\text{Compliance Rate} = \frac{\text{Correct Facings}}{\text{Total Planned Facings}} \times 100$$

---

## Canonical AI Inference Payload Schema

When a compliance check completes on the edge or backend, the system emits an update consumed by the frontend:

```json
{
  "planogramId": "plano-snacks",
  "storeId": "store-001",
  "aisle": "Aisle 2",
  "complianceRate": 96,
  "metrics": {
    "correct": 48,
    "misplaced": 3,
    "missing": 5,
    "extra": 2
  },
  "detections": [
    {
      "shelfId": "shelf-4",
      "position": 1,
      "expectedSku": "LAY003",
      "detectedSku": "LAY003",
      "status": "Correct",
      "confidence": 0.98,
      "facingCount": 12
    },
    {
      "shelfId": "shelf-3",
      "position": 2,
      "expectedSku": "LAY005",
      "detectedSku": "HAL001",
      "status": "Misplaced",
      "confidence": 0.92,
      "facingCount": 10
    }
  ],
  "lastCheckedAt": "2024-09-24T10:30:00Z"
}
```

---

## Cross-Module Integration

- **Inventory Monitoring (`/inventory`)**: Stock level updates detected on shelf reflect directly on catalog stock quantities.
- **Alerts Operations Center (`/alerts`)**: Critical violations (e.g., `< 80%` compliance or high-value misplaced items) trigger centralized alerts with deep links to the affected planogram.
- **Planogram Compliance (`/planogram`)**: Detailed historical compliance trends, camera feed snapshots, and resolution workflows reside in the dedicated compliance analytics view.
