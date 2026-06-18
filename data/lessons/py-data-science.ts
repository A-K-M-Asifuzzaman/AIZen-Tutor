import type { Lesson } from "../types"

export const PYTHON_DATA_SCIENCE: Lesson = {
  id: "python-data-science",
  title: "Python for Data Science",
  category: "Python",
  content: [
    {
      heading: "NumPy Fundamentals",
      body: "NumPy provides efficient array operations, mathematical functions, and is the foundation for most data science libraries.",
      code: `import numpy as np

# Creating arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.zeros((3, 3))
arr3 = np.ones((2, 4))
arr4 = np.eye(4)  # Identity matrix
arr5 = np.random.randn(3, 3)  # Random normal
arr6 = np.linspace(0, 10, 50)  # 50 evenly spaced values
arr7 = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

# Array attributes
print(arr1.shape)      # (5,)
print(arr1.dtype)      # int64
print(arr1.ndim)       # 1 (number of dimensions)
print(arr1.size)       # 5 (total elements)
print(arr1.nbytes)     # 40 bytes (memory usage)

# Statistical operations
print(arr1.mean())     # 3.0
print(arr1.std())      # 1.414...
print(arr1.var())      # 2.0
print(arr1.sum())      # 15
print(arr1.min())      # 1
print(arr1.max())      # 5
print(np.median(arr1)) # 3.0
print(np.percentile(arr1, 75))  # 75th percentile

# Reshaping and transposing
arr = np.arange(12)
reshaped = arr.reshape(3, 4)
print(reshaped)
print(reshaped.T)  # Transpose
print(reshaped.flatten())  # Flatten to 1D

# Broadcasting
a = np.array([1, 2, 3])
b = np.array([[1], [2], [3]])
print(a + b)  # [[2,3,4], [3,4,5], [4,5,6]]

# Vectorization (fast element-wise operations)
x = np.array([1, 2, 3, 4])
y = np.array([5, 6, 7, 8])
result = np.sqrt(x**2 + y**2)
print(result)  # [5.099, 6.325, 7.616, 8.944]

# Advanced indexing
arr = np.arange(10)
print(arr[2:5])     # [2, 3, 4]
print(arr[arr > 5]) # [6, 7, 8, 9]

# Boolean indexing
mask = arr > 5
print(arr[mask])  # [6, 7, 8, 9]

# Fancy indexing
indices = [1, 3, 5, 7]
print(arr[indices])  # [1, 3, 5, 7]

# 2D array indexing
matrix = np.arange(20).reshape(4, 5)
print(matrix[1:3, 2:4])  # rows 1-2, columns 2-3

# Universal functions (ufuncs)
arr = np.array([1, 4, 9, 16])
print(np.sqrt(arr))   # [1, 2, 3, 4]
print(np.exp(arr))    # Exponential
print(np.log(arr))    # Natural logarithm
print(np.sin(arr))    # Trigonometric functions

# Aggregation functions
matrix = np.random.randn(4, 3)
print(matrix.sum(axis=0))  # Sum along columns
print(matrix.mean(axis=1))  # Mean along rows

# Random number generation
np.random.seed(42)  # For reproducibility
random_array = np.random.random((3, 3))
normal_array = np.random.normal(0, 1, (3, 3))
uniform_array = np.random.uniform(0, 1, (3, 3))
integers = np.random.randint(0, 10, 5)

# Linear algebra
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.dot(a, b))  # Matrix multiplication
print(a @ b)  # Matrix multiplication (Python 3.5+)
print(np.linalg.inv(a))  # Inverse
print(np.linalg.det(a))  # Determinant
eigenvalues, eigenvectors = np.linalg.eig(a)

# Memory efficiency
import sys
python_list = list(range(1000000))
numpy_array = np.arange(1000000)
print(sys.getsizeof(python_list))  # ~8MB
print(numpy_array.nbytes)  # 8MB (actually more efficient)` 
    },
    {
      heading: "Pandas - Series and DataFrame",
      body: "Pandas provides high-performance, easy-to-use data structures and data analysis tools.",
      code: `import pandas as pd
import numpy as np

# Creating Series
s = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
print(s)

# Creating DataFrames
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'city': ['NYC', 'LA', 'Chicago', 'NYC', 'LA'],
    'salary': [70000, 85000, 90000, 75000, 80000],
    'department': ['IT', 'HR', 'IT', 'Finance', 'HR']
}
df = pd.DataFrame(data)
print(df.head())        # First 5 rows
print(df.tail(3))       # Last 3 rows
print(df.info())        # Data types and memory usage
print(df.describe())    # Statistical summary
print(df.shape)         # (5, 5)

# Selecting data
print(df['name'])                       # Single column (Series)
print(df[['name', 'age']])              # Multiple columns
print(df.loc[0:2, ['name', 'city']])    # Label-based selection
print(df.iloc[0:2, 0:2])                # Position-based selection
print(df.loc[df['age'] > 30, ['name', 'age']])  # Conditional selection

# Filtering
mask = (df['age'] > 28) & (df['city'] == 'NYC')
print(df[mask])

# Adding and modifying columns
df['bonus'] = df['salary'] * 0.1
df['age_squared'] = df['age'] ** 2
df['senior'] = df['age'] > 30

# Vectorized string operations
df['name_upper'] = df['name'].str.upper()
df['email'] = df['name'].str.lower() + '@company.com'

# Renaming columns
df.columns = [col.upper() for col in df.columns]
df.rename(columns={'NAME': 'full_name'}, inplace=True)

# Sorting
df_sorted = df.sort_values('SALARY', ascending=False)
df_sorted_multi = df.sort_values(['DEPARTMENT', 'AGE'])

# Group operations
grouped = df.groupby('CITY')['SALARY'].mean()
print(grouped)
grouped_agg = df.groupby('DEPARTMENT').agg({
    'SALARY': ['mean', 'min', 'max'],
    'AGE': 'mean'
})
print(grouped_agg)

# Pivot tables
pivot = pd.pivot_table(df, values='SALARY', index='DEPARTMENT', columns='CITY', aggfunc='mean')
print(pivot)

# Handling missing data
df_with_na = df.copy()
df_with_na.loc[1, 'SALARY'] = np.nan
df_with_na.loc[3, 'CITY'] = np.nan
print(df_with_na.isnull().sum())  # Count missing values
df_cleaned = df_with_na.dropna()  # Remove rows with any NaN
df_filled_mean = df_with_na.fillna({'SALARY': df_with_na['SALARY'].mean()})
df_filled_ffill = df_with_na.fillna(method='ffill')  # Forward fill
df_dropped = df_with_na.dropna(subset=['SALARY'])  # Drop rows with NaN in specific columns

# Data types conversion
df['AGE'] = df['AGE'].astype('int64')
df['SALARY'] = pd.to_numeric(df['SALARY'])

# Date handling
df['hire_date'] = pd.date_range('2020-01-01', periods=len(df), freq='M')
df['hire_year'] = df['hire_date'].dt.year
df['hire_month'] = df['hire_date'].dt.month_name()

# Apply functions
def categorize_age(age):
    if age < 30:
        return 'Young'
    elif age < 40:
        return 'Middle'
    else:
        return 'Senior'

df['age_category'] = df['AGE'].apply(categorize_age)
df['salary_band'] = df['SALARY'].apply(lambda x: 'High' if x > 80000 else 'Standard')

# Map values
city_population = {'NYC': 8.4, 'LA': 3.9, 'Chicago': 2.7}
df['city_population_millions'] = df['CITY'].map(city_population)

# Merging DataFrames
df1 = pd.DataFrame({'id': [1, 2, 3], 'name': ['Alice', 'Bob', 'Charlie']})
df2 = pd.DataFrame({'id': [2, 3, 4], 'age': [25, 30, 35]})
merged = pd.merge(df1, df2, on='id', how='inner')  # Inner join
merged_left = pd.merge(df1, df2, on='id', how='left')  # Left join

# Concatenation
df_concat = pd.concat([df1, df2], axis=1)  # Column-wise

# Export/Import
# df.to_csv('data.csv', index=False)
# df.to_excel('data.xlsx', index=False)
# df.to_json('data.json', orient='records')
# df.to_parquet('data.parquet')

# Read from various formats
# df_csv = pd.read_csv('data.csv')
# df_excel = pd.read_excel('data.xlsx', sheet_name='Sheet1')
# df_json = pd.read_json('data.json')
# df_sql = pd.read_sql('SELECT * FROM table', connection)`
    },
    {
      heading: "Matplotlib - Data Visualization",
      body: "Matplotlib is the foundational plotting library for Python, providing extensive control over visualizations.",
      code: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Basic configuration
plt.style.use('seaborn')  # Modern style
plt.rcParams['figure.figsize'] = [10, 6]
plt.rcParams['font.size'] = 12

# Line plot
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.sin(x) * np.cos(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sin(x)', color='blue', linewidth=2, marker='')
plt.plot(x, y2, label='cos(x)', color='red', linestyle='--', linewidth=2)
plt.plot(x, y3, label='sin*cos', color='green', linestyle=':', linewidth=3)
plt.xlabel('X values')
plt.ylabel('Y values')
plt.title('Trigonometric Functions', fontsize=14, fontweight='bold')
plt.legend(loc='upper right', frameon=True, shadow=True)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Scatter plot with color mapping
np.random.seed(42)
n = 100
x = np.random.randn(n)
y = x * 0.5 + np.random.randn(n) * 0.3
colors = np.random.randn(n)
sizes = np.random.randint(20, 200, n)

plt.figure(figsize=(10, 6))
scatter = plt.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap='viridis')
plt.colorbar(scatter, label='Color Scale')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Scatter Plot with Color and Size Mapping')
plt.tight_layout()
plt.show()

# Bar charts
categories = ['A', 'B', 'C', 'D', 'E']
values = [10, 25, 15, 30, 20]
errors = [2, 3, 1, 4, 2]

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Vertical bar
axes[0].bar(categories, values, yerr=errors, color='skyblue', 
            edgecolor='navy', linewidth=2, capsize=5)
axes[0].set_xlabel('Category')
axes[0].set_ylabel('Value')
axes[0].set_title('Vertical Bar Chart with Error Bars')
axes[0].grid(True, axis='y', alpha=0.3)

# Horizontal bar
axes[1].barh(categories, values, color='lightgreen', edgecolor='darkgreen', linewidth=2)
axes[1].set_xlabel('Value')
axes[1].set_ylabel('Category')
axes[1].set_title('Horizontal Bar Chart')
axes[1].grid(True, axis='x', alpha=0.3)

plt.tight_layout()
plt.show()

# Histogram
data = np.random.normal(0, 1, 1000)
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7, color='blue', edgecolor='black', density=True)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {data.mean():.2f}')
plt.axvline(data.median(), color='green', linestyle='--', linewidth=2, label=f'Median: {data.median():.2f}')
plt.xlabel('Value')
plt.ylabel('Density')
plt.title('Histogram with Statistics')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Box plot
data_box = [np.random.normal(i, 0.5, 100) for i in range(5)]
plt.figure(figsize=(10, 6))
plt.boxplot(data_box, labels=['Group A', 'Group B', 'Group C', 'Group D', 'Group E'])
plt.ylabel('Values')
plt.title('Box Plot for Multiple Groups')
plt.grid(True, axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

# Heatmap
data_heat = np.random.randn(10, 10)
plt.figure(figsize=(8, 6))
plt.imshow(data_heat, cmap='RdYlBu', interpolation='nearest', aspect='auto')
plt.colorbar(label='Values')
plt.title('Heatmap Example')
plt.tight_layout()
plt.show()

# Subplots with shared axes
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
axes[0, 0].plot(x, y1)
axes[0, 0].set_title('Sine')
axes[0, 1].plot(x, y2)
axes[0, 1].set_title('Cosine')
axes[0, 2].scatter(x, y1)
axes[0, 2].set_title('Scatter')
axes[1, 0].bar(categories[:4], values[:4])
axes[1, 0].set_title('Bar')
axes[1, 1].hist(data, bins=20)
axes[1, 1].set_title('Histogram')
axes[1, 2].boxplot(data_box)
axes[1, 2].set_title('Box Plot')
plt.tight_layout()
plt.show()

# 3D plots
from mpl_toolkits.mplot3d import Axes3D
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')
X = np.arange(-5, 5, 0.1)
Y = np.arange(-5, 5, 0.1)
X, Y = np.meshgrid(X, Y)
Z = np.sin(np.sqrt(X**2 + Y**2))
surf = ax.plot_surface(X, Y, Z, cmap='viridis', edgecolor='none')
fig.colorbar(surf, label='Z values')
ax.set_title('3D Surface Plot')
plt.tight_layout()
plt.show()`
    },
    {
      heading: "Seaborn - Statistical Data Visualization",
      body: "Seaborn builds on Matplotlib to provide beautiful statistical visualizations with less code.",
      code: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Set style
sns.set_style('whitegrid')
sns.set_palette('husl')

# Load example dataset
tips = sns.load_dataset('tips')
iris = sns.load_dataset('iris')
titanic = sns.load_dataset('titanic')

# Pairplot - Relationship matrix
sns.pairplot(iris, hue='species', height=2.5)
plt.suptitle('Pairplot of Iris Dataset', y=1.02)
plt.show()

# Distribution plots
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Histogram with KDE
sns.histplot(tips['total_bill'], kde=True, ax=axes[0, 0])
axes[0, 0].set_title('Distribution with KDE')

# KDE plot
sns.kdeplot(tips['total_bill'], fill=True, ax=axes[0, 1])
axes[0, 1].set_title('KDE Plot')

# Box plot
sns.boxplot(x='day', y='total_bill', data=tips, ax=axes[0, 2])
axes[0, 2].set_title('Box Plot by Day')

# Violin plot
sns.violinplot(x='day', y='total_bill', data=tips, ax=axes[1, 0])
axes[1, 0].set_title('Violin Plot by Day')

# Count plot
sns.countplot(x='day', data=tips, ax=axes[1, 1])
axes[1, 1].set_title('Count Plot')

# Scatter with regression
sns.regplot(x='total_bill', y='tip', data=tips, ax=axes[1, 2])
axes[1, 2].set_title('Scatter with Regression')

plt.tight_layout()
plt.show()

# Categorical plots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Bar plot with confidence intervals
sns.barplot(x='day', y='total_bill', data=tips, ax=axes[0, 0])
axes[0, 0].set_title('Bar Plot with CI')

# Point plot
sns.pointplot(x='day', y='total_bill', hue='sex', data=tips, ax=axes[0, 1])
axes[0, 1].set_title('Point Plot')

# Swarm plot
sns.swarmplot(x='day', y='total_bill', hue='sex', data=tips, ax=axes[1, 0])
axes[1, 0].set_title('Swarm Plot')

# Catplot for complex categorical data
sns.catplot(x='day', y='total_bill', hue='sex', kind='swarm', data=tips)
plt.title('Catplot with Swarm')

plt.tight_layout()
plt.show()

# Correlation heatmap
correlation = titanic.corr()
plt.figure(figsize=(10, 8))
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0, square=True)
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.show()

# Jointplot - 2D distribution
sns.jointplot(x='total_bill', y='tip', data=tips, kind='hex')
plt.tight_layout()
plt.show()

# FacetGrid - Multiple subplots
g = sns.FacetGrid(tips, col='time', row='sex', hue='smoker')
g.map(sns.scatterplot, 'total_bill', 'tip')
g.add_legend()
plt.tight_layout()
plt.show()

# Pairgrid for advanced relationships
g = sns.PairGrid(iris, hue='species', height=2.5)
g.map_upper(sns.scatterplot)
g.map_lower(sns.kdeplot, fill=True)
g.map_diag(sns.histplot, kde=True)
g.add_legend()
plt.tight_layout()
plt.show()

# Time series with confidence intervals
# Create sample time series data
dates = pd.date_range('2023-01-01', periods=100)
data = np.random.normal(0, 1, 100).cumsum()
df_ts = pd.DataFrame({'date': dates, 'value': data})

plt.figure(figsize=(12, 6))
sns.lineplot(x='date', y='value', data=df_ts)
plt.title('Time Series Plot')
plt.xlabel('Date')
plt.ylabel('Value')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Cluster map
import scipy.cluster.hierarchy as sch
plt.figure(figsize=(10, 8))
sns.clustermap(iris.iloc[:, :4], cmap='RdYlBu', standard_scale=1, figsize=(10, 8))
plt.title('Clustermap of Iris Data')
plt.show()`
    },
    {
      heading: "Scikit-Learn - Machine Learning",
      body: "Scikit-learn provides efficient tools for machine learning and statistical modeling.",
      code: `from sklearn import datasets
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.metrics import mean_squared_error, r2_score, roc_auc_score
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

# Load dataset
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 1. Classification with Logistic Regression
model_lr = LogisticRegression(max_iter=1000, random_state=42)
model_lr.fit(X_train_scaled, y_train)
y_pred_lr = model_lr.predict(X_test_scaled)
accuracy_lr = accuracy_score(y_test, y_pred_lr)
print(f"Logistic Regression Accuracy: {accuracy_lr:.3f}")

# 2. Decision Tree Classifier
model_dt = DecisionTreeClassifier(max_depth=3, random_state=42)
model_dt.fit(X_train_scaled, y_train)
y_pred_dt = model_dt.predict(X_test_scaled)
accuracy_dt = accuracy_score(y_test, y_pred_dt)
print(f"Decision Tree Accuracy: {accuracy_dt:.3f}")

# Visualize decision tree
plt.figure(figsize=(12, 8))
plot_tree(model_dt, feature_names=iris.feature_names, 
          class_names=iris.target_names, filled=True, rounded=True)
plt.title('Decision Tree Visualization')
plt.tight_layout()
plt.show()

# 3. Random Forest
model_rf = RandomForestClassifier(n_estimators=100, random_state=42)
model_rf.fit(X_train_scaled, y_train)
y_pred_rf = model_rf.predict(X_test_scaled)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
print(f"Random Forest Accuracy: {accuracy_rf:.3f}")

# Feature importance
importance = model_rf.feature_importances_
for name, importance in zip(iris.feature_names, importance):
    print(f"{name}: {importance:.3f}")

# 4. SVM with RBF kernel
model_svm = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
model_svm.fit(X_train_scaled, y_train)
y_pred_svm = model_svm.predict(X_test_scaled)
accuracy_svm = accuracy_score(y_test, y_pred_svm)
print(f"SVM Accuracy: {accuracy_svm:.3f}")

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred_rf)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=iris.target_names, yticklabels=iris.target_names)
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix - Random Forest')
plt.tight_layout()
plt.show()

# Classification Report
print("\nClassification Report:")
print(classification_report(y_test, y_pred_rf, target_names=iris.target_names))

# 5. Regression with Linear Models
# Create regression dataset
X_reg, y_reg = datasets.make_regression(n_samples=200, n_features=5, noise=10, random_state=42)
X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
    X_reg, y_reg, test_size=0.3, random_state=42
)

# Standardize
scaler_reg = StandardScaler()
X_train_reg_scaled = scaler_reg.fit_transform(X_train_reg)
X_test_reg_scaled = scaler_reg.transform(X_test_reg)

# Linear Regression
model_lr_reg = LinearRegression()
model_lr_reg.fit(X_train_reg_scaled, y_train_reg)
y_pred_reg = model_lr_reg.predict(X_test_reg_scaled)
rmse = np.sqrt(mean_squared_error(y_test_reg, y_pred_reg))
r2 = r2_score(y_test_reg, y_pred_reg)
print(f"Linear Regression - RMSE: {rmse:.3f}, R²: {r2:.3f}")

# Ridge Regression (L2 regularization)
model_ridge = Ridge(alpha=1.0)
model_ridge.fit(X_train_reg_scaled, y_train_reg)
y_pred_ridge = model_ridge.predict(X_test_reg_scaled)
rmse_ridge = np.sqrt(mean_squared_error(y_test_reg, y_pred_ridge))
print(f"Ridge Regression - RMSE: {rmse_ridge:.3f}")

# Lasso Regression (L1 regularization)
model_lasso = Lasso(alpha=0.1)
model_lasso.fit(X_train_reg_scaled, y_train_reg)
y_pred_lasso = model_lasso.predict(X_test_reg_scaled)
rmse_lasso = np.sqrt(mean_squared_error(y_test_reg, y_pred_lasso))
print(f"Lasso Regression - RMSE: {rmse_lasso:.3f}")

# 6. Cross-Validation
cv_scores = cross_val_score(model_rf, X_train_scaled, y_train, cv=5)
print(f"Cross-validation scores: {cv_scores}")
print(f"Mean CV score: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

# 7. Grid Search for Hyperparameter Tuning
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)
grid_search.fit(X_train_scaled, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")

# 8. ROC AUC for binary classification
# Convert to binary problem
iris_binary = datasets.load_iris()
X_bin = iris_binary.data[iris_binary.target != 2]  # Remove class 2
y_bin = iris_binary.target[iris_binary.target != 2]  # Classes 0 and 1

X_train_bin, X_test_bin, y_train_bin, y_test_bin = train_test_split(
    X_bin, y_bin, test_size=0.3, random_state=42
)

scaler_bin = StandardScaler()
X_train_bin_scaled = scaler_bin.fit_transform(X_train_bin)
X_test_bin_scaled = scaler_bin.transform(X_test_bin)

model_bin = LogisticRegression(random_state=42)
model_bin.fit(X_train_bin_scaled, y_train_bin)
y_proba = model_bin.predict_proba(X_test_bin_scaled)[:, 1]
roc_auc = roc_auc_score(y_test_bin, y_proba)
print(f"ROC AUC Score: {roc_auc:.3f}")

# 9. Learning Curve
from sklearn.model_selection import learning_curve
train_sizes, train_scores, test_scores = learning_curve(
    model_rf, X_train_scaled, y_train, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.figure(figsize=(10, 6))
plt.plot(train_sizes, train_scores.mean(axis=1), label='Training Score')
plt.plot(train_sizes, test_scores.mean(axis=1), label='Validation Score')
plt.xlabel('Training Examples')
plt.ylabel('Accuracy')
plt.title('Learning Curve')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# 10. Pipeline for preprocessing and modeling
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train_scaled, y_train)
pipeline_score = pipeline.score(X_test_scaled, y_test)
print(f"Pipeline accuracy: {pipeline_score:.3f}")`
    },
    {
      heading: "Advanced Data Science Topics",
      body: "Advanced techniques including feature engineering, model selection, and deployment considerations.",
      code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif, RFE
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Feature Engineering
# Creating interaction terms
data = pd.DataFrame({
    'x1': np.random.randn(100),
    'x2': np.random.randn(100),
    'category': np.random.choice(['A', 'B', 'C'], 100)
})
data['x1*x2'] = data['x1'] * data['x2']
data['x1_squared'] = data['x1'] ** 2
data['x2_squared'] = data['x2'] ** 2

# Polynomial features
poly = PolynomialFeatures(degree=2, include_bias=False)
poly_features = poly.fit_transform(data[['x1', 'x2']])
print(f"Original features: 2, Polynomial features: {poly_features.shape[1]}")

# One-hot encoding (categorical variables)
data_encoded = pd.get_dummies(data, columns=['category'], prefix='cat')
print(data_encoded.head())

# 2. Feature Selection
# Filter method (SelectKBest)
selector = SelectKBest(f_classif, k=2)
X_selected = selector.fit_transform(data[['x1', 'x2']], 
                                   (data['x1'] + data['x2'] > 0).astype(int))
print(f"Selected features: {selector.get_support()}")

# Wrapper method (RFE)
estimator = RandomForestRegressor(n_estimators=10, random_state=42)
selector_rfe = RFE(estimator, n_features_to_select=2)
selector_rfe.fit(data[['x1', 'x2']], data['x1'] * data['x2'])
print(f"RFE selected: {selector_rfe.support_}")

# 3. Model Selection and Evaluation
from sklearn.model_selection import cross_validate, validation_curve

# Create sample regression data
X_ml = np.random.randn(200, 10)
y_ml = X_ml @ np.array([1, -1, 0.5, -0.5, 0.2, 0, 0, 0, 0, 0]) + np.random.randn(200) * 0.1

X_train_ml, X_test_ml, y_train_ml, y_test_ml = train_test_split(
    X_ml, y_ml, test_size=0.3, random_state=42
)

# Compare multiple models
models = {
    'Linear': LinearRegression(),
    'Ridge': Ridge(alpha=1.0),
    'Lasso': Lasso(alpha=0.1),
    'Random Forest': RandomForestRegressor(n_estimators=50, random_state=42)
}

results = {}
for name, model in models.items():
    scores = cross_val_score(model, X_train_ml, y_train_ml, cv=5, scoring='r2')
    results[name] = {
        'mean': scores.mean(),
        'std': scores.std()
    }

for name, metrics in results.items():
    print(f"{name}: R² = {metrics['mean']:.3f} (+/- {metrics['std']*2:.3f})")

# 4. Ensemble Methods
from sklearn.ensemble import VotingClassifier, BaggingClassifier, AdaBoostClassifier

# Voting classifier
clf1 = LogisticRegression(random_state=42)
clf2 = DecisionTreeClassifier(random_state=42)
clf3 = SVC(kernel='rbf', random_state=42)

ensemble = VotingClassifier(
    estimators=[('lr', clf1), ('dt', clf2), ('svm', clf3)],
    voting='hard'
)

# 5. Model Persistence
import joblib
# Save model
# joblib.dump(model_rf, 'random_forest_model.pkl')
# Load model
# loaded_model = joblib.load('random_forest_model.pkl')

# 6. Handling Imbalanced Data
from sklearn.utils import class_weight
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

# Create imbalanced dataset
X_imb, y_imb = datasets.make_classification(
    n_samples=1000, n_features=10, n_classes=2,
    weights=[0.9, 0.1], random_state=42
)

# SMOTE for oversampling
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_imb, y_imb)
print(f"Original class distribution: {np.bincount(y_imb)}")
print(f"Resampled distribution: {np.bincount(y_resampled)}")

# 7. Dimensionality Reduction with PCA
from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)  # Keep 95% variance
X_pca = pca.fit_transform(X_ml)
print(f"Original dimensions: {X_ml.shape[1]}")
print(f"PCA dimensions: {X_pca.shape[1]}")
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")

# 8. Visualization of High-Dimensional Data
# t-SNE for visualization
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X_ml[:100])  # Use subset for speed

