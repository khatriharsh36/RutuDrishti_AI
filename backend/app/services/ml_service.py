import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

class MLService:
    def __init__(self, models_dir="backend/app/models/saved"):
        self.models_dir = models_dir
        self.summary = {}
        
        # Load analytics summary JSON
        summary_path = os.path.join(models_dir, "analytics_summary.json")
        if os.path.exists(summary_path):
            with open(summary_path, "r") as f:
                self.summary = json.load(f)
                
        # Load models
        self.rf_clf = joblib.load(os.path.join(models_dir, "random_forest_classifier.joblib"))
        self.dt_clf = joblib.load(os.path.join(models_dir, "decision_tree_classifier.joblib"))
        self.gb_clf = joblib.load(os.path.join(models_dir, "gradient_boosting_classifier.joblib"))
        
        self.rf_reg = joblib.load(os.path.join(models_dir, "random_forest_regressor.joblib"))
        self.lr_reg = joblib.load(os.path.join(models_dir, "multiple_linear_regression.joblib"))
        self.gb_reg = joblib.load(os.path.join(models_dir, "gradient_boosting_regressor.joblib"))
        
        self.clf_features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI']
        self.reg_features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index']
        
        # Training distribution bounds for input warning validation
        self.training_bounds = {
            'Rainfall_mm': (5.0, 950.0),
            'Temperature_C': (18.0, 44.0),
            'Humidity_pct': (18.0, 95.0),
            'Soil_Moisture_pct': (8.0, 65.0),
            'NDVI': (0.15, 0.88)
        }

    def predict(self, rainfall: float, temp: float, humidity: float, soil_moisture: float, ndvi: float, region: str = "Pune") -> Dict[str, Any]:
        warnings = []
        inputs = {
            'Rainfall_mm': rainfall,
            'Temperature_C': temp,
            'Humidity_pct': humidity,
            'Soil_Moisture_pct': soil_moisture,
            'NDVI': ndvi
        }
        
        # Input boundary validation
        for feat, val in inputs.items():
            low, high = self.training_bounds[feat]
            if val < low:
                warnings.append(f"Input '{feat}' ({val}) is below training distribution minimum ({low}). Prediction may extrapolate.")
            elif val > high:
                warnings.append(f"Input '{feat}' ({val}) exceeds training distribution maximum ({high}). Prediction may extrapolate.")
                
        # Prepare feature DataFrame for classification (strictly excluding Drought_Index to prevent leakage)
        X_clf = pd.DataFrame([[rainfall, temp, humidity, soil_moisture, ndvi]], columns=self.clf_features)
        
        # Classification prediction & probabilities
        pred_cat = self.rf_clf.predict(X_clf)[0]
        probs = self.rf_clf.predict_proba(X_clf)[0]
        class_labels = self.rf_clf.classes_.tolist()
        prob_dict = {label: round(float(prob), 4) for label, prob in zip(class_labels, probs)}
        
        # Estimate drought index for regression input (using surrogate formulation)
        # di_est ~ 4.3 - 0.0038*R - 0.032*SM - 1.6*NDVI + 0.035*(T-25)
        di_est = np.clip(4.3 - 0.0038 * rainfall - 0.032 * soil_moisture - 1.6 * ndvi + 0.035 * (temp - 25), 0.5, 5.0)
        
        X_reg = pd.DataFrame([[rainfall, temp, humidity, soil_moisture, ndvi, di_est]], columns=self.reg_features)
        
        rf_yield = float(self.rf_reg.predict(X_reg)[0])
        lr_yield = float(self.lr_reg.predict(X_reg)[0])
        
        # Local Explainability (feature contributions relative to baseline means)
        avg_rf = 224.5
        avg_sm = 26.1
        avg_ndvi = 0.417
        
        contributions = {
            'Rainfall_mm': round((rainfall - avg_rf) * 0.012, 3),
            'Soil_Moisture_pct': round((soil_moisture - avg_sm) * 0.045, 3),
            'NDVI': round((ndvi - avg_ndvi) * 2.8, 3),
            'Temperature_C': round((temp - 28.5) * -0.03, 3)
        }
        
        top_driver = max(contributions, key=lambda k: abs(contributions[k]))
        top_driver_direction = "positive for crop yield" if contributions[top_driver] > 0 else "suppressing crop productivity / elevating drought risk"
        
        # Regional context if available
        reg_info = None
        if 'regional_vulnerability' in self.summary:
            for item in self.summary['regional_vulnerability']:
                if item['Region'].lower() == region.lower():
                    reg_info = item
                    break
                    
        return {
            'predicted_drought_category': pred_cat,
            'drought_probabilities': prob_dict,
            'predicted_crop_yield_ton_ha': round(min(8.5, max(0.5, rf_yield)), 2),
            'linear_regression_yield_ton_ha': round(lr_yield, 2),
            'estimated_drought_index': round(float(di_est), 2),
            'input_warnings': warnings,
            'explanation': {
                'primary_driver': top_driver,
                'driver_effect': top_driver_direction,
                'feature_contributions': contributions,
                'model_used': "Random Forest Ensemble (Non-linear & Capped-Yield resilient)"
            },
            'regional_context': reg_info
        }

    def simulate_scenario(self, base_region: str, rain_pct: float, temp_c: float, sm_pct: float, ndvi_delta: float):
        # Look up baseline values for region
        reg_baseline = {
            'Solapur': {'Rainfall_mm': 190.3, 'Temperature_C': 31.8, 'Humidity_pct': 48.0, 'Soil_Moisture_pct': 23.6, 'NDVI': 0.381},
            'Ahmednagar': {'Rainfall_mm': 221.2, 'Temperature_C': 30.2, 'Humidity_pct': 51.5, 'Soil_Moisture_pct': 25.6, 'NDVI': 0.410},
            'Pune': {'Rainfall_mm': 236.2, 'Temperature_C': 28.4, 'Humidity_pct': 55.0, 'Soil_Moisture_pct': 26.6, 'NDVI': 0.428},
            'Satara': {'Rainfall_mm': 210.3, 'Temperature_C': 26.2, 'Humidity_pct': 58.5, 'Soil_Moisture_pct': 26.0, 'NDVI': 0.412},
            'Nashik': {'Rainfall_mm': 264.5, 'Temperature_C': 27.2, 'Humidity_pct': 60.0, 'Soil_Moisture_pct': 28.8, 'NDVI': 0.455}
        }
        
        base = reg_baseline.get(base_region, reg_baseline['Pune'])
        
        # Apply hypothetical shifts
        sim_rain = max(5.0, base['Rainfall_mm'] * (1 + rain_pct / 100.0))
        sim_temp = max(15.0, base['Temperature_C'] + temp_c)
        sim_sm = np.clip(base['Soil_Moisture_pct'] + sm_pct, 5.0, 70.0)
        sim_ndvi = np.clip(base['NDVI'] + ndvi_delta, 0.1, 0.9)
        sim_hum = np.clip(base['Humidity_pct'] + (rain_pct * 0.1) - (temp_c * 0.8), 20.0, 95.0)
        
        baseline_pred = self.predict(
            base['Rainfall_mm'], base['Temperature_C'], base['Humidity_pct'],
            base['Soil_Moisture_pct'], base['NDVI'], base_region
        )
        
        simulated_pred = self.predict(
            sim_rain, sim_temp, sim_hum, sim_sm, sim_ndvi, base_region
        )
        
        yield_delta = round(simulated_pred['predicted_crop_yield_ton_ha'] - baseline_pred['predicted_crop_yield_ton_ha'], 2)
        
        return {
            'base_region': base_region,
            'is_simulation': True,
            'disclaimer': "HYPOTHETICAL SCENARIO SIMULATION — NOT AN EMPIRICAL REAL-WORLD OBSERVATION OR OFFICIAL WARNING.",
            'simulated_inputs': {
                'rainfall_mm': round(sim_rain, 1),
                'temperature_c': round(sim_temp, 1),
                'humidity_pct': round(sim_hum, 1),
                'soil_moisture_pct': round(sim_sm, 1),
                'ndvi': round(sim_ndvi, 3)
            },
            'baseline_prediction': baseline_pred,
            'simulated_prediction': simulated_pred,
            'impact_analysis': {
                'yield_change_ton_ha': yield_delta,
                'yield_change_pct': round((yield_delta / max(0.1, baseline_pred['predicted_crop_yield_ton_ha'])) * 100, 2),
                'category_transition': f"{baseline_pred['predicted_drought_category']} -> {simulated_pred['predicted_drought_category']}",
                'severity_escalated': simulated_pred['drought_probabilities']['High'] > baseline_pred['drought_probabilities']['High']
            }
        }
