document.getElementById('clear')?.addEventListener('click', function () {
    // Limpiar los campos del formulario
    document.getElementById('client-id').value = '';   // Limpiar el campo del ID del cliente
    document.getElementById('income').value = '';      // Limpiar el campo de ingresos
    document.getElementById('charge').value = '';      // Limpiar el campo de encargo
    document.getElementById('installments').value = ''; // Limpiar el campo de cuotas
    document.getElementById('start-date').value = '';  // Limpiar el campo de fecha de inicio
});

// Generar la planilla al presionar el botón
document.getElementById('generate-planilla-btn')?.addEventListener('click', function () {
    // Obtener valores del formulario
    const clientId = document.getElementById('client-id').value.trim(); // Obtener el ID del cliente
    console.log("Client ID:", clientId);

    if (!clientId || isNaN(clientId)) {
        alert('Por favor, ingresa un ID de cliente válido.');
        return;
    }

    const income = parseFloat(document.getElementById('income').value);
    const charge = parseFloat(document.getElementById('charge').value); 
    const installments = parseInt(document.getElementById('installments').value);
    const startDate = new Date(document.getElementById('start-date').value);

    // Validar valores
    if (isNaN(income) || isNaN(charge) || isNaN(installments) || income <= 0 || charge <= 0 || installments <= 0 || isNaN(startDate.getTime()) || !clientId) {
        alert('Por favor, ingresa valores válidos y un ID de cliente.');
        return;
    }

    // Calcular impuesto total y parcela mensual
    const totalTax = (income * charge) / 100; // Total de impuestos
    const monthlyParcelas = income / installments; // Dividir impuestos entre las parcelas
    const monthlyInstallment = income / installments; // Dividir impuestos entre las parcelas

    // Guardar los datos en localStorage para acceder desde la otra página, usando el ID del cliente
    localStorage.setItem(`planillaData_${clientId}`, JSON.stringify({
        totalTax,
        monthlyParcelas,
        monthlyInstallment,
        charge,  // Guardamos también el encargo
        installments,
        startDate
    }));

    // Redirigir a planilla.html
    window.location.href = 'planilla.html?clientId=' + clientId;
});

// Buscar los datos de la planilla al presionar el botón "Buscar Cliente"
document.getElementById('search-client-btn')?.addEventListener('click', function () {
    const clientId = document.getElementById('client-id').value.trim(); // Obtener el ID del cliente

    if (!clientId) {
        alert('Por favor ingresa un ID de cliente válido.');
        return;
    }

    // Recuperar los datos del cliente desde localStorage
    const data = JSON.parse(localStorage.getItem(`planillaData_${clientId}`));

    if (data) {
        // Si los datos existen, redirigir a la página de la planilla
        window.location.href = 'planilla.html?clientId=' + clientId;
    } else {
        alert('No se encontraron datos para este ID de cliente.');
    }
});

// Mostrar la planilla en planilla.html
if (window.location.pathname.includes('planilla.html')) {
    const tableBody = document.querySelector('#installments-table tbody');
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId'); // Obtener el ID del cliente desde el URL
    
    if (clientId) {
        const data = JSON.parse(localStorage.getItem(`planillaData_${clientId}`));

        if (data) {
            const { totalTax, monthlyParcelas, monthlyInstallment, charge, installments, startDate } = data;

            // Generar las filas de la tabla
            for (let i = 0; i < installments; i++) {
                const installmentDate = new Date(startDate);
                installmentDate.setMonth(installmentDate.getMonth() + i);

                const row = document.createElement('tr');
                const monthlyCharge = charge / installments; // Distribuir el encargo entre las parcelas
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${installmentDate.toLocaleDateString()}</td>
                    <td>R$ ${(monthlyParcelas).toFixed(2)}</td> <!-- Mostrar solo la parcela mensual -->
                    <td>R$ ${monthlyCharge.toFixed(2)}</td> <!-- Mostrar solo el encargo mensual -->
                    <td>R$ ${(monthlyInstallment + monthlyCharge).toFixed(2)}</td> <!-- Mostrar total mensual -->
                `;
                tableBody.appendChild(row);
            }
        } else {
            alert('No se encontraron datos para este ID de cliente.');
            window.location.href = 'index.html'; // Volver si no hay datos
        }
    } else {
        alert('El ID del cliente es necesario para cargar los datos.');
        window.location.href = 'index.html'; // Volver si no se ingresa el ID
    }
}