plt.figure(figsize=(10, 8))
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y_ml[:100], cmap='viridis')
plt.colorbar(label='Target value')
plt.title('t-SNE Visualization')
plt.tight_layout()
plt.show()

# 9. Hyperparameter Tuning Strategies
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, randint

param_dist = {
    'n_estimators': randint(50, 200),
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': randint(2, 20),
    'max_features': ['auto', 'sqrt', 'log2']
}

random_search = RandomizedSearchCV(
    RandomForestRegressor(random_state=42),
    param_distributions=param_dist,
    n_iter=20,
    cv=5,
    scoring='r2',
    random_state=42,
    n_jobs=-1
)
random_search.fit(X_train_ml, y_train_ml)
print(f"Best parameters: {random_search.best_params_}")
print(f"Best score: {random_search.best_score_:.3f}")

# 10. Feature Importance Analysis
# SHAP for model interpretation
import shap

# Explain predictions using SHAP
explainer = shap.TreeExplainer(RandomForestRegressor(n_estimators=50, random_state=42))
shap_values = explainer.shap_values(X_train_ml[:100])

# Summary plot
plt.figure(figsize=(10, 8))
shap.summary_plot(shap_values, X_train_ml[:100], show=False)
plt.tight_layout()
plt.show()

# 11. Time Series with scikit-learn
from sklearn.preprocessing import create_lagged_features

