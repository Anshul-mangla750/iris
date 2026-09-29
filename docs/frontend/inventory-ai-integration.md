# Inventory Monitoring AI/Edge Integration Contract

## AI Telemetry Payload

### 1. Real-time Shelf Detections
```json
{
  "storeId": "store-001",
  "aisleId": "aisle-2",
  "cameraId": "cam-shelf-01",
  "timestamp": "2024-09-24T15:20:00.000Z",
  "detections": [
    {
      "productId": "prod-maggi-01",
      "label": "Low Stock",
      "status": "Low Stock",
      "detectedQuantity": 2,
      "expectedQuantity": 10,
      "boundingBox": { "x": 46, "y": 45, "width": 23, "height": 36 }
    },
    {
      "productId": "empty-slot-01",
      "label": "Out of Stock",
      "status": "Out of Stock",
      "detectedQuantity": 0,
      "expectedQuantity": 8,
      "boundingBox": { "x": 24, "y": 5, "width": 20, "height": 30 }
    }
  ]
}
```

### 2. Shelf Health Thermal Map
```json
{
  "shelfId": "shelf-02-snacks",
  "healthScore": 94,
  "imageUrl": "/images/inventory/shelf_health.png",
  "hotspots": [
    { "zone": "top-shelf", "status": "WELL_STOCKED" },
    { "zone": "middle-shelf-center", "status": "LOW_STOCK" },
    { "zone": "middle-shelf-left", "status": "OUT_OF_STOCK" }
  ]
}
```
