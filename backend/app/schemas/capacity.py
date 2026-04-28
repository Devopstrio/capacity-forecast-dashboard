from typing import Optional, List, Dict
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# Capacity Record Schemas
class CapacityRecordBase(BaseModel):
    service_name: str
    region: str
    team: str
    timestamp: datetime
    utilized_capacity: float
    total_capacity: float
    utilization_percentage: float
    metadata_json: Optional[Dict] = {}

class CapacityRecordCreate(CapacityRecordBase):
    pass

class CapacityRecord(CapacityRecordBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Forecast Record Schemas
class ForecastRecordBase(BaseModel):
    service_name: str
    region: str
    team: str
    target_date: datetime
    predicted_utilization: float
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    model_used: str

class ForecastRecordCreate(ForecastRecordBase):
    pass

class ForecastRecord(ForecastRecordBase):
    id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True

# Aggregated Analytics Schema
class CapacityAnalytics(BaseModel):
    service_name: str
    current_avg_utilization: float
    peak_utilization: float
    forecast_30_days: float
    status: str # "normal", "warning", "critical"