# Create lagged features for time series
def create_time_features(data, lags):
    df = pd.DataFrame({'y': data})
    for lag in range(1, lags + 1):
        df[f'y_lag_{lag}'] = df['y'].shift(lag)
    return df.dropna()

ts_data = np.sin(np.linspace(0, 10, 100)) + np.random.randn(100) * 0.1
ts_features = create_time_features(ts_data, lags=3)
X_ts = ts_features.drop('y', axis=1).values
y_ts = ts_features['y'].values

X_train_ts, X_test_ts, y_train_ts, y_test_ts = train_test_split(
    X_ts, y_ts, test_size=0.3, shuffle=False
)

model_ts = RandomForestRegressor(n_estimators=50, random_state=42)
model_ts.fit(X_train_ts, y_train_ts)
y_pred_ts = model_ts.predict(X_test_ts)
rmse_ts = np.sqrt(mean_squared_error(y_test_ts, y_pred_ts))
print(f"Time Series RMSE: {rmse_ts:.3f}")

# 12. Cross-validation strategies
from sklearn.model_selection import TimeSeriesSplit

# Time Series Cross-Validation
tscv = TimeSeriesSplit(n_splits=5)
for fold, (train_idx, val_idx) in enumerate(tscv.split(X_ts)):
    print(f"Fold {fold}: Train size {len(train_idx)}, Val size {len(val_idx)}")`
    }
  ]
}