"""Model G — Queue congestion model (XGBoost or sklearn fallback).

A real ML model trained ONLY on observations collected from actual camera
tracking (queue_observations table / dataset queue CSV). If no trained model
exists, predictions return MODEL_NOT_TRAINED — never fabricated states.

Features:
    queue_length, arrival_rate, service_rate, active_counters, average_wait,
    rolling_queue_5m, rolling_queue_10m, hour, day_of_week

Labels: documented operational thresholds (config):
    queue_length >= queue_high_threshold            → HIGH
    queue_length >= queue_warning_threshold         → WARNING
    else                                            → NORMAL
"""
from __future__ import annotations

import threading
from pathlib import Path
from typing import Any

import numpy as np

from app.core.config import settings
from app.core.logging_config import get_logger
from app.models.model_manager import get_model_manager

logger = get_logger(__name__)

FEATURES = [
    "queue_length", "arrival_rate", "service_rate", "active_counters",
    "average_wait", "rolling_queue_5m", "rolling_queue_10m", "hour", "day_of_week",
]
CLASSES = ["NORMAL", "WARNING", "HIGH"]

# Features the MODEL may actually learn from. queue_length (and its rolling
# averages) are EXCLUDED: the label is derived from queue_length thresholds, so
# including it lets the model copy the rule → fake 1.0 accuracy. Real signal
# must come from context (arrivals vs service capacity, time of day) so the
# model can warn BEFORE the queue physically builds up.
PREDICTOR_FEATURES = [
    "arrival_rate", "service_rate", "active_counters",
    "average_wait", "hour", "day_of_week",
]


def label_from_thresholds(queue_length: float, high: float | None = None,
                          warning: float | None = None) -> str:
    """Documented operational labeling rule used for training data generation."""
    high = settings.queue_high_threshold if high is None else high
    warning = settings.queue_warning_threshold if warning is None else warning
    if queue_length >= high:
        return "HIGH"
    if queue_length >= warning:
        return "WARNING"
    return "NORMAL"


