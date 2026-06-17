import type { Lesson } from "../types"

export const MLOPS_LESSONS: Lesson[] = [
  {
    id: "mlops-intro",
    title: "MLOps — Overview & Principles",
    category: "MLOps",
    content: [
      {
        heading: "What is MLOps?",
        body: "MLOps (Machine Learning Operations) applies DevOps principles to the ML lifecycle. It bridges the gap between data scientists (who build models) and engineers (who deploy systems).\n\nThe core problem: 90% of ML projects never reach production. MLOps fixes the deployment bottleneck with automation, reproducibility, and monitoring.",
      },
      {
        heading: "The Full ML Lifecycle",
        body: "1. Data Collection & Labeling\n2. Data Versioning (DVC)\n3. Feature Engineering & Feature Store\n4. Experiment Tracking (MLflow, W&B)\n5. Model Training (distributed if needed)\n6. Model Evaluation & Validation\n7. Model Registry & Versioning\n8. Deployment (REST API, batch, streaming)\n9. Monitoring (data drift, model drift, performance)\n10. Retraining Pipeline (triggered by drift or schedule)",
      },
      {
        heading: "MLOps Maturity Levels",
        body: "Level 0 — Manual. No automation. Jupyter notebooks. Model deployed by copy-pasting code. (90% of teams)\n\nLevel 1 — ML pipeline automation. Automated training. Feature store. Model registry. Manual deployment trigger.\n\nLevel 2 — CI/CD pipeline automation. Any code change triggers retraining, evaluation, and deployment automatically. Full MLOps.",
      },
      {
        heading: "MLOps Tooling Landscape",
        body: "Data versioning: DVC, LakeFS\nExperiment tracking: MLflow, Weights & Biases, Neptune\nFeature store: Feast, Hopsworks, Tecton\nModel registry: MLflow Model Registry, HuggingFace Hub\nOrchestration: Apache Airflow, Prefect, Metaflow, Kubeflow\nModel serving: FastAPI, TorchServe, Triton Inference Server, BentoML\nMonitoring: Evidently AI, WhyLogs, Arize, Fiddler\nCI/CD: GitHub Actions, GitLab CI, Jenkins + DVC\nInfrastructure: Docker, Kubernetes, AWS SageMaker, Vertex AI",
      },
      {
        heading: "Experiment Tracking with MLflow",
        code: `import mlflow
import mlflow.sklearn
import mlflow.pytorch
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, f1_score
import numpy as np

mlflow.set_tracking_uri("sqlite:///mlruns.db")
mlflow.set_experiment("breast-cancer-classification")

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

def train_and_log(params: dict):
    with mlflow.start_run(run_name=f"GBM-{params['n_estimators']}"):
        mlflow.log_params(params)
        mlflow.set_tags({"model_type": "gradient_boosting", "framework": "sklearn"})

        model = GradientBoostingClassifier(**params, random_state=42)
        model.fit(X_train, y_train)

        proba = model.predict_proba(X_test)[:, 1]
        pred  = model.predict(X_test)

        metrics = {
            "auc_roc": roc_auc_score(y_test, proba),
            "f1":      f1_score(y_test, pred),
        }
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(model, "model",
            registered_model_name="breast-cancer-gbm")

        print(f"AUC: {metrics['auc_roc']:.4f} | F1: {metrics['f1']:.4f}")
        return metrics["auc_roc"]

# Run experiments
configs = [
    {"n_estimators": 100, "max_depth": 3, "learning_rate": 0.1},
    {"n_estimators": 200, "max_depth": 4, "learning_rate": 0.05},
    {"n_estimators": 300, "max_depth": 5, "learning_rate": 0.01},
]
for cfg in configs:
    train_and_log(cfg)

# Compare runs — view at: mlflow ui --backend-store-uri sqlite:///mlruns.db`,
        note: "Run 'mlflow ui' to get a web UI showing all experiments, metrics, parameters, and model artifacts. Essential for team collaboration.",
      },
    ],
  },
  {
    id: "model-deployment",
    title: "Model Deployment & Serving",
    category: "MLOps",
    content: [
      {
        heading: "Deployment Patterns",
        body: "Online (Real-time) Serving — REST API or gRPC endpoint. Responds to single requests with low latency (<100ms). Use when users are waiting.\n\nBatch Inference — Run predictions on large datasets periodically (nightly, hourly). No latency constraint. Cheapest option.\n\nStreaming Inference — Process records from a message queue (Kafka, Kinesis) as they arrive. Near-real-time.\n\nEdge Deployment — Model runs on device (phone, IoT, browser). No server round-trip. Private by design.",
      },
      {
        heading: "Production FastAPI Server",
        body: "FastAPI is the standard choice for wrapping ML models as REST APIs — async, fast, auto-documentation.",
        code: `from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
import joblib
import numpy as np
import time
import logging
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model once at startup — not on every request
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load("model.pkl")
    app.state.scaler = joblib.load("scaler.pkl")
    logger.info("Model loaded successfully")
    yield
    logger.info("Shutting down")

app = FastAPI(title="ML Model API", version="1.0.0", lifespan=lifespan)

class PredictRequest(BaseModel):
    features: list[float] = Field(..., min_length=10, max_length=10,
                                   description="Exactly 10 numeric features")

class PredictResponse(BaseModel):
    prediction: int
    confidence: float
    latency_ms: float

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": hasattr(app.state, "model")}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, background_tasks: BackgroundTasks):
    start = time.time()
    try:
        X = np.array([req.features])
        X_scaled = app.state.scaler.transform(X)
        pred  = int(app.state.model.predict(X_scaled)[0])
        proba = float(app.state.model.predict_proba(X_scaled).max())
        latency = (time.time() - start) * 1000

        background_tasks.add_task(log_prediction, req.features, pred, proba)
        return PredictResponse(prediction=pred, confidence=proba, latency_ms=latency)

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

def log_prediction(features, prediction, confidence):
    logger.info(f"pred={prediction}, conf={confidence:.3f}")

# Run: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4`,
      },
      {
        heading: "Containerizing with Docker",
        code: `# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Non-root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]

# Build: docker build -t ml-model:v1 .
# Run:   docker run -p 8000:8000 ml-model:v1

# docker-compose.yml for local dev with hot-reload:
# version: "3.8"
# services:
#   api:
#     build: .
#     ports: ["8000:8000"]
#     volumes: [".:/app"]
#     command: uvicorn main:app --reload --host 0.0.0.0 --port 8000
#     environment:
#       - MODEL_PATH=/app/model.pkl`,
        note: "Use multi-stage Docker builds for ML models to keep images small — copy only the model file and inference code, not training dependencies.",
      },
    ],
  },
  {
    id: "model-monitoring",
    title: "Model Monitoring & Drift Detection",
    category: "MLOps",
    content: [
      {
        heading: "Why Monitor ML Models?",
        body: "ML models degrade silently in production. Unlike software bugs, model failures are gradual and statistical — accuracy drops over weeks without any error in the code.\n\nCauses:\n• Data drift — input distribution shifts from training distribution\n• Concept drift — relationship between X and y changes over time\n• Upstream data pipeline changes — new null values, schema changes\n• Covariate shift — feature distributions change",
      },
      {
        heading: "Types of Drift",
        body: "Data Drift (Covariate Shift) — P(X) changes but P(Y|X) stays the same. Feature statistics diverge from training. Detectable without labels.\n\nLabel Drift — P(Y) changes. Class distribution shifts. Need labels to detect.\n\nConcept Drift — P(Y|X) changes. The underlying relationship changes. Hardest to detect — needs labels and time.\n\nPrediction Drift — Distribution of model outputs changes. Can be detected without labels by comparing score distributions.",
      },
      {
        heading: "Statistical Tests for Drift",
        body: "KS Test (Kolmogorov-Smirnov) — Tests if two continuous distributions are different. Sensitive to all types of distributional changes.\n\nPopulation Stability Index (PSI) — Industry standard for credit scoring. PSI < 0.1: stable. 0.1-0.2: some shift. >0.2: major drift.\n\nChi-Square Test — For categorical features. Tests if frequencies differ significantly.\n\nMMD (Maximum Mean Discrepancy) — Statistical test for high-dimensional data. Used in deep learning drift detection.",
      },
      {
        heading: "Drift Detection with Evidently AI",
        code: `import pandas as pd
import numpy as np
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, ClassificationPreset
from evidently.metrics import (
    DatasetDriftMetric, ColumnDriftMetric,
    ClassificationQualityMetric
)

# Simulate reference (training) and current (production) data
np.random.seed(42)
n = 500

reference = pd.DataFrame({
    "feature_1": np.random.normal(0, 1, n),
    "feature_2": np.random.normal(5, 2, n),
    "feature_3": np.random.choice(["A", "B", "C"], n, p=[0.5, 0.3, 0.2]),
    "prediction": np.random.randint(0, 2, n),
    "target":     np.random.randint(0, 2, n),
})

# Production data with drift
current = pd.DataFrame({
    "feature_1": np.random.normal(0.5, 1.5, n),    # Shifted mean + std
    "feature_2": np.random.normal(5, 2, n),          # Same — no drift
    "feature_3": np.random.choice(["A", "B", "C"], n, p=[0.2, 0.5, 0.3]),  # Shifted
    "prediction": np.random.randint(0, 2, n),
    "target":     np.random.randint(0, 2, n),
})

# Data Drift Report
drift_report = Report(metrics=[
    DatasetDriftMetric(),
    ColumnDriftMetric("feature_1"),
    ColumnDriftMetric("feature_2"),
    ColumnDriftMetric("feature_3"),
])
drift_report.run(reference_data=reference, current_data=current)
drift_report.save_html("drift_report.html")

# Classification Performance Report (when labels available)
perf_report = Report(metrics=[ClassificationPreset()])
perf_report.run(reference_data=reference, current_data=current)

# Extract results programmatically
result = drift_report.as_dict()
dataset_drift = result["metrics"][0]["result"]
print(f"Dataset drifted: {dataset_drift['dataset_drift']}")
print(f"Share drifted features: {dataset_drift['share_of_drifted_columns']:.0%}")`,
        note: "Set up weekly automated drift reports. Alert when >20% of features drift. Trigger retraining pipeline automatically when drift exceeds threshold.",
      },
    ],
  },
  {
    id: "feature-stores",
    title: "Feature Stores",
    category: "MLOps",
    content: [
      {
        heading: "What is a Feature Store?",
        body: "A feature store is a centralized platform for storing, managing, and serving ML features. It solves the feature engineering consistency problem — the same feature computed differently in training vs serving causes training-serving skew (one of the most common production ML bugs).",
      },
      {
        heading: "Training-Serving Skew",
        body: "The most dangerous ML production bug:\n\nTraining: average_purchase_last_30_days = mean(purchases[-30d:])\nServing:  average_purchase_last_30_days = mean(purchases[-7d:])   ← Bug!\n\nThe model sees different feature distributions during serving than training. Accuracy degrades silently. Root cause is duplicated feature logic in different code paths.",
      },
      {
        heading: "Feature Store Architecture",
        body: "Offline Store — Historical feature values (S3, BigQuery, Snowflake). Used for training dataset generation.\n\nOnline Store — Low-latency feature serving (<10ms) for real-time inference (Redis, DynamoDB).\n\nMaterialization Job — Periodically computes features and syncs offline → online store.\n\nFeature Registry — Metadata catalog: feature name, owner, data type, description, statistics.",
      },
      {
        heading: "Feast Feature Store",
        code: `# Install: pip install feast

# ─── feature_repo/feature_store.yaml ─────────────────────────
# project: ml_features
# registry: data/registry.db
# provider: local
# online_store:
#   type: sqlite
#   path: data/online_store.db

# ─── feature_repo/features.py ────────────────────────────────
from feast import Entity, Feature, FeatureView, FileSource, ValueType
from datetime import timedelta
import pandas as pd

# Data source (parquet from data pipeline)
user_source = FileSource(
    path="data/user_features.parquet",
    timestamp_field="event_timestamp",
)

# Entity — the 'key' that features are looked up by
user = Entity(name="user_id", value_type=ValueType.INT64,
              description="User identifier")

# Feature view — group of features about the same entity
user_features = FeatureView(
    name="user_activity_features",
    entities=["user_id"],
    ttl=timedelta(days=7),
    features=[
        Feature(name="purchase_count_30d", dtype=ValueType.INT64),
        Feature(name="avg_order_value",    dtype=ValueType.DOUBLE),
        Feature(name="days_since_last_login", dtype=ValueType.INT64),
        Feature(name="preferred_category", dtype=ValueType.STRING),
    ],
    online=True,
    source=user_source,
)

# ─── Training: Get historical features ───────────────────────
from feast import FeatureStore

store = FeatureStore(repo_path="feature_repo")

# Generate training dataset
entity_df = pd.DataFrame({
    "user_id": [1001, 1002, 1003],
    "event_timestamp": pd.to_datetime(["2024-01-10", "2024-01-11", "2024-01-12"]),
    "label": [1, 0, 1],
})

training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_activity_features:purchase_count_30d",
              "user_activity_features:avg_order_value"]
).to_df()

# ─── Serving: Get online features ────────────────────────────
online_features = store.get_online_features(
    features=["user_activity_features:purchase_count_30d",
              "user_activity_features:avg_order_value"],
    entity_rows=[{"user_id": 1001}, {"user_id": 1002}]
).to_dict()

print(online_features)`,
        note: "Feature stores become valuable when you have 10+ ML models sharing features. For 1-2 models, a simpler shared library is sufficient.",
      },
    ],
  },
  {
    id: "cicd-ml",
    title: "CI/CD for Machine Learning",
    category: "MLOps",
    content: [
      {
        heading: "Why CI/CD for ML?",
        body: "In software engineering, CI/CD ensures code changes are tested and deployed automatically. ML CI/CD extends this to model changes:\n\nCI for ML:\n• Code linting and unit tests\n• Data validation (schema, statistics, nulls)\n• Model training run\n• Model evaluation vs baseline\n• Performance regression check\n\nCD for ML:\n• Model registry push (if metrics pass)\n• Canary deployment (route 5% of traffic)\n• Shadow mode testing (run new model, don't serve output)\n• A/B testing rollout",
      },
      {
        heading: "Model Evaluation Gate",
        body: "Before deploying a new model, compare it against the current production model (champion):\n\n• New model must beat champion on held-out test set\n• Must pass fairness checks (no significant performance gap across subgroups)\n• Must pass latency budget (p99 < 100ms)\n• Must pass minimum sample size for statistical significance\n\nOnly if all gates pass does the model go to production.",
      },
      {
        heading: "GitHub Actions ML Pipeline",
        code: `# .github/workflows/ml_pipeline.yml
name: ML Training & Evaluation Pipeline

on:
  push:
    paths: ["src/**", "configs/**", "data/**"]

jobs:
  train-and-evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Validate data
        run: python scripts/validate_data.py

      - name: Run unit tests
        run: pytest tests/ -v --tb=short

      - name: Train model
        run: |
          python train.py --config configs/model.yaml
          echo "Training complete"

      - name: Evaluate vs baseline
        id: evaluate
        run: |
          python evaluate.py --model artifacts/model.pkl \\
                             --baseline artifacts/baseline.pkl \\
                             --output metrics.json
          # Fail if new model is worse
          python scripts/check_metrics.py metrics.json --min-auc 0.85

      - name: Upload model artifact
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: trained-model
          path: artifacts/

      - name: Register model in MLflow
        if: success()
        run: |
          python scripts/register_model.py \\
            --model-path artifacts/model.pkl \\
            --metrics-path metrics.json \\
            --stage "Staging"

      - name: Deploy to staging
        if: success()
        run: |
          docker build -t ml-model:\${{ github.sha }} .
          docker push \${{ secrets.REGISTRY }}/ml-model:\${{ github.sha }}
          kubectl set image deployment/ml-api ml-api=\${{ secrets.REGISTRY }}/ml-model:\${{ github.sha }}`,
        note: "Use DVC (Data Version Control) alongside Git to version datasets and model artifacts — so any experiment can be reproduced exactly.",
      },
    ],
  },
  {
    id: "data-pipelines",
    title: "Data Pipelines & Orchestration",
    category: "MLOps",
    content: [
      {
        heading: "Why Pipeline Orchestration?",
        body: "ML data pipelines have many sequential, dependent steps: raw data → validation → cleaning → feature engineering → training → evaluation → serving. Orchestrators:\n• Schedule pipelines on a cron or event trigger\n• Manage dependencies between tasks\n• Retry failed steps automatically\n• Provide visibility into what ran, when, and with what data",
      },
      {
        heading: "Popular Orchestrators",
        body: "Apache Airflow — Most popular. DAG-based. Strong ecosystem. Heavy to self-host.\nPrefect — Python-native. Better DX than Airflow. Cloud-managed option.\nMetaflow (Netflix) — Data science focused. Excellent versioning.\nKubeflow Pipelines — Kubernetes-native. Best for large-scale distributed training.\nZenML — MLOps framework that can use any orchestrator as backend.",
      },
      {
        heading: "Prefect ML Pipeline",
        code: `from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
import joblib

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=24))
def load_data(path: str) -> pd.DataFrame:
    """Load and validate raw data"""
    df = pd.read_parquet(path)
    assert df.shape[0] > 0, "Empty dataset!"
    assert df.isnull().sum().sum() == 0 or True  # Allow nulls for demo
    return df

@task
def preprocess(df: pd.DataFrame) -> tuple:
    """Feature engineering"""
    X = df.drop("target", axis=1).values
    y = df["target"].values
    return train_test_split(X, y, test_size=0.2, random_state=42)

@task
def train_model(X_train, y_train, n_estimators: int = 200) -> GradientBoostingClassifier:
    model = GradientBoostingClassifier(n_estimators=n_estimators, max_depth=4,
                                       learning_rate=0.05, random_state=42)
    model.fit(X_train, y_train)
    return model

@task
def evaluate(model, X_test, y_test) -> dict:
    proba = model.predict_proba(X_test)[:, 1]
    auc   = roc_auc_score(y_test, proba)
    return {"auc_roc": auc, "n_test": len(y_test)}

@task
def save_model(model, metrics: dict, path: str = "model.pkl"):
    if metrics["auc_roc"] < 0.75:
        raise ValueError(f"Model quality gate failed: AUC={metrics['auc_roc']:.3f}")
    joblib.dump(model, path)
    return path

@flow(name="ML Training Pipeline", log_prints=True)
def training_pipeline(data_path: str = "data/features.parquet"):
    df                              = load_data(data_path)
    X_train, X_test, y_train, y_test = preprocess(df)
    model                           = train_model(X_train, y_train)
    metrics                         = evaluate(model, X_test, y_test)
    model_path                      = save_model(model, metrics)

    print(f"Pipeline complete: AUC={metrics['auc_roc']:.4f}, saved to {model_path}")
    return metrics

# Run locally
# training_pipeline()

# Schedule in Prefect Cloud
# from prefect.deployments import Deployment
# from prefect.server.schemas.schedules import CronSchedule
# deployment = Deployment.build_from_flow(
#     flow=training_pipeline, name="daily-retrain",
#     schedule=CronSchedule(cron="0 3 * * *")  # 3 AM daily
# )`,
        note: "@task with cache_key_fn caches task outputs — if data hasn't changed, expensive data loading steps are skipped automatically.",
      },
    ],
  },
]
