# RetailEdge AI / IRIS — Model Training Guide

This guide covers training and fine-tuning models for retail store deployments.

## 1. Base Models (Out of the Box)

Download the person detection weights using:
```bash
python scripts/download_models.py
```
This saves `models/person/yolo11n.pt` and enables real-time shopper tracking.

## 2. Queue Congestion Model Training

Train the congestion classifier using collected observations:
```bash
python training/train_queue.py
```
Outputs:
- `models/queue/queue_congestion.joblib`
- `models/queue/queue_scaler.joblib`
- `models/queue/queue_classes.json`

## 3. Product & Shelf Model Fine-Tuning

### Step A: Dataset Preparation
1. Capture photos/videos of your store shelves using an Android phone or camera.
2. Label bounding boxes using `dataset_tools/annotate_tool.py` or Roboflow/CVAT.
3. Validate label splits:
   ```bash
   python -c "from dataset_tools.validate_dataset import validate_split; print(validate_split('datasets/processed/sku110k_yolo/train'))"
   ```

### Step B: Train YOLO Product Detector
```bash
python training/train_product.py
```
The script will train on your shelf dataset and place the best checkpoint into `models/product/product_yolo.pt`.
