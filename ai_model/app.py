"""
IOSH AI Analytics & Prediction API
Flask microservice for data analytics and ML-based risk prediction.
"""

import os
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# ---------------------------------------------------------------------------
# Load dataset & train models at startup
# ---------------------------------------------------------------------------

DATA_PATH = os.path.join(os.path.dirname(__file__), "IOSH_Large_Synthetic_Dataset_5000 (2).csv")

print(f"[INFO] Loading dataset from {DATA_PATH}")
df = pd.read_csv(DATA_PATH)
print(f"[INFO] Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Encode categorical columns for modelling
sector_encoder = LabelEncoder()
district_encoder = LabelEncoder()
risk_label_encoder = LabelEncoder()

df["sector_encoded"] = sector_encoder.fit_transform(df["sector"])
df["district_encoded"] = district_encoder.fit_transform(df["district"])
df["risk_label_encoded"] = risk_label_encoder.fit_transform(df["risk_label"])

FEATURE_COLS = [
    "noise_level_db",
    "dust_level_mg",
    "chemical_exposure_ppm",
    "temperature_c",
    "humidity_percent",
    "employee_age",
    "bmi",
    "respiratory_issue",
    "non_compliance_flag",
    "sector_encoded",
    "district_encoded",
]

X = df[FEATURE_COLS].values
y_label = df["risk_label_encoded"].values
y_score = df["risk_score"].values

X_train, X_test, y_label_train, y_label_test, y_score_train, y_score_test = (
    train_test_split(X, y_label, y_score, test_size=0.2, random_state=42)
)

# --- Classification model (risk label) ---
clf = RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)
clf.fit(X_train, y_label_train)
clf_accuracy = accuracy_score(y_label_test, clf.predict(X_test))
print(f"[INFO] Classification accuracy: {clf_accuracy:.4f}")

# --- Regression model (risk score) ---
reg = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)
reg.fit(X_train, y_score_train)
reg_r2 = reg.score(X_test, y_score_test)
print(f"[INFO] Regression R²: {reg_r2:.4f}")

# Feature importance
feature_importance = dict(
    zip(
        [
            "noise_level_db",
            "dust_level_mg",
            "chemical_exposure_ppm",
            "temperature_c",
            "humidity_percent",
            "employee_age",
            "bmi",
            "respiratory_issue",
            "non_compliance_flag",
            "sector",
            "district",
        ],
        clf.feature_importances_.tolist(),
    )
)

print("[INFO] Models trained successfully!")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def safe_json(obj):
    """Convert numpy types to native Python for JSON serialisation."""
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, pd.Series):
        return obj.tolist()
    return obj

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/analysis", methods=["GET"])
def overall_analysis():
    """Return high-level dataset statistics."""
    total_members = int(df.shape[0])
    avg_risk_score = float(df["risk_score"].mean())
    risk_counts = df["risk_label"].value_counts().to_dict()
    high_risk_pct = float(risk_counts.get("High", 0) / total_members * 100)
    medium_risk_pct = float(risk_counts.get("Medium", 0) / total_members * 100)
    compliance_rate = float((1 - df["non_compliance_flag"].mean()) * 100)
    respiratory_rate = float(df["respiratory_issue"].mean() * 100)

    sector_counts = df["sector"].value_counts().to_dict()
    district_counts = df["district"].value_counts().to_dict()

    return jsonify({
        "total_members": total_members,
        "avg_risk_score": round(avg_risk_score, 2),
        "risk_distribution": {k: int(v) for k, v in risk_counts.items()},
        "high_risk_percentage": round(high_risk_pct, 2),
        "medium_risk_percentage": round(medium_risk_pct, 2),
        "compliance_rate": round(compliance_rate, 2),
        "respiratory_issue_rate": round(respiratory_rate, 2),
        "sector_counts": sector_counts,
        "district_counts": district_counts,
        "feature_importance": feature_importance,
        "model_accuracy": round(clf_accuracy * 100, 2),
        "model_r2": round(reg_r2 * 100, 2),
    })