class QueueCongestionModel:
    """Loads/holds the trained congestion classifier; predicts with confidence."""

    def __init__(self) -> None:
        self.mm = get_model_manager()
        self.model: Any | None = None
        self.scaler: Any | None = None
        self._lock = threading.Lock()

    def ensure_loaded(self) -> bool:
        info = self.mm.get("QUEUE_MODEL")
        if info is None or info.status == "DISABLED":
            return False
        if info.status == "READY":
            return True
        self.mm.load("QUEUE_MODEL")
        info = self.mm.get("QUEUE_MODEL")
        if info.status != "READY":
            return False
        self.model = info.loaded_obj
        scaler_path = Path(settings.queue_model_scaler_path)
        if scaler_path.exists():
            import joblib

            self.scaler = joblib.load(scaler_path)
        return True

    @property
    def is_trained(self) -> bool:
        info = self.mm.get("QUEUE_MODEL")
        return bool(info and info.status == "READY")

    def _vectorize(self, features: dict[str, Any]) -> np.ndarray:
        row = []
        for f in PREDICTOR_FEATURES:
            v = features.get(f, 0.0)
            row.append(float(v) if v is not None else 0.0)
        arr = np.array([row], dtype=np.float64)
        if self.scaler is not None:
            arr = self.scaler.transform(arr)
        return arr

    def predict(self, features: dict[str, Any]) -> dict:
        """Predict congestion state. Honest MODEL_NOT_TRAINED when absent."""
        if not self.ensure_loaded():
            return {"prediction": "MODEL_NOT_TRAINED", "confidence": None,
                    "probabilities": None, "model_version": None}
        try:
            X = self._vectorize(features)
            pred = str(self.model.predict(X)[0])
            proba = None
            if hasattr(self.model, "predict_proba"):
                p = self.model.predict_proba(X)[0]
                classes = [str(c) for c in getattr(self.model, "classes_", CLASSES)]
                proba = {c: round(float(v), 3) for c, v in zip(classes, p)}
            info = self.mm.get("QUEUE_MODEL")
            return {"prediction": pred,
                    "confidence": proba.get(pred) if proba else None,
                    "probabilities": proba,
                    "model_version": info.version or "v1"}
        except Exception as exc:
            logger.error("queue prediction failed: %s", exc)
            return {"prediction": "DATA_NOT_AVAILABLE", "confidence": None,
                    "probabilities": None, "model_version": None}

    # ------------------------------------------------------------ training
    def train(self, rows: list[dict], out_dir: Path | None = None,
              test_size: float = 0.2, seed: int = 42) -> dict:
        """Train from real observation rows (schema of queue_observations).

        Requires at least 30 rows and at least 2 distinct labels to train honestly.
        """
        if len(rows) < 30:
            return {"ok": False, "error": f"insufficient data: {len(rows)} rows (<30). "
                                          "Collect more real observations first."}
        labels = {r.get("label") for r in rows}
        if len(labels) < 2:
            return {"ok": False, "error": f"only one label present ({labels}); "
                                          "cannot train a classifier on single-class data."}
        X = np.array([[float(r.get(f, 0.0) or 0.0) for f in PREDICTOR_FEATURES]
                      for r in rows])
        y = np.array([str(r["label"]) for r in rows])

        # TEMPORAL split — never shuffle. Rows are recorded ~1s apart, so near-
        # duplicate rows land in BOTH sides of a random split and the model just
        # copies the episode → fake ~1.0 accuracy. Both callers order rows by
        # timestamp; train on the oldest (1-test_size) slice, test on the newest.
        order = np.argsort([float(r.get("timestamp", 0.0) or 0.0) for r in rows])
        X, y = X[order], y[order]
        n_test = max(1, int(len(X) * test_size))
        split = len(X) - n_test
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        from sklearn.metrics import (accuracy_score, confusion_matrix, f1_score,
                                     precision_score, recall_score)

        scaler = None
        import joblib

        # XGBoost preferred; sklearn HistGradientBoosting as dependency-light fallback
        model = None
        try:
            from xgboost import XGBClassifier

            # encode labels for xgb
            classes = sorted(set(y_train) | set(y_test))
            cmap = {c: i for i, c in enumerate(classes)}
            model = XGBClassifier(
                n_estimators=200, max_depth=4, learning_rate=0.1,
                eval_metric="mlogloss", random_state=seed)
            model.fit(X_train, np.array([cmap[c] for c in y_train]))
            pred = [classes[i] for i in model.predict(X_test)]
            model_type = "xgboost"
            joblib.dump({"classes": classes}, Path(settings.queue_model_path).parent
                        / "queue_classes.json")
        except ImportError:
            from sklearn.ensemble import HistGradientBoostingClassifier
            from sklearn.preprocessing import StandardScaler

            scaler = StandardScaler().fit(X_train)
            X_train_s = scaler.transform(X_train)
            X_test_s = scaler.transform(X_test)
            model = HistGradientBoostingClassifier(random_state=seed, max_iter=200)
            model.fit(X_train_s, y_train)
            pred = model.predict(X_test_s)
            model_type = "sklearn_hist_gb"

        metrics = {
            "feature_note": ("trained without queue_length/rolling features "
                             "(label-leak prevention); temporal split, no shuffle"),
            "split": "temporal_last_{:.0f}pct".format(test_size * 100),
            "accuracy": round(float(accuracy_score(y_test, pred)), 4),
            "precision": round(float(precision_score(y_test, pred, average="weighted",
                                                     zero_division=0)), 4),
            "recall": round(float(recall_score(y_test, pred, average="weighted",
                                               zero_division=0)), 4),
            "f1": round(float(f1_score(y_test, pred, average="weighted",
                                       zero_division=0)), 4),
            "f1_macro": round(float(f1_score(y_test, pred, average="macro",
                                            zero_division=0)), 4),
            "confusion_matrix": confusion_matrix(
                y_test, pred, labels=sorted(set(y_test) | set(pred))).tolist(),
            "labels": sorted(set(y_test) | set(pred)),
            "model_type": model_type,
            "train_rows": int(len(X_train)),
            "test_rows": int(len(X_test)),
        }

        # persist dataset + metrics + model card data
        out_dir = out_dir or Path(settings.queue_model_path).parent
        out_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, settings.queue_model_path)
        if scaler is not None:
            joblib.dump(scaler, settings.queue_model_scaler_path)
        import csv

        with open(out_dir / "queue_training_dataset.csv", "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=FEATURES + ["label"])
            w.writeheader()
            for r in rows:
                w.writerow({**{f: r.get(f, 0.0) for f in FEATURES}, "label": r["label"]})
        import json

        (out_dir / "queue_training_metrics.json").write_text(json.dumps(metrics, indent=2))

        # register in ModelManager
        info = self.mm.get("QUEUE_MODEL")
        if info:
            info.status = "READY"
            info.loaded_obj = model
            info.last_loaded = __import__("time").time()
            info.detail = f"trained on {len(rows)} real observations ({model_type})"
            info.version = f"v{int(__import__('time').time())}"
        self.model = model
        self.scaler = scaler
        return {"ok": True, "metrics": metrics, "model_type": model_type}


_queue_model: QueueCongestionModel | None = None


def get_queue_model() -> QueueCongestionModel:
    global _queue_model
    if _queue_model is None:
        _queue_model = QueueCongestionModel()
    return _queue_model
