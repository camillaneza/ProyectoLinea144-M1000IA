# Proyecto Línea 144 - IA Prediction

![Logo](ui/public/Logo.svg)
<https://proyecto-linea144-m1000-ia.vercel.app/>

## Introducción

Este proyecto, **AI Prediction**, tiene como objetivo desarrollar un modelo de predicción para la línea de atención 144, enfocada en víctimas de violencia de género en Argentina. El modelo, creado con Prophet, permite proyectar la demanda de llamadas, ayudando a mejorar la distribución de recursos y la eficiencia de la respuesta.

## Tecnologías Utilizadas

- **Frontend**: Astro, React, TypeScript, Tailwind CSS
- **Backend**: Flask, Prophet, Python, Pandas
- **Entorno de Desarrollo**: Docker, Node.js, .env
- **Documentación y Gestión**: Trello, GitHub

---

## Instalación

### Requisitos Previos

- **Node.js** y **npm**
- **Python** y **pip**
- **Docker** (opcional para despliegue en contenedores)

### Pasos de Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/monicaalfarop/ProyectoLinea144-M1000IA.git
    cd ProyectoLinea144-M1000IA
    ```

2. Instala las dependencias del frontend:

    ```bash
    npm install
    ```

3. Configura el entorno backend:
   - Crear y activar un entorno virtual de Python:

     ```bash
     python -m venv venv
     source venv/bin/activate  # En Windows: .\venv\Scripts\activate
     ```

   - Instala las dependencias de Python:

     ```bash
     pip install -r requirements.txt
     ```

4. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto:

    ```plaintext
    PORT=4321
    CLIENT_HOST=http://localhost:3000
    FLASK_ENV=development
    ```

---

## Ejecución

### Ejecutar Backend (Flask)

Desde la carpeta principal del proyecto, ejecuta:

```bash
flask run
```

### Ejecutar Frontend (Astro)

```bash
npm run dev
```

---

## Uso del Proyecto

Una vez iniciado el servidor, navega a `http://localhost:3000` para acceder a la aplicación. La página principal incluye una interfaz para la predicción de llamadas, con un formulario que permite seleccionar la fecha inicial. Al presionar "Proyectar", el modelo devuelve un gráfico con la proyección de demanda.

---

## Documentación de Componentes

### Componentes Principales

- **Header**: incluye el logo y el título "IA Prediction".
- **Formulario de Predicción**: permite seleccionar la fecha de inicio de la predicción y proyectar los próximos 7 días.
- **Gráfica de Predicción**: muestra los resultados obtenidos del modelo Prophet.
- **Footer**: muestra los nombres de las integrantes y el logo de la organización.

### API

- **`/predict`** (POST): endpoint para obtener la predicción de llamadas. Envía la fecha de inicio en formato `YYYY-MM-DD` y recibe la proyección para los próximos 7 días.

---

## Equipo de Desarrollo

Este proyecto fue desarrollado por:

- Mónica Alfaro
- Luciana Simón
- Susana Romero
- Luisa Martínez
- Camila Fernández
- Grace Delgado

---

## Licencia

Este proyecto está bajo la Licencia MIT.