@app.route("/api/analytics/sector", methods=["GET"])
def sector_analytics():
    """Risk score breakdown by sector."""
    grouped = df.groupby("sector")["risk_score"].agg(["mean", "min", "max", "count"])
    result = []
    for sector, row in grouped.iterrows():
        # Also compute risk label distribution per sector
        sector_df = df[df["sector"] == sector]
        label_dist = sector_df["risk_label"].value_counts().to_dict()
        result.append({
            "sector": sector,
            "avg_risk_score": round(float(row["mean"]), 2),
            "min_risk_score": round(float(row["min"]), 2),
            "max_risk_score": round(float(row["max"]), 2),
            "member_count": int(row["count"]),
            "risk_distribution": {k: int(v) for k, v in label_dist.items()},
        })
    return jsonify(result)


@app.route("/api/analytics/district", methods=["GET"])
def district_analytics():
    """Risk score breakdown by district."""
    grouped = df.groupby("district")["risk_score"].agg(["mean", "min", "max", "count"])
    result = []
    for district, row in grouped.iterrows():
        district_df = df[df["district"] == district]
        label_dist = district_df["risk_label"].value_counts().to_dict()
        result.append({
            "district": district,
            "avg_risk_score": round(float(row["mean"]), 2),
            "min_risk_score": round(float(row["min"]), 2),
            "max_risk_score": round(float(row["max"]), 2),
            "member_count": int(row["count"]),
            "risk_distribution": {k: int(v) for k, v in label_dist.items()},
        })
    return jsonify(result)


@app.route("/api/analytics/risk-distribution", methods=["GET"])
def risk_distribution():
    """Count of Low / Medium / High risk members."""
    counts = df["risk_label"].value_counts().to_dict()
    result = [{"label": k, "count": int(v)} for k, v in counts.items()]
    return jsonify(result)


@app.route("/api/analytics/environmental", methods=["GET"])
def environmental_analytics():
    """Average environmental metrics by sector."""
    env_cols = ["noise_level_db", "dust_level_mg", "chemical_exposure_ppm", "temperature_c", "humidity_percent"]
    grouped = df.groupby("sector")[env_cols].mean()
    result = []
    for sector, row in grouped.iterrows():
        result.append({
            "sector": sector,
            "avg_noise_db": round(float(row["noise_level_db"]), 2),
            "avg_dust_mg": round(float(row["dust_level_mg"]), 2),
            "avg_chemical_ppm": round(float(row["chemical_exposure_ppm"]), 3),
            "avg_temperature_c": round(float(row["temperature_c"]), 2),
            "avg_humidity_pct": round(float(row["humidity_percent"]), 2),
        })
    return jsonify(result)


@app.route("/api/analytics/correlation", methods=["GET"])
def correlation_matrix():
    """Correlation matrix of key numeric features."""
    numeric_cols = [
        "noise_level_db", "dust_level_mg", "chemical_exposure_ppm",
        "temperature_c", "humidity_percent", "employee_age", "bmi",
        "respiratory_issue", "non_compliance_flag", "risk_score",
    ]
    corr = df[numeric_cols].corr()
    # Return as dict of dicts
    result = {}
    for col in corr.columns:
        result[col] = {row: round(float(corr.loc[row, col]), 4) for row in corr.index}
    return jsonify(result)


