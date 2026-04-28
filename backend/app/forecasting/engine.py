import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List
from app.models.capacity import CapacityRecord

def generate_forecast(historical_records: List[CapacityRecord], days: int = 30):
    """
    Forecasting Engine: Generates utilization predictions using a Trend Projection model.
    """
    if len(historical_records) < 5:
        return []

    # Convert to DataFrame for analysis
    data = [
        {"timestamp": r.timestamp, "utilization": r.utilization_percentage}
        for r in historical_records
    ]
    df = pd.DataFrame(data)
    df = df.sort_values("timestamp")

    # Simple Linear Regression (Trend)
    df['time_index'] = np.arange(len(df))
    z = np.polyfit(df['time_index'], df['utilization'], 1)
    p = np.poly1d(z)

    last_date = df['timestamp'].max()
    last_index = df['time_index'].max()

    forecast_results = []
    for i in range(1, days + 1):
        target_date = last_date + timedelta(days=i)
        predicted_val = p(last_index + i)
        
        # Clamp between 0 and 120 (allow overflow for warnings)
        predicted_val = max(0, min(120, predicted_val))

        forecast_results.append({
            "service_name": historical_records[0].service_name,
            "region": historical_records[0].region,
            "team": historical_records[0].team,
            "target_date": target_date,
            "predicted_utilization": round(predicted_val, 2),
            "confidence_lower": round(predicted_val * 0.9, 2),
            "confidence_upper": round(predicted_val * 1.1, 2),
            "model_used": "trend_projection"
        })

    return forecast_results
