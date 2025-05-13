function compararFactura() {
  const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked')?.value;
  const mantenimiento = document.querySelector('input[name="mantenimiento"]:checked')?.value;
  const consentimiento = document.getElementById("consentimiento").checked;
  const conduce = document.querySelector('input[name="conduces"]:checked')?.value;
  const litrosMensuales = conduce === "si" ? parseFloat(document.getElementById("litrosMensuales").value) || 0 : 0;

  const dias = parseInt(document.getElementById("dias").value);
  const facturaActual = parseFloat(document.getElementById("facturaActual").value);

  if (!consentimiento) {
    document.getElementById("resultado").innerHTML = "<p style='color:red;'>Debes aceptar el uso de datos para continuar.</p>";
    return;
  }

  let facturaGeslama = 0;
  let saldoWaylet = 0;
  let ahorro = 0;
  let ahorroTotal = 0;
  let resultado = "";

  let terminoEnergia = 0;
  let terminoPotencia = 0;

  if (tipoCliente === "empresa30") {
    const consumoP1 = parseFloat(document.getElementById("consumoP1").value) || 0;
    const consumoP2 = parseFloat(document.getElementById("consumoP2").value) || 0;
    const consumoP3 = parseFloat(document.getElementById("consumoP3").value) || 0;
    const consumoP4 = parseFloat(document.getElementById("consumoP4").value) || 0;
    const consumoP5 = parseFloat(document.getElementById("consumoP5").value) || 0;
    const consumoP6 = parseFloat(document.getElementById("consumoP6").value) || 0;

    const potenciaP1 = parseFloat(document.getElementById("potenciaP1").value) || 0;
    const potenciaP2 = parseFloat(document.getElementById("potenciaP2").value) || 0;
    const potenciaP3 = parseFloat(document.getElementById("potenciaP3").value) || 0;
    const potenciaP4 = parseFloat(document.getElementById("potenciaP4").value) || 0;
    const potenciaP5 = parseFloat(document.getElementById("potenciaP5").value) || 0;
    const potenciaP6 = parseFloat(document.getElementById("potenciaP6").value) || 0;

    // Precios sin IVA
    const preciosConsumo = [0.1799, 0.1759, 0.1719, 0.1699, 0.1409, 0.1309];
    const preciosPotencia = [20.90, 12.90, 5.90, 4.90, 3.90, 2.90];

    const consumos = [consumoP1, consumoP2, consumoP3, consumoP4, consumoP5, consumoP6];
    const potencias = [potenciaP1, potenciaP2, potenciaP3, potenciaP4, potenciaP5, potenciaP6];

    consumos.forEach((kWh, i) => {
      terminoEnergia += kWh * preciosConsumo[i];
    });

    potencias.forEach((kW, i) => {
      terminoPotencia += (kW * preciosPotencia[i] / 365) * dias;
    });

    let subtotal = terminoEnergia + terminoPotencia;
    const impuestoElectrico = subtotal * 0.05113;
    const iva = (subtotal + impuestoElectrico) * 0.21;
    facturaGeslama = subtotal + impuestoElectrico + iva;

    if (mantenimiento === "si") {
      const mensual = 10.735;
      const mensualConIVA = mensual * 1.21 * (10 / 12); // prorrateado con 2 meses gratis
      facturaGeslama += mensualConIVA;
    }

    ahorro = facturaActual - facturaGeslama;
    ahorroTotal = ahorro;

  } else {
    const consumo = parseFloat(document.getElementById("consumo").value);
    const potenciaPunta = parseFloat(document.getElementById("potenciaPunta").value);
    const potenciaValle = parseFloat(document.getElementById("potenciaValle").value);

    if (isNaN(consumo) || isNaN(potenciaPunta) || isNaN(potenciaValle) || isNaN(dias) || isNaN(facturaActual)) {
      document.getElementById("resultado").innerHTML = "<p style='color:red;'>Rellena todos los campos correctamente.</p>";
      return;
    }

    const precioConsumo = mantenimiento === "si" ? 0.1299 : 0.1399;
    const precioPotenciaDia = 24.90 / 365;

    terminoEnergia = consumo * precioConsumo;
    terminoPotencia = (potenciaPunta + potenciaValle) * precioPotenciaDia * dias;

    let subtotal = terminoEnergia + terminoPotencia;
    const impuestoElectrico = subtotal * 0.05113;
    const iva = (subtotal + impuestoElectrico) * 0.21;
    facturaGeslama = subtotal + impuestoElectrico + iva;

    if (mantenimiento === "si") {
      const mensual = 8.26;
      const mensualConIVA = mensual * 1.21 * (10 / 12); // prorrateado con 2 meses gratis
      facturaGeslama += mensualConIVA;
    }

    ahorro = facturaActual - facturaGeslama;

    saldoWaylet = (tipoCliente === "particular" && conduce === "si" && litrosMensuales > 0)
      ? litrosMensuales * 0.10
      : 0;

    ahorroTotal = ahorro + saldoWaylet;
  }

  resultado = `<p><strong>Con Grupo Geslama (${mantenimiento === "si" ? "con" : "sin"} servicio adicional) pagarías aprox.:</strong> ${facturaGeslama.toFixed(2)} €</p>`;

  if (ahorro > 0) {
    resultado += `<p style="color:green;"><strong>¡Podrías ahorrar hasta ${ahorro.toFixed(2)} € al mes!</strong></p>`;
  } else if (ahorro <= -20) {
    resultado += `<p style="color:orange;"><strong>¡Tienes una tarifa estupenda! Pero si renuevas, podríamos ayudarte a mejorarla.</strong></p>`;
  } else {
    resultado += `<p style="color:#f16500;"><strong>Tu tarifa actual es algo mejor, pero podrías compensarlo con otros beneficios.</strong></p>`;
  }

  if (saldoWaylet > 0) {
    resultado += `<p><strong>Además, acumularías ${saldoWaylet.toFixed(2)} € al mes en Waylet por repostar.</strong></p>`;
  }

  if (ahorroTotal > 0) {
    resultado += `
      <p style="font-weight: bold; font-size: 1.1rem; margin-top: 10px;">
        Ahorro total estimado: <span style="color: green;">${ahorroTotal.toFixed(2)} €</span> al mes.
      </p>
      <p style="font-weight: bold; margin-top: 20px;">¿Quieres aprovechar este ahorro?</p>
      <a href="https://wa.me/34626189906?text=Hola,%20acabo%20de%20simular%20mi%20factura%20en%20la%20web%20de%20Grupo%20Geslama%20y%20quiero%20más%20información.%20Mi%20ahorro%20sería%20de%20${ahorro.toFixed(2)}%20euros%20al%20mes."
         target="_blank"
         style="display: inline-block; background-color: #25D366; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; margin-top: 10px;">
        💬 Habla con nosotros por WhatsApp
      </a>
      <p style="margin-top: 10px; font-size: 0.9rem;">
        ¿Prefieres que te llamemos? <a href="/contacto" style="color: #f26522; font-weight: bold;">Déjanos tus datos aquí</a>.
      </p>`;
  }

  document.getElementById("resultado").innerHTML = resultado;

  // Enviar datos al backend (Apps Script)
  fetch("https://geslama-proxy.vercel.app/api/simuladorLuz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipoCliente,
      mantenimiento,
      conduce,
      litrosMensuales,
      dias,
      facturaActual,
      facturaGeslama: facturaGeslama.toFixed(2),
      ahorro: ahorro.toFixed(2),
      saldoWaylet: saldoWaylet.toFixed(2),
      ahorroTotal: ahorroTotal.toFixed(2),
      consumo,
      potenciaPunta,
      potenciaValle,
      consumoP1,
      consumoP2,
      consumoP3,
      consumoP4,
      consumoP5,
      consumoP6,
      potenciaP1,
      potenciaP2,
      potenciaP3,
      potenciaP4,
      potenciaP5,
      potenciaP6
    })
  });
}