@app.route("/api/predict", methods=["POST"])
def predict_risk():
    """
    Predict risk label and score from input parameters.
    Expected JSON body:
    {
        "noise_level_db": 85,
        "dust_level_mg": 3.0,
        "chemical_exposure_ppm": 0.15,
        "temperature_c": 30,
        "humidity_percent": 70,
        "employee_age": 35,
        "bmi": 25,
        "respiratory_issue": 0,
        "non_compliance_flag": 1,
        "sector": "Construction",    // optional, defaults to "Manufacturing"
        "district": "Colombo"        // optional, defaults to "Colombo"
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Parse inputs with defaults
    try:
        sector = data.get("sector", "Manufacturing")
        district = data.get("district", "Colombo")

        # Safely encode sector/district
        if sector in sector_encoder.classes_:
            sector_enc = int(sector_encoder.transform([sector])[0])
        else:
            sector_enc = 0

        if district in district_encoder.classes_:
            district_enc = int(district_encoder.transform([district])[0])
        else:
            district_enc = 0

        features = np.array([[
            float(data.get("noise_level_db", 75)),
            float(data.get("dust_level_mg", 2.0)),
            float(data.get("chemical_exposure_ppm", 0.1)),
            float(data.get("temperature_c", 28)),
            float(data.get("humidity_percent", 65)),
            float(data.get("employee_age", 30)),
            float(data.get("bmi", 24)),
            int(data.get("respiratory_issue", 0)),
            int(data.get("non_compliance_flag", 0)),
            sector_enc,
            district_enc,
        ]])
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

    # Predict
    predicted_label_enc = clf.predict(features)[0]
    predicted_label = risk_label_encoder.inverse_transform([predicted_label_enc])[0]
    predicted_score = float(reg.predict(features)[0])
    probabilities = clf.predict_proba(features)[0]

    # Build class probability dict
    class_probs = {}
    for i, cls in enumerate(risk_label_encoder.classes_):
        class_probs[cls] = round(float(probabilities[i]) * 100, 2)

    # Generate recommendation
    if predicted_label == "High":
        recommendation = "⚠️ CRITICAL: Immediate intervention required. Review all safety protocols, increase monitoring frequency, and conduct emergency safety audits."
    elif predicted_label == "Medium":
        recommendation = "⚡ ATTENTION: Enhanced monitoring recommended. Schedule additional safety training and review workplace conditions within 2 weeks."
    else:
        recommendation = "✅ LOW RISK: Continue standard safety protocols. Maintain regular monitoring and scheduled safety reviews."

    return jsonify({
        "risk_label": predicted_label,
        "risk_score": round(predicted_score, 2),
        "confidence": class_probs,
        "recommendation": recommendation,
        "input_summary": {
            "sector": sector,
            "district": district,
            "noise_level_db": float(data.get("noise_level_db", 75)),
            "dust_level_mg": float(data.get("dust_level_mg", 2.0)),
            "chemical_exposure_ppm": float(data.get("chemical_exposure_ppm", 0.1)),
            "temperature_c": float(data.get("temperature_c", 28)),
            "humidity_percent": float(data.get("humidity_percent", 65)),
            "employee_age": int(data.get("employee_age", 30)),
            "bmi": float(data.get("bmi", 24)),
            "respiratory_issue": int(data.get("respiratory_issue", 0)),
            "non_compliance_flag": int(data.get("non_compliance_flag", 0)),
        },
    })


@app.route("/api/model-info", methods=["GET"])
def model_info():
    """Return information about the trained models."""
    return jsonify({
        "classifier": {
            "type": "RandomForestClassifier",
            "n_estimators": 150,
            "accuracy": round(clf_accuracy * 100, 2),
            "classes": risk_label_encoder.classes_.tolist(),
        },
        "regressor": {
            "type": "RandomForestRegressor",
            "n_estimators": 150,
            "r2_score": round(reg_r2 * 100, 2),
        },
        "feature_importance": feature_importance,
        "dataset_info": {
            "total_records": int(df.shape[0]),
            "features_used": FEATURE_COLS,
            "sectors": sector_encoder.classes_.tolist(),
            "districts": district_encoder.classes_.tolist(),
        },
    })


if __name__ == "__main__":
    print("[INFO] Starting IOSH AI API on http://localhost:5000")
    app.run(debug=True, port=5000)
