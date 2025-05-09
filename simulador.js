function toggleLitros() {
  const conduce = document.querySelector('input[name="conduces"]:checked')?.value;
  const wrapper = document.getElementById("litrosWrapper");
  wrapper.style.display = conduce === "si" ? "block" : "none";
}

function compararFactura() {
  const consumo = parseFloat(document.getElementById("consumo").value);
  const potenciaPunta = parseFloat(document.getElementById("potenciaPunta").value);
  const potenciaValle = parseFloat(document.getElementById("potenciaValle").value);
  const dias = parseInt(document.getElementById("dias").value);
  const facturaActual = parseFloat(document.getElementById("facturaActual").value);
  const mantenimiento = document.querySelector('input[name="mantenimiento"]:checked')?.value;
  const consentimiento = document.getElementById("consentimiento").checked;
  const conduce = document.querySelector('input[name="conduces"]:checked')?.value;
  const litrosMensuales = conduce === "si" ? parseFloat(document.getElementById("litrosMensuales").value) || 0 : 0;

  if (
    isNaN(consumo) || isNaN(potenciaPunta) || isNaN(potenciaValle) ||
    isNaN(dias) || isNaN(facturaActual) || (conduce === "si" && litrosMensuales <= 0)
  ) {
    document.getElementById("resultado").innerHTML = "<p style='color:red;'>Rellena todos los campos correctamente.</p>";
    return;
  }

  if (!consentimiento) {
    document.getElementById("resultado").innerHTML = "<p style='color:red;'>Debes aceptar el uso de datos para continuar.</p>";
    return;
  }

  const precioConsumo = mantenimiento === "si" ? 0.1299 : 0.1399;
  const precioPotenciaDia = 0.081917;

  const terminoEnergia = consumo * precioConsumo;
  const terminoPotencia = (potenciaPunta + potenciaValle) * precioPotenciaDia * dias;
  const subtotal = terminoEnergia + terminoPotencia;

  const impuestoElectrico = subtotal * 0.05113;
  const subtotalConImpuesto = subtotal + impuestoElectrico;
  const iva = subtotalConImpuesto * 0.21;
  let facturaGeslama = subtotal + impuestoElectrico + iva;

  let mantenimientoTexto = "sin servicio de mantenimiento";
  if (mantenimiento === "si") {
    const mantenimientoBase = 5.78;
    const mantenimientoIVA = mantenimientoBase * 0.21;
    facturaGeslama += mantenimientoBase + mantenimientoIVA;
    mantenimientoTexto = "con servicio de mantenimiento";
  }

  const ahorro = facturaActual - facturaGeslama;
  const saldoWaylet = litrosMensuales * 0.10;
  const ahorroTotal = ahorro + saldoWaylet;

  let resultado = `<p><strong>Con Grupo Geslama (${mantenimientoTexto}) pagarías aprox.:</strong> ${facturaGeslama.toFixed(2)} €</p>`;

  if (ahorro > 0) {
    resultado += `<p style="color:green;"><strong>¡Podrías ahorrar hasta ${ahorro.toFixed(2)} € al mes!</strong></p>`;
  } else if (ahorro <= -20) {
    resultado += `<p style="color:orange;"><strong>¡Tienes una tarifa estupenda! Pero si renuevas, podríamos ayudarte a mejorarla.</strong></p>`;
  } else {
    resultado += `<p style="color:#f16500;"><strong>Tu tarifa actual es algo mejor, pero podrías compensarlo con los beneficios de Waylet.</strong></p>`;
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

  fetch("https://geslama-proxy.vercel.app/api/simuladorLuz", {
    method: "POST",
    body: JSON.stringify({
      consumo,
      potenciaPunta,
      potenciaValle,
      dias,
      facturaActual,
      mantenimiento,
      conduce,
      litrosMensuales,
      facturaGeslama: facturaGeslama.toFixed(2),
      ahorro: ahorro.toFixed(2),
      saldoWaylet: saldoWaylet.toFixed(2),
      ahorroTotal: ahorroTotal.toFixed(2)
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}
