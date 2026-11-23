export interface DatasetOverview {
  total_observations: number;
  features_count: number;
  regions: Record<string, number>;
  years_range: [number, number];
  capped_yield_count: number;
  capped_yield_pct: number;
  avg_rainfall: number;
  avg_drought_index: number;
  avg_crop_yield: number;
  avg_soil_moisture: number;
  avg_ndvi: number;
  drought_distribution: Record<string, number>;
}

export interface OverviewData {
  dataset_overview: DatasetOverview;
  highest_vulnerability_region: string;
  best_predictive_model: {
    regression: string;
    classification: string;
  };
  baseline_comparison: {
    linear_regression_r2_baseline: number;
    linear_regression_r2_current: number;
    decision_tree_accuracy_baseline: number;
    decision_tree_accuracy_current: number;
    random_forest_accuracy_improved: number;
    gradient_boosting_accuracy_improved: number;
  };
}

export interface RegionalClimate {
  Region: string;
  Rainfall_mean: number;
  Rainfall_min: number;
  Rainfall_max: number;
  Temp_mean: number;
  Humidity_mean: number;
  Soil_Moisture_mean: number;
  NDVI_mean: number;
  Drought_Index_mean: number;
  Crop_Yield_mean: number;
}

export interface MonthlyTrend {
  Month: number;
  Rainfall_mm: number;
  Temperature_C: number;
  Humidity_pct: number;
  Soil_Moisture_pct: number;
  NDVI: number;
  Drought_Index: number;
  Crop_Yield_ton_ha: number;
}

export interface RegionalVulnerabilityItem {
  Region: string;
  Observations: number;
  Mean_Drought_Index: number;
  High_Drought_Months_Pct: number;
  Mean_Crop_Yield: number;
  Mean_NDVI: number;
  Mean_Rainfall: number;
  Mean_Soil_Moisture: number;
  RAVI_Score: number;
  Vulnerability_Rank: number;
  Risk_Level: string;
  Analytical_Interpretation: string;
}

export interface PredictionResult {
  predicted_drought_category: string;
  drought_probabilities: Record<string, number>;
  predicted_crop_yield_ton_ha: number;
  linear_regression_yield_ton_ha: number;
  estimated_drought_index: number;
  input_warnings: string[];
  explanation: {
    primary_driver: string;
    driver_effect: string;
    feature_contributions: Record<string, number>;
    model_used: string;
  };
  regional_context?: RegionalVulnerabilityItem;
}

export interface SimulationResult {
  base_region: string;
  is_simulation: boolean;
  disclaimer: string;
  simulated_inputs: {
    rainfall_mm: number;
    temperature_c: number;
    humidity_pct: number;
    soil_moisture_pct: number;
    ndvi: number;
  };
  baseline_prediction: PredictionResult;
  simulated_prediction: PredictionResult;
  impact_analysis: {
    yield_change_ton_ha: number;
    yield_change_pct: number;
    category_transition: string;
    severity_escalated: boolean;
  };
}
