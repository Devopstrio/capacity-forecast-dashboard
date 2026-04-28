from sqlalchemy.orm import Session
from app.models.capacity import CapacityRecord
from app.schemas.capacity import CapacityRecordCreate

def create(db: Session, *, obj_in: CapacityRecordCreate) -> CapacityRecord:
    db_obj = CapacityRecord(
        service_name=obj_in.service_name,
        region=obj_in.region,
        team=obj_in.team,
        timestamp=obj_in.timestamp,
        utilized_capacity=obj_in.utilized_capacity,
        total_capacity=obj_in.total_capacity,
        utilization_percentage=obj_in.utilization_percentage,
        metadata_json=obj_in.metadata_json
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_multi(db: Session, *, skip: int = 0, limit: int = 100):
    return db.query(CapacityRecord).offset(skip).limit(limit).all()
