from flask import Flask, render_template_string, request
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

# Crear una aplicación Flask
app = Flask(__name__)

# Ruta principal para mostrar el formulario de fecha
@app.route('/predict', methods=['GET'])
def index():
    return render_template_string("""
    <html>
        <head>
            <title>Predicciones Prophet</title>
        </head>
        <body>
            <h1>Ingresar la fecha para predicciones de los proximos 7 días</h1>
            <form action="/predict" method="POST">
                <label for="input_date">Fecha (dd/mm/yyyy):</label>
                <input type="date" id="input_date" name="input_date" required>
                <button type="submit">Predecir</button>
            </form>
        </body>
    </html>
    """)

# Ruta para hacer predicciones
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Obtener la fecha ingresada por el usuario
        input_date = request.form.get('input_date')
        
        if not input_date:
            return "Error: Por favor ingresa una fecha válida."

        # Convertir la fecha ingresada a formato datetime
        start_date = pd.to_datetime(input_date)

        # Crear dataframe para los próximos 7 días desde la fecha ingresada
        future_dates = pd.date_range(start=start_date, periods=7)
        future = pd.DataFrame({'ds': future_dates})
        
        # Hacer predicciones
        forecast = model.predict(future)

        # Filtrar columnas y obtener predicciones de los próximos 7 días y su promedio
        result = forecast[['ds', 'yhat']]
        average_future = result['yhat'].mean()

        # 7 dias anteriores a la fecha ingresada ---aca toca pensar porque en realidad no tendriamos valores futuros reales solo forecast
        past_dates = pd.date_range(end=start_date - timedelta(days=1), periods=7) #atras 1 periodo de 7 dias
        past = pd.DataFrame({'ds': past_dates})
        
        # Hacer predicciones para los últimos 7 días
        past_forecast = model.predict(past)
        past_result = past_forecast[['ds', 'yhat']]
        average_past= past_result['yhat'].mean()
        difference=average_future-average_past
                
        # Convertir el dataframe resultante a HTML el de los futuros 7 dias 
        result_html = result.to_html(index=False)

        # Crear un gráfico de líneas solo para los próximos 7 días
        fig = px.line(result, x='ds', y='yhat', title='Predicciones para 7 días' , width=800, height=400)
        graph_html = pio.to_html(fig, full_html=False)

        # Renderizar la tabla y el gráfico HTML 
        return render_template_string(f"""
        <html>
            <head>
                <title>Predicciones Prophet</title>
            </head>
            <body>
                <h1>Predicciones para 7 días</h1>
                {result_html}
                <h2>Gráfico de Predicciones</h2>
                {graph_html}
                 <!-- Tarjetas de promedio -->
                <div class="card">
                    <div class="card-title">Promedio 7 días futuros</div>
                    <div class="card-value">{average_future:.2f}</div>
                </div>
                
                <div class="card">
                    <div class="card-title">Promedio 7 días pasados</div>
                    <div class="card-value">{average_past:.2f}</div>
            </body>
        </html>
        """)
    
    except Exception as e:
        return f"Error: {str(e)}"

# Ejecutar la API en el puerto 5000
if __name__ == '__main__':
    app.run(debug=True, port=5000)
