document.getElementById('predictionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const inputDate = document.getElementById('inputDate').value;
    if (!inputDate) {
        alert("Por favor, ingresa una fecha válida.");
        return;
    }

    // Realizar solicitud a la API
    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_date: inputDate })
    });

    if (response.ok) {
        const data = await response.json();
        
        // Actualizar el HTML con los datos recibidos
        document.getElementById('tableContainer').innerHTML = data.result_html;
        document.getElementById('chartContainer').innerHTML = data.graph_html;
        document.getElementById('averageFuture').innerText = `Promedio 7 días futuros: ${data.average_future.toFixed(2)}`;
        document.getElementById('averagePast').innerText = `Promedio 7 días pasados: ${data.average_past.toFixed(2)}`;
    } else {
        const error = await response.json();
        alert(`Error en la predicción: ${error.error}`);
    }
});
