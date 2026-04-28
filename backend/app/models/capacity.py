import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class CapacityRecord(Base):
    __tablename__ = "capacity_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    service_name = Column(String, index=True, nullable=False) # e.g., "compute", "storage", "db"
    region = Column(String, index=True, nullable=False)
    team = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    
    # Capacity Metrics
    utilized_capacity = Column(Float, nullable=False)
    total_capacity = Column(Float, nullable=False)
    utilization_percentage = Column(Float, nullable=False)
    
    # Optional metadata (JSON)
    metadata_json = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)

class ForecastRecord(Base):
    __tablename__ = "forecasts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    service_name = Column(String, index=True, nullable=False)
    region = Column(String, index=True, nullable=False)
    team = Column(String, index=True, nullable=False)
    
    # Forecast Details
    target_date = Column(DateTime, index=True, nullable=False)
    predicted_utilization = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=True)
    confidence_upper = Column(Float, nullable=True)
    
    model_used = Column(String, nullable=False) # e.g., "moving_average", "trend"
    generated_at = Column(DateTime, default=datetime.utcnow)
