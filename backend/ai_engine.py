from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd

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

    def predict_risk(self, employees: int, accidents: int, training_hours: int):
        if not self.trained:
            self.train_mock_model()
        
        input_data = np.array([[employees, accidents, training_hours]])
        prediction = self.model.predict(input_data)[0]
        
        # Clamp result between 0 and 100
        return max(0, min(100, round(prediction, 2)))

ai_engine = SafetyModel()
ai_engine.train_mock_model()
