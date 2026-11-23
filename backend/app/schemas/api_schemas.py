from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class PredictRequest(BaseModel):
    rainfall_mm: float = Field(..., ge=0, le=1500, description="Monthly Rainfall in mm")
    temperature_c: float = Field(..., ge=10, le=55, description="Mean Temperature in Celsius")
    humidity_pct: float = Field(..., ge=5, le=100, description="Relative Humidity in percentage")
    soil_moisture_pct: float = Field(..., ge=2, le=90, description="Volumetric Soil Moisture in percentage")
    ndvi: float = Field(..., ge=0.0, le=1.0, description="Normalized Difference Vegetation Index (0 to 1)")
    region: Optional[str] = Field("Pune", description="Target Maharashtra Region")

class PredictResponse(BaseModel):
    predicted_drought_category: str
    drought_probabilities: Dict[str, float]
    predicted_crop_yield_ton_ha: float
    linear_regression_yield_ton_ha: float
    input_warnings: List[str]
    explanation: Dict[str, Any]
    regional_context: Optional[Dict[str, Any]] = None

class ScenarioRequest(BaseModel):
    base_region: str
    rainfall_change_pct: float = Field(0.0, description="Percentage change in rainfall (-100 to +100)")
    temperature_change_c: float = Field(0.0, description="Absolute change in temperature (-10 to +10)")
    soil_moisture_change_pct: float = Field(0.0, description="Absolute change in soil moisture (-30 to +30)")
    ndvi_change: float = Field(0.0, description="Absolute change in NDVI (-0.3 to +0.3)")
