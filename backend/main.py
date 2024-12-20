import os
from flask import Flask, request
from flask_cors import CORS
from prophet_model.model import load_prophet_model, predict_forcast
from dotenv import load_dotenv
from datetime import timedelta
import pandas as pd

load_dotenv()

script_dir = os.path.dirname(os.path.abspath(__file__))
model_filename = "prophet_model.pkl"
file_path = os.path.join(script_dir, model_filename)
model = load_prophet_model(file_path)
port = os.getenv("PORT")
client_host = os.getenv("CLIENT_HOST")
flask_env = os.getenv("FLASK_ENV")

print(port, client_host)

if not model:
    exit(1)

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})


@app.route("/")
def health_check():
    return "OK"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_date = request.json["date"]
        if not input_date:
            raise Exception("Invalid date")

        df = predict_forcast(model, start_date=input_date)
        df_past = predict_forcast(model, start_date=pd.to_datetime(input_date) - timedelta(days=7))
        df['avg'] = df["yhat"].mean()
        df['past_avg'] = df_past["yhat"].mean()

        return df.to_json()

    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == '__main__':
    app.run(debug=flask_env != "production", port=port)
