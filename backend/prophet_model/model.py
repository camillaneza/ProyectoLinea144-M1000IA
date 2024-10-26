import pandas as pd
import pickle
from prophet import Prophet
from typing import Optional


def load_prophet_model(file_path: str) -> Optional[Prophet]:
    model: Optional[Prophet] = None
    try:
        with open(file_path, 'rb') as f:
            model = pickle.load(f)
    except Exception as e:
        print(f"Error loading the model: {e}")
    return model


def predict_forcast(model: Prophet, start_date, days_range: int = 7) -> pd.DataFrame:
    start_date = pd.to_datetime(start_date)
    future_dates = pd.date_range(start=start_date, periods=days_range)
    future = pd.DataFrame({'ds': future_dates})

    forecast = model.predict(future)
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

    return result
