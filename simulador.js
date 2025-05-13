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

  let consumo = 0;
  let potenciaPunta = 0;
  let potenciaValle = 0;

  let consumoP1 = 0, consumoP2 = 0, consumoP3 = 0, consumoP4 = 0, consumoP5 = 0, consumoP6 = 0;
  let potenciaP1 = 0, potenciaP2 = 0, potenciaP3 = 0, potenciaP4 = 0, potenciaP5 = 0, potenciaP6 = 0;

  if (tipoCliente === "empresa30") {
    consumoP1 = parseFloat(document.getElementById("consumoP1").value) || 0;
    consumoP2 = parseFloat(document.getElementById("consumoP2").value) || 0;
    consumoP3 = parseFloat(document.getElementById("consumoP3").value) || 0;
    consumoP4 = parseFloat(document.getElementById("consumoP4").value) || 0;
    consumoP5 = parseFloat(document.getElementById("consumoP5").value) || 0;
    consumoP6 = parseFloat(document.getElementById("consumoP6").value) || 0;

    potenciaP1 = parseFloat(document.getElementById("potenciaP1").value) || 0;
    potenciaP2 = parseFloat(document.getElementById("potenciaP2").value) || 0;
    potenciaP3 = parseFloat(document.getElementById("potenciaP3").value) || 0;
    potenciaP4 = parseFloat(document.getElementById("potenciaP4").value) || 0;
    potenciaP5 = parseFloat(document.getElementById("potenciaP5").value) || 0;
    potenciaP6 = parseFloat(document.getElementById("potenciaP6").value) || 0;

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

    const subtotal = terminoEnergia + terminoPotencia;
    const impuestoElectrico = subtotal * 0.05113;
    const iva = (subtotal + impuestoElectrico) * 0.21;
    facturaGeslama = subtotal + impuestoElectrico + iva;

    if (mantenimiento === "si") {
      facturaGeslama += 10.735 * 1.21 * (10 / 12);
    }

    ahorro = facturaActual - facturaGeslama;
    ahorroTotal = ahorro;

  } else {
    consumo = parseFloat(document.getElementById("consumo").value);
    potenciaPunta = parseFloat(document.getElementById("potenciaPunta").value);
    potenciaValle = parseFloat(document.getElementById("potenciaValle").value);

    if (isNaN(consumo) || isNaN(potenciaPunta) || isNaN(potenciaValle) || isNaN(dias) || isNaN(facturaActual)) {
      document.getElementById("resultado").innerHTML = "<p style='color:red;'>Rellena todos los campos correctamente.</p>";
      return;
    }

    const precioConsumo = mantenimiento === "si" ? 0.1299 : 0.1399;
    const precioPotenciaDia = 24.90 / 365;

    terminoEnergia = consumo * precioConsumo;
    terminoPotencia = (potenciaPunta + potenciaValle) * precioPotenciaDia * dias;

    const subtotal = terminoEnergia + terminoPotencia;
    const impuestoElectrico = subtotal * 0.05113;
    const iva = (subtotal + impuestoElectrico) * 0.21;
    facturaGeslama = subtotal + impuestoElectrico + iva;

    if (mantenimiento === "si") {
      facturaGeslama += 8.26 * 1.21 * (10 / 12);
    }

    ahorro = facturaActual - facturaGeslama;
    saldoWaylet = (tipoCliente === "particular" && conduce === "si" && litrosMensuales > 0) ? litrosMensuales * 0.10 : 0;
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
    const mensajeWhatsApp = `Hola, acabo de simular mi factura en la web de Grupo Geslama como cliente ${tipoCliente.toUpperCase()} y me salía un ahorro estimado de ${ahorro.toFixed(2)} € al mes. Me gustaría recibir más información.`;

    resultado += `
      <p style="font-weight: bold; font-size: 1.1rem; margin-top: 10px;">
        Ahorro total estimado: <span style="color: green;">${ahorroTotal.toFixed(2)} €</span> al mes.
      </p>
      <p style="font-weight: bold; margin-top: 20px;">¿Quieres aprovechar este ahorro?</p>
      <a href="https://wa.me/34626189906?text=${encodeURIComponent(mensajeWhatsApp)}"
         target="_blank"
         style="display: inline-block; background-color: #25D366; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; margin-top: 10px;">
        💬 Habla con nosotros por WhatsApp
      </a>
      <div style="margin-top: 25px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
        <p><strong>¿Prefieres que te llamemos?</strong> Déjanos tus datos y te contactamos gratis:</p>
        <form id="formContacto">
          <input type="text" name="nombre" placeholder="Tu nombre" required style="width: 100%; padding: 8px; margin-bottom: 8px;">
          <input type="tel" name="telefono" placeholder="Tu teléfono" required style="width: 100%; padding: 8px; margin-bottom: 8px;">
          <input type="hidden" name="tipoCliente" value="${tipoCliente}">
          <input type="hidden" name="facturaActual" value="${facturaActual}">
          <input type="hidden" name="facturaGeslama" value="${facturaGeslama.toFixed(2)}">
          <input type="hidden" name="ahorro" value="${ahorro.toFixed(2)}">
          <input type="hidden" name="ahorroTotal" value="${ahorroTotal.toFixed(2)}">
          <button type="submit" style="background-color: #f26522; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-weight: bold;">📞 Quiero que me llaméis</button>
        </form>
        <p id="mensajeConfirmacion" style="margin-top: 10px; color: green;"></p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = resultado;

  setTimeout(() => {
    const form = document.getElementById("formContacto");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        datos.contacto = "si";

        fetch("https://geslama-proxy.vercel.app/api/simuladorLuz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        })
          .then(res => res.text())
          .then(() => {
            form.style.display = "none";
            document.getElementById("mensajeConfirmacion").innerText = "¡Gracias! Te llamaremos pronto.";
          })
          .catch(err => {
            console.error("Error al enviar contacto:", err);
          });
      });
    }
  }, 100);

  fetch("https://geslama-proxy.vercel.app/api/simuladorLuz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
