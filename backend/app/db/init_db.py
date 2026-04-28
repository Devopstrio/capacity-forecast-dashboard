from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.capacity import CapacityRecord
from datetime import datetime, timedelta
import random

def init_db(db: Session) -> None:
    # Create Superuser
    user = db.query(User).filter(User.email == "admin@devopstrio.com").first()
    if not user:
        user = User(
            email="admin@devopstrio.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Platform Administrator",
            is_superuser=True,
            role="admin"
        )
        db.add(user)

    # Seed Mock Capacity Data
    services = ["compute", "storage", "database", "network"]
    regions = ["us-east-1", "eu-west-1", "ap-southeast-1"]
    
    existing_records = db.query(CapacityRecord).limit(1).first()
    if not existing_records:
        for service in services:
            for region in regions:
                base_util = random.uniform(30, 60)
                for i in range(60): # 60 days of history
                    timestamp = datetime.utcnow() - timedelta(days=60-i)
                    util = base_util + (i * 0.5) + random.uniform(-5, 5) # slight upward trend
                    record = CapacityRecord(
                        service_name=service,
                        region=region,
                        team="platform-ops",
                        timestamp=timestamp,
                        utilized_capacity=util,
                        total_capacity=100.0,
                        utilization_percentage=util,
                        metadata_json={"env": "prod"}
                    )
                    db.add(record)
    
    db.commit()
