from flask import Flask, render_template, request
import pandas as pd
import pickle
from prophet import Prophet
import plotly.express as px
import plotly.io as pio
from datetime import datetime, timedelta

# Cargar el archivo Prophet pkl
model_path = r"C:\Users\carol\Documents\mujeres ia\api\prophet_model.pkl"

with open(model_path, 'rb') as f:
    model = pickle.load(f)

app = Flask(__name__)

# Ruta principal para mostrar el formulario de fecha
@app.route('/predict', methods=['GET'])
def index():
    return render_template('index.html')

# Ruta para hacer predicciones
@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_date = request.form.get('input_date')
        if not input_date:
            return "Error: Por favor ingresa una fecha válida."

        start_date = pd.to_datetime(input_date)

        future_dates = pd.date_range(start=start_date, periods=7)
        future = pd.DataFrame({'ds': future_dates})
        forecast = model.predict(future)

        result = forecast[['ds', 'yhat']]
        average_future = result['yhat'].mean()

        past_dates = pd.date_range(end=start_date - timedelta(days=1), periods=7)
        past = pd.DataFrame({'ds': past_dates})
        past_forecast = model.predict(past)
        past_result = past_forecast[['ds', 'yhat']]
        average_past = past_result['yhat'].mean()
        difference = average_future - average_past

        result_html = result.to_html(index=False)

        fig = px.line(result, x='ds', y='yhat', title='Predicciones para 7 días', width=800, height=400)
        graph_html = pio.to_html(fig, full_html=False)

        return render_template('prediction.html', 
                               result_html=result_html, 
                               graph_html=graph_html, 
                               average_future=average_future, 
                               average_past=average_past,
                               difference=difference)
    
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
