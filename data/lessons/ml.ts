import type { Lesson } from "../types"

export const ML_LESSONS: Lesson[] = [
  {
    id: "what-is-ml",
    title: "What is Machine Learning?",
    category: "Machine Learning",
    content: [
      {
        heading: "Definition",
        body: "Machine Learning (ML) is a subset of Artificial Intelligence that gives computers the ability to learn from data and improve performance on tasks without being explicitly programmed. Instead of writing hand-crafted rules, you show the algorithm examples and it discovers patterns automatically.",
      },
      {
        heading: "Three Core Types of ML",
        body: "Supervised Learning — Model trains on labeled input-output pairs (X → y). Examples: spam detection, price prediction, image classification.\n\nUnsupervised Learning — Model finds hidden structure in unlabeled data. Examples: customer segmentation, anomaly detection, PCA.\n\nReinforcement Learning — Agent learns by interacting with an environment, receiving rewards or penalties. Examples: game playing (AlphaGo), robotics, ad bidding.",
      },
      {
        heading: "The Standard ML Workflow",
        body: "1. Define the problem and success metric\n2. Collect and label data\n3. Exploratory Data Analysis (EDA)\n4. Feature engineering and preprocessing\n5. Choose and train a model\n6. Evaluate on held-out test data\n7. Hyperparameter tuning\n8. Deploy and monitor",
      },
      {
        heading: "Example: Linear Regression",
        body: "The simplest supervised learning model — fits a line to data to predict continuous values.",
        code: `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Simulate: hours studied → exam score
np.random.seed(42)
X = np.random.uniform(1, 10, (100, 1))
y = 5 * X.squeeze() + np.random.normal(0, 3, 100) + 30

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"Coefficient (slope): {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"MSE: {mean_squared_error(y_test, y_pred):.2f}")
print(f"R² Score: {r2_score(y_test, y_pred):.3f}")`,
        note: "R² of 1.0 means perfect prediction. R² of 0 means the model is no better than predicting the mean.",
      },
    ],
  },
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    category: "Machine Learning",
    content: [
      {
        heading: "What is Gradient Descent?",
        body: "Gradient Descent is the core optimization algorithm for training ML models. It minimizes a loss function L(w) by iteratively adjusting weights in the direction of steepest descent (negative gradient).\n\nUpdate rule: w ← w − α · ∇L(w)\n\nWhere α is the learning rate and ∇L(w) is the gradient of the loss.",
      },
      {
        heading: "Three Variants",
        body: "Batch GD — Computes gradient on the full dataset. Accurate but extremely slow for large datasets.\n\nStochastic GD (SGD) — Computes gradient on one sample at a time. Fast updates but very noisy — oscillates around the minimum.\n\nMini-Batch GD — Uses batches of 32–512 samples. Best of both: stable convergence, GPU-friendly. Used in all deep learning frameworks.",
      },
      {
        heading: "Learning Rate: The Critical Hyperparameter",
        body: "Too high → loss explodes or oscillates, never converges.\nToo low → converges extremely slowly, may get stuck in local minima.\n\nSolutions: Learning rate schedules (step decay, cosine annealing), adaptive optimizers (Adam, RMSprop).",
      },
      {
        heading: "Gradient Descent from Scratch",
        code: `import numpy as np
import matplotlib.pyplot as plt

# Minimize f(w) = w^2 (minimum at w=0)
def loss(w): return w ** 2
def gradient(w): return 2 * w

def gradient_descent(w_init=10.0, lr=0.1, epochs=50):
    w = w_init
    history = []
    for i in range(epochs):
        grad = gradient(w)
        w = w - lr * grad
        history.append((i, w, loss(w)))
        if i % 10 == 0:
            print(f"Epoch {i:3d}: w={w:.6f}  loss={loss(w):.8f}")
    return w, history

# Compare learning rates
for lr in [0.01, 0.1, 0.5, 1.1]:
    w_final, _ = gradient_descent(lr=lr, epochs=30)
    print(f"lr={lr}: final w = {w_final:.4f}")`,
        note: "lr=1.1 > 1.0 for f(w)=w² causes divergence — the weight bounces away from the minimum.",
      },
      {
        heading: "Momentum and Adam",
        body: "Momentum accelerates SGD by accumulating a velocity vector:\nv ← βv − α∇L;  w ← w + v\n\nAdam (Adaptive Moment Estimation) combines momentum + adaptive learning rates per parameter. It's the default optimizer for most deep learning tasks.",
        code: `import torch
import torch.nn as nn

# PyTorch optimizers
model = nn.Linear(10, 1)

sgd      = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
adam     = torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999))
rmsprop  = torch.optim.RMSprop(model.parameters(), lr=0.01, alpha=0.99)

# Cosine annealing schedule
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(adam, T_max=100)`,
      },
    ],
  },
  {
    id: "bias-variance",
    title: "Bias-Variance Tradeoff",
    category: "Machine Learning",
    content: [
      {
        heading: "Decomposing Prediction Error",
        body: "The expected prediction error decomposes into three terms:\n\nError = Bias² + Variance + Irreducible Noise\n\nBias — Error from wrong assumptions (model too simple). Underfitting.\nVariance — Error from sensitivity to training data fluctuations (model too complex). Overfitting.\nIrreducible Noise — Inherent data noise, cannot be reduced by any model.",
      },
      {
        heading: "Bias (Underfitting)",
        body: "High-bias models make strong assumptions and miss the true pattern.\n\nSigns: Training error is high. Test error ≈ training error.\nCauses: Model too simple (e.g., linear model on non-linear data), too few features.\nFix: More complex model, more features, reduce regularization.",
      },
      {
        heading: "Variance (Overfitting)",
        body: "High-variance models memorize training data including noise.\n\nSigns: Training error very low, test error much higher.\nCauses: Model too complex (deep tree, large neural network), too little data.\nFix: More data, regularization (L1/L2/dropout), simpler model, early stopping, cross-validation.",
      },
      {
        heading: "Demonstrating the Tradeoff",
        code: `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

np.random.seed(42)
X = np.linspace(0, 1, 100).reshape(-1, 1)
y = np.sin(2 * np.pi * X).ravel() + np.random.normal(0, 0.2, 100)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

for degree in [1, 3, 9, 15]:
    model = make_pipeline(PolynomialFeatures(degree), Ridge(alpha=1e-4))
    model.fit(X_train, y_train)
    train_err = np.mean((model.predict(X_train) - y_train)**2)
    test_err  = np.mean((model.predict(X_test)  - y_test)**2)
    print(f"Degree {degree:2d}: Train MSE={train_err:.4f}  Test MSE={test_err:.4f}")
# degree=1:  high bias (underfits)
# degree=3:  balanced (best generalization)
# degree=15: high variance (overfits)`,
        note: "Regularization (Ridge/Lasso) is the primary tool to push back against variance without reducing model capacity.",
      },
    ],
  },
  {
    id: "evaluation-metrics",
    title: "Evaluation Metrics",
    category: "Machine Learning",
    content: [
      {
        heading: "Why Metrics Matter",
        body: "Accuracy alone is misleading. On a 99% negative dataset, a model that always predicts negative gets 99% accuracy but detects nothing. Choose your metric based on the cost of each error type.",
      },
      {
        heading: "Classification Metrics",
        body: "Confusion Matrix: TP (true positive), TN, FP, FN\n\nPrecision = TP / (TP + FP)  — Of all predicted positives, how many are actually positive?\nRecall (Sensitivity) = TP / (TP + FN)  — Of all actual positives, how many did we catch?\nF1 Score = 2 · (Precision · Recall) / (Precision + Recall)  — Harmonic mean, balances both.\nAUC-ROC — Area under the ROC curve. 0.5 = random, 1.0 = perfect. Threshold-independent.",
      },
      {
        heading: "Precision vs Recall Tradeoff",
        body: "Spam detection → Prioritize Precision (don't block legitimate emails)\nCancer screening → Prioritize Recall (don't miss any cancer cases)\nFraud detection → Balance both with F1",
      },
      {
        heading: "Full Metrics Toolkit",
        code: `from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    mean_squared_error, mean_absolute_error, r2_score
)
import numpy as np

# Classification
y_true = [0, 1, 1, 0, 1, 0, 1, 1]
y_pred = [0, 1, 0, 0, 1, 1, 1, 1]
y_prob = [0.1, 0.9, 0.4, 0.2, 0.8, 0.6, 0.95, 0.85]

print("=== Classification ===")
print(f"Accuracy:  {accuracy_score(y_true, y_pred):.3f}")
print(f"Precision: {precision_score(y_true, y_pred):.3f}")
print(f"Recall:    {recall_score(y_true, y_pred):.3f}")
print(f"F1:        {f1_score(y_true, y_pred):.3f}")
print(f"AUC-ROC:   {roc_auc_score(y_true, y_prob):.3f}")
print(classification_report(y_true, y_pred))

# Regression
y_true_r = [3.0, 2.5, 4.0, 5.0]
y_pred_r = [2.8, 2.9, 3.8, 4.9]
print("=== Regression ===")
print(f"MAE:  {mean_absolute_error(y_true_r, y_pred_r):.3f}")
print(f"RMSE: {mean_squared_error(y_true_r, y_pred_r, squared=False):.3f}")
print(f"R²:   {r2_score(y_true_r, y_pred_r):.3f}")`,
      },
    ],
  },
  {
    id: "decision-trees",
    title: "Decision Trees & Random Forests",
    category: "Machine Learning",
    content: [
      {
        heading: "Decision Trees",
        body: "A Decision Tree splits data recursively by choosing the feature and threshold that best separates classes at each node.\n\nSplitting criteria:\n• Gini Impurity = 1 − Σ pᵢ² (used in sklearn by default)\n• Information Gain / Entropy = −Σ pᵢ log₂(pᵢ)\n\nThe tree grows until leaves are pure or a stopping condition is met (max_depth, min_samples_split).",
      },
      {
        heading: "Random Forests",
        body: "Random Forest = Ensemble of N decision trees trained with two key tricks:\n\n1. Bootstrap Aggregating (Bagging) — Each tree trains on a random sample WITH replacement.\n2. Feature Randomness — At each split, only √p features are considered (not all p).\n\nFinal prediction: majority vote (classification) or mean (regression).\n\nResult: Much lower variance than a single tree, while keeping low bias.",
      },
      {
        heading: "Feature Importance",
        body: "Random Forests provide built-in feature importance — how much each feature reduces impurity across all trees. Useful for feature selection.",
      },
      {
        heading: "Decision Tree & Random Forest Example",
        code: `from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Single Decision Tree
dt = DecisionTreeClassifier(max_depth=4, random_state=42)
dt.fit(X_train, y_train)
print(f"Decision Tree Accuracy: {accuracy_score(y_test, dt.predict(X_test)):.3f}")

# Random Forest
rf = RandomForestClassifier(n_estimators=200, max_depth=None, random_state=42)
rf.fit(X_train, y_train)
print(f"Random Forest Accuracy: {accuracy_score(y_test, rf.predict(X_test)):.3f}")

# Top 5 most important features
feature_names = load_breast_cancer().feature_names
importances = pd.Series(rf.feature_importances_, index=feature_names)
print(importances.nlargest(5))`,
        note: "Deep trees overfit badly. Random Forests avoid this via ensembling — reducing variance without increasing bias.",
      },
    ],
  },
  {
    id: "svm",
    title: "Support Vector Machines (SVM)",
    category: "Machine Learning",
    content: [
      {
        heading: "Core Idea",
        body: "SVM finds the hyperplane that maximally separates two classes — the decision boundary with the largest margin. Points closest to the boundary are called Support Vectors.\n\nMaximum margin = 2 / ||w||, so we minimize ||w||² subject to correct classification.",
      },
      {
        heading: "The Kernel Trick",
        body: "When data is not linearly separable, the kernel trick implicitly maps data to a higher-dimensional space where a linear separator exists — without explicitly computing the transformation.\n\nCommon kernels:\n• Linear: K(x,z) = xᵀz\n• RBF (Radial Basis Function): K(x,z) = exp(−γ||x−z||²)\n• Polynomial: K(x,z) = (xᵀz + c)ᵈ\n\nRBF kernel is the default — works well in most cases.",
      },
      {
        heading: "Soft Margin (C parameter)",
        body: "Real data has noise and outliers. Soft margin SVM allows misclassifications with a penalty:\nMinimize: ½||w||² + C·Σξᵢ\n\nHigh C → narrow margin, low training error, risk of overfitting.\nLow C → wide margin, more misclassifications allowed, better generalization.",
      },
      {
        heading: "SVM Example",
        code: `from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

X, y = make_classification(n_samples=1000, n_features=20, n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# SVM requires feature scaling
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("svm", SVC(kernel="rbf", probability=True))
])

# Grid search for best C and gamma
param_grid = {"svm__C": [0.1, 1, 10], "svm__gamma": ["scale", "auto", 0.01]}
grid = GridSearchCV(pipeline, param_grid, cv=5, scoring="f1", n_jobs=-1)
grid.fit(X_train, y_train)

print(f"Best params: {grid.best_params_}")
print(classification_report(y_test, grid.predict(X_test)))`,
        note: "Always scale features before SVM. SVMs are slow on large datasets (>100K samples) — use linear SVM or switch to Random Forest.",
      },
    ],
  },
  {
    id: "clustering",
    title: "K-Means Clustering",
    category: "Machine Learning",
    content: [
      {
        heading: "What is Clustering?",
        body: "Clustering is an unsupervised task that groups similar data points together without labels. Goal: high intra-cluster similarity, low inter-cluster similarity.",
      },
      {
        heading: "K-Means Algorithm",
        body: "1. Choose K (number of clusters)\n2. Randomly initialize K centroids\n3. Assign each point to the nearest centroid (Euclidean distance)\n4. Recompute centroids as the mean of assigned points\n5. Repeat steps 3–4 until centroids stop moving (convergence)\n\nTime complexity: O(n·K·d·iterations)",
      },
      {
        heading: "Choosing K: The Elbow Method",
        body: "Plot inertia (sum of squared distances to nearest centroid) vs K. The 'elbow' — where adding more clusters gives diminishing returns — is the optimal K.\n\nAlternative: Silhouette Score measures how similar a point is to its own cluster vs other clusters. Range: [−1, 1]. Higher is better.",
      },
      {
        heading: "K-Means + Elbow Method",
        code: `from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import numpy as np

# Synthetic data with 4 natural clusters
X, y_true = make_blobs(n_samples=500, centers=4, cluster_std=0.8, random_state=42)
X = StandardScaler().fit_transform(X)

# Elbow method
inertias = []
silhouettes = []
K_range = range(2, 10)

for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X, labels))
    print(f"K={k}: Inertia={km.inertia_:.1f}  Silhouette={silhouettes[-1]:.3f}")

best_k = K_range.start + silhouettes.index(max(silhouettes))
print(f"\nBest K by silhouette: {best_k}")`,
        note: "K-Means assumes spherical clusters of equal size. For complex shapes, use DBSCAN or Gaussian Mixture Models.",
      },
    ],
  },
  {
    id: "pca",
    title: "PCA & Dimensionality Reduction",
    category: "Machine Learning",
    content: [
      {
        heading: "Why Dimensionality Reduction?",
        body: "High-dimensional data causes the 'curse of dimensionality': data becomes sparse, distances lose meaning, models overfit, and visualization is impossible. Reducing dimensions helps with speed, visualization, and noise removal.",
      },
      {
        heading: "PCA: Principal Component Analysis",
        body: "PCA finds the directions (principal components) of maximum variance in the data and projects onto a lower-dimensional subspace.\n\nSteps:\n1. Standardize the data (zero mean, unit variance)\n2. Compute covariance matrix Σ\n3. Compute eigenvectors and eigenvalues of Σ\n4. Sort eigenvectors by eigenvalue (descending)\n5. Select top-k eigenvectors as principal components\n6. Project data: Z = X·W_k",
      },
      {
        heading: "Explained Variance Ratio",
        body: "Each principal component explains a fraction of total variance. Cumulative explained variance tells you how many components you need to retain X% of information. Typical target: 95%.",
      },
      {
        heading: "PCA in Practice",
        code: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_digits
import numpy as np

# 64-dimensional handwritten digit images
X, y = load_digits(return_X_y=True)
X_scaled = StandardScaler().fit_transform(X)

pca = PCA()
pca.fit(X_scaled)

# How many components for 95% variance?
cumvar = np.cumsum(pca.explained_variance_ratio_)
n_components_95 = np.argmax(cumvar >= 0.95) + 1
print(f"Components for 95% variance: {n_components_95} (from {X.shape[1]})")

# Compress to 2D for visualization
pca_2d = PCA(n_components=2)
X_2d = pca_2d.fit_transform(X_scaled)
print(f"Explained variance (2D): {pca_2d.explained_variance_ratio_.sum():.1%}")

# Full pipeline with PCA
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("pca", PCA(n_components=n_components_95)),
    ("svm", SVC())
])
scores = cross_val_score(pipe, X, y, cv=5)
print(f"SVM + PCA accuracy: {scores.mean():.3f} ± {scores.std():.3f}")`,
        note: "t-SNE and UMAP are better for visualization (non-linear) but can't be used for downstream ML pipelines like PCA can.",
      },
    ],
  },
  {
    id: "xgboost",
    title: "XGBoost & Gradient Boosting",
    category: "Machine Learning",
    content: [
      {
        heading: "Boosting vs Bagging",
        body: "Bagging (Random Forest): trains trees independently in parallel. Reduces variance.\n\nBoosting: trains trees sequentially. Each tree corrects the errors of the previous ensemble. Reduces both bias and variance.\n\nGradient Boosting builds trees to fit the negative gradient (residuals) of the loss function.",
      },
      {
        heading: "XGBoost: Extreme Gradient Boosting",
        body: "XGBoost is the most widely used gradient boosting library. Key innovations:\n• Second-order Taylor expansion of loss (more precise gradients)\n• Regularization terms in the objective (L1 and L2 on leaf weights)\n• Column subsampling (like Random Forest)\n• Efficient split finding (histogram-based)\n• Built-in handling of missing values\n• Parallel tree construction\n\nWon hundreds of Kaggle competitions. Go-to for tabular data.",
      },
      {
        heading: "XGBoost vs LightGBM vs CatBoost",
        body: "XGBoost — Most stable, great docs, wide support. Best default choice.\nLightGBM — Fastest on large datasets (leaf-wise growth). Memory efficient.\nCatBoost — Best for categorical features natively. No need to encode.",
      },
      {
        heading: "XGBoost Full Example",
        code: `import xgboost as xgb
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import roc_auc_score
import numpy as np

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = xgb.XGBClassifier(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,    # L1
    reg_lambda=1.0,   # L2
    eval_metric="logloss",
    early_stopping_rounds=20,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

proba = model.predict_proba(X_test)[:, 1]
print(f"AUC-ROC: {roc_auc_score(y_test, proba):.4f}")
print(f"Best iteration: {model.best_iteration}")`,
        note: "early_stopping_rounds halts training when validation loss stops improving — prevents overfitting automatically.",
      },
    ],
  },
  {
    id: "feature-engineering",
    title: "Feature Engineering",
    category: "Machine Learning",
    content: [
      {
        heading: "Why Feature Engineering?",
        body: "Features are the raw material of ML models. Better features → better performance, often more than choosing a fancier algorithm. Feature engineering is the process of creating, transforming, and selecting features to improve model accuracy.",
      },
      {
        heading: "Handling Missing Values",
        body: "• Drop rows/columns (if < 5% missing and random)\n• Mean/Median/Mode imputation (simple, often fine)\n• Model-based imputation (KNNImputer, IterativeImputer)\n• Add indicator column: 'feature_was_missing' — lets model learn missingness signal",
      },
      {
        heading: "Encoding Categorical Variables",
        body: "Label Encoding — Map categories to integers. Only for ordinal data (Small→0, Medium→1, Large→2).\n\nOne-Hot Encoding — Binary column per category. Good for nominal data with few categories.\n\nTarget Encoding — Replace category with mean of target. Great for high-cardinality columns. Risk: leakage — use cross-val encoding.\n\nEmbedding — Neural network learned representations. Best for very high cardinality (user IDs, product IDs).",
      },
      {
        heading: "Feature Engineering Pipeline",
        code: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.impute import SimpleImputer, KNNImputer

# Example dataset
df = pd.DataFrame({
    "age":    [25, np.nan, 35, 28, 42],
    "income": [50000, 75000, np.nan, 60000, 90000],
    "city":   ["NYC", "LA", "NYC", "Chicago", "LA"],
    "bought": [1, 0, 1, 0, 1]
})

X = df.drop("bought", axis=1)
y = df["bought"]

numeric_features = ["age", "income"]
categorical_features = ["city"]

# Numeric: impute → scale → polynomial interactions
numeric_pipeline = Pipeline([
    ("imputer", KNNImputer(n_neighbors=3)),
    ("scaler", StandardScaler()),
    ("poly", PolynomialFeatures(degree=2, include_bias=False))
])

# Categorical: impute → one-hot encode
categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numeric_features),
    ("cat", categorical_pipeline, categorical_features),
])

X_processed = preprocessor.fit_transform(X)
print(f"Original shape: {X.shape} → Processed shape: {X_processed.shape}")`,
        note: "Always build preprocessing into a Pipeline to prevent data leakage and make deployment safe.",
      },
    ],
  },
  {
    id: "hyperparameter-tuning",
    title: "Hyperparameter Tuning",
    category: "Machine Learning",
    content: [
      {
        heading: "Parameters vs Hyperparameters",
        body: "Parameters — Learned from data during training (weights, biases).\nHyperparameters — Set before training, control the learning process (learning rate, n_estimators, max_depth, regularization strength).",
      },
      {
        heading: "Grid Search",
        body: "Exhaustively tries every combination in a defined grid. Guaranteed to find the best in the search space but exponentially slow as dimensions grow.",
      },
      {
        heading: "Random Search",
        body: "Randomly samples combinations from the parameter space. Empirically finds nearly as good a solution as grid search in much less time — especially when only a few hyperparameters really matter.",
      },
      {
        heading: "Bayesian Optimization with Optuna",
        body: "Builds a probabilistic model of the objective function and intelligently chooses the next point to evaluate. Much more efficient than random or grid search for expensive models.",
        code: `import optuna
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
import warnings
warnings.filterwarnings("ignore")

X, y = load_breast_cancer(return_X_y=True)

def objective(trial):
    params = {
        "n_estimators":   trial.suggest_int("n_estimators", 50, 500),
        "max_depth":      trial.suggest_int("max_depth", 2, 8),
        "learning_rate":  trial.suggest_float("learning_rate", 1e-3, 0.3, log=True),
        "subsample":      trial.suggest_float("subsample", 0.5, 1.0),
        "min_samples_split": trial.suggest_int("min_samples_split", 2, 20),
    }
    model = GradientBoostingClassifier(**params, random_state=42)
    scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc", n_jobs=-1)
    return scores.mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50, show_progress_bar=True)

print(f"Best AUC: {study.best_value:.4f}")
print(f"Best params: {study.best_params}")`,
        note: "For neural networks, use Optuna + PyTorch Lightning. For fast iteration, start with RandomizedSearchCV before Optuna.",
      },
    ],
  },
  {
    id: "cross-validation",
    title: "Cross-Validation",
    category: "Machine Learning",
    content: [
      {
        heading: "Why Cross-Validation?",
        body: "A single train/test split gives a high-variance estimate of generalization performance — it depends heavily on which samples ended up in each split. Cross-validation averages over K different splits for a more reliable estimate.",
      },
      {
        heading: "K-Fold Cross-Validation",
        body: "1. Split data into K equal folds\n2. For each fold i: train on all folds except i, evaluate on fold i\n3. Average the K evaluation scores\n\nK=5 or K=10 is standard. K=N (Leave-One-Out) is most thorough but slow.",
      },
      {
        heading: "Stratified K-Fold",
        body: "Preserves the class distribution in each fold. Always use this for classification tasks — especially with imbalanced data.",
      },
      {
        heading: "Time Series Split",
        body: "For time-series data, you must never let future data leak into training. TimeSeriesSplit always trains on past data and validates on future data.",
      },
      {
        heading: "Cross-Validation Strategies",
        code: `from sklearn.model_selection import (
    KFold, StratifiedKFold, TimeSeriesSplit,
    cross_val_score, cross_validate
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Standard K-Fold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kf, scoring="accuracy")
print(f"KFold:       {scores.mean():.3f} ± {scores.std():.3f}")

# Stratified K-Fold (for classification)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf, scoring="accuracy")
print(f"Stratified:  {scores.mean():.3f} ± {scores.std():.3f}")

# Multiple metrics at once
results = cross_validate(model, X, y, cv=skf,
    scoring=["accuracy", "f1_macro", "roc_auc_ovr"])
for metric, vals in results.items():
    if metric.startswith("test_"):
        print(f"{metric}: {vals.mean():.3f} ± {vals.std():.3f}")`,
        note: "Use cross_validate (not cross_val_score) when you need multiple metrics — avoids fitting the model multiple times.",
      },
    ],
  },
]
