from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.api import deps
from app.models.capacity import CapacityRecord, ForecastRecord
from app.schemas.capacity import CapacityRecord as CapacitySchema, CapacityRecordCreate, ForecastRecord as ForecastSchema
from app.services import capacity_service
from app.forecasting import engine as forecast_engine

router = APIRouter()

@router.get("/", response_model=List[CapacitySchema])
def read_capacity_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    service_name: Optional[str] = None,
    region: Optional[str] = None,
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve capacity records with optional filtering."""
    query = db.query(CapacityRecord)
    if service_name:
        query = query.filter(CapacityRecord.service_name == service_name)
    if region:
        query = query.filter(CapacityRecord.region == region)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=CapacitySchema)
def create_capacity_record(
    *,
    db: Session = Depends(deps.get_db),
    record_in: CapacityRecordCreate,
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new capacity record (Data Ingestion)."""
    return capacity_service.create(db, obj_in=record_in)

@router.get("/forecast", response_model=List[ForecastSchema])
def get_capacity_forecast(
    db: Session = Depends(deps.get_db),
    service_name: str = Query(...),
    region: str = Query(...),
    days: int = Query(30),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """Get forecasted utilization for a specific service and region."""
    # Logic to trigger forecasting engine or retrieve from cache/db
    historical_data = db.query(CapacityRecord).filter(
        CapacityRecord.service_name == service_name,
        CapacityRecord.region == region
    ).order_by(CapacityRecord.timestamp.desc()).limit(100).all()

    if not historical_data:
        raise HTTPException(status_code=404, detail="Not enough historical data for forecasting")

    forecasts = forecast_engine.generate_forecast(historical_data, days=days)
    return forecasts
