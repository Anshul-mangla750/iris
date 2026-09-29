# Model Card: RetailEdge AI (IRIS)

## Model Overview
- **Model Name:** RetailEdge AI Perception Suite
- **Version:** 1.0.0
- **Supported Hardware:** Laptop CPU (multi-threaded Intel/AMD), NVIDIA Jetson, CUDA GPU
- **Primary Use Case:** Real-time edge retail analytics (shopper footfall, dwell time, queue forecasting, shelf audits)

## Benchmark & Performance Metrics

| Model | Architecture | Measured Latency (CPU) | Accuracy / mAP | Status |
|---|---|---|---|---|
| Person Detector | YOLOv11 nano | ~264 ms | mAP50 0.52 (COCO) | **READY** |
| Queue Classifier | Sklearn HistGradientBoosting / XGBoost | < 2 ms | Accuracy 1.0, F1 1.0 | **READY** |
| Product Detector | Fine-tuned YOLOv11 | ~280 ms | Custom Shelf Data | Configurable |

## Ethical & Privacy Considerations
- **No Facial Recognition:** The perception pipeline strictly discards facial features and produces anonymous track tokens (`PERSON_001`).
- **Data Minimization:** Continuous video streams are processed in RAM and discarded; only structured aggregate telemetry (counts, timestamps) is retained.
