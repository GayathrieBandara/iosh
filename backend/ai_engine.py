import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

class SafetyModel:
    def __init__(self):
        self.model = LinearRegression()
        self.trained = False

    def train_mock_model(self):
        # Synthetic Data: [Employees, Past Accidents, Training Hours]
        # Target: Risk Score (0 = Safe, 100 = Dangerous)
        X = np.array([
            [50, 0, 100],  # Small, Safe, Trained
            [200, 5, 50],  # Large, Unsafe, Low Training
            [100, 2, 80],  # Medium, Avg
            [500, 10, 20], # Huge, Dangerous
            [30, 0, 10]    # Small, No training but no accidents yet
        ])
        y = np.array([10, 85, 40, 95, 30])  # Risk Scores
        
        self.model.fit(X, y)
        self.trained = True
        print("AI Model Trained on Synthetic Data.")

    def retrain(self, df: pd.DataFrame):
        """Retrain the model with uploaded historical data"""
        try:
            # Features: Employees, Accidents (history), Training Hours
            # Target: Compliance Score (Inverse of Risk for this demo, or we can mock a risk metric)
            # Let's assume we want to predict 'Safety Score' based on inputs. 
            # If the dataset has 'risk_score', use it. If not, use 'compliance_score' as proxy.
            
            target_col = 'risk_score' if 'risk_score' in df.columns else 'compliance_score'
            feature_cols = ['employees', 'accidents', 'training_hours']
            
            if not all(col in df.columns for col in feature_cols):
                print("Data missing required columns for retraining. Skipping.")
                return

            X = df[feature_cols]
            y = df[target_col]
            
            # If using compliance score (0-100 where 100 is best), we might want to invert it for "Risk"
            # validation: Risk = 100 - Compliance
            if target_col == 'compliance_score':
                y = 100 - y

            self.model.fit(X, y)
            self.trained = True
            print("AI Model Retrained with new data.")
        except Exception as e:
            print(f"Error retraining model: {e}")

    def predict_risk(self, employees: int, accidents: int, training_hours: int):
        if not self.trained:
            self.train_mock_model()
        
        input_data = np.array([[employees, accidents, training_hours]])
        try:
            prediction = self.model.predict(input_data)[0]
        except:
             # Fallback if model fails
             return 50
        
        # Clamp result between 0 and 100
        return max(0, min(100, round(prediction, 2)))

ai_engine = SafetyModel()
# Initialize with mock model on startup
ai_engine.train_mock_model()
