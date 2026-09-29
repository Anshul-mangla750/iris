# Queue Intelligence AI/ML Integration Contract

## Overview
This document defines the expected data structures and contract interfaces for integration between the **RetailEdge AI Edge/Computer Vision service**, **ML Forecasting models (XGBoost/LightGBM)**, and the **Queue Intelligence Frontend**.

> **CRITICAL RULE**: The frontend DOES NOT run inference, YOLO, OpenCV, or XGBoost code in the browser. It strictly visualizes structured JSON telemetry produced by the edge inference workers and prediction pipelines.

---

## 1. Edge Camera Telemetry & Detection Contract
Edge cameras stationed above checkout lanes process customer count and lane dwell time.

### Topic / Endpoint Payload
```json
{
  "storeId": "store-001",
  "cameraId": "cam-checkout-overhead-01",
  "timestamp": "2024-09-24T15:22:00.000Z",
  "peopleInFrame": 20,
  "counters": [
    {
      "counterId": "cnt-1",
      "counterName": "Counter 1",
      "queueLength": 8,
      "avgWaitTime": 8.0,
      "congestionRisk": 85,
      "status": "High"
    },
    {
      "counterId": "cnt-2",
      "counterName": "Counter 2",
      "queueLength": 3,
      "avgWaitTime": 3.0,
      "congestionRisk": 35,
      "status": "Normal"
    },
    {
      "counterId": "cnt-3",
      "counterName": "Counter 3",
      "queueLength": 0,
      "avgWaitTime": 0.0,
      "congestionRisk": 10,
      "status": "Open"
    },
    {
      "counterId": "cnt-4",
      "counterName": "Counter 4",
      "queueLength": 7,
      "avgWaitTime": 12.0,
      "congestionRisk": 80,
      "status": "High"
    },
    {
      "counterId": "cnt-5",
      "counterName": "Counter 5",
      "queueLength": 2,
      "avgWaitTime": 2.0,
      "congestionRisk": 25,
      "status": "Normal"
    }
  ]
}
```

---

## 2. ML Prediction Contract (XGBoost / Regression Pipeline)
Predictions are periodically updated by a background ML inference worker.

### Payload Schema
```json
{
  "storeId": "store-001",
  "generatedAt": "2024-09-24T15:20:00.000Z",
  "horizonMinutes": 120,
  "predictions": [
    {
      "time": "Now",
      "predicted": 8,
      "lowerBound": 6,
      "upperBound": 10
    },
    {
      "time": "15 min",
      "predicted": 11,
      "lowerBound": 8,
      "upperBound": 13
    },
    {
      "time": "30 min",
      "predicted": 14,
      "lowerBound": 11,
      "upperBound": 17
    },
    {
      "time": "45 min",
      "predicted": 12,
      "lowerBound": 9,
      "upperBound": 15
    },
    {
      "time": "1 hr",
      "predicted": 10,
      "lowerBound": 7,
      "upperBound": 13
    },
    {
      "time": "1.5 hr",
      "predicted": 9,
      "lowerBound": 6,
      "upperBound": 12
    },
    {
      "time": "2 hr",
      "predicted": 11,
      "lowerBound": 8,
      "upperBound": 14
    }
  ]
}
```

---

## 3. Realtime Socket.IO Events
The frontend listens for the following WebSocket events when connected:
- `queue.updated`: Emitted when any counter queue count or wait time shifts.
- `queue.congestion_alert`: Emitted when queue length exceeds threshold (`>= 8 people`).
- `queue.cleared`: Emitted when congestion is resolved.
- `prediction.updated`: Periodic updates for 2-hour queue predictions.
