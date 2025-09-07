// Obtener elementos
const tipoCompraRadios = document.querySelectorAll('input[name="tipo-compra"]');
const tiendaDiv = document.getElementById('tienda');
const deliveryDiv = document.getElementById('delivery');
const totalCompra = document.getElementById('totalCompra');
const generarPDFBtn = document.getElementById('generarPDF');

// Obtener carrito guardado
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

// Mostrar total inicial
totalCompra.textContent = total.toFixed(2);

// Mostrar opciones según selección
tipoCompraRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'tienda') {
      tiendaDiv.style.display = 'block';
      deliveryDiv.style.display = 'none';
      totalCompra.textContent = total.toFixed(2); // sin envío
    } else {
      deliveryDiv.style.display = 'block';
      tiendaDiv.style.display = 'none';
      totalCompra.textContent = (total + 10.00).toFixed(2); // con envío
    }
  });
});

// Generar PDF
generarPDFBtn.addEventListener('click', () => {
  let contenido = 'Detalle de compra:\n\n';
  carrito.forEach(item => {
    contenido += `${item.nombre} - S/ ${item.precio.toFixed(2)} x ${item.cantidad} = S/ ${(item.precio*item.cantidad).toFixed(2)}\n`;
  });

  let totalFinal = total;
  let tipoCompra = document.querySelector('input[name="tipo-compra"]:checked')?.value;

  if (tipoCompra === 'tienda') {
    const localSeleccionado = document.querySelector('input[name="local"]:checked');
    if (!localSeleccionado) { alert('Selecciona un local'); return; }
    contenido += `\nRecojo en tienda: ${localSeleccionado.value} (${localSeleccionado.dataset.direccion})`;
  } else if (tipoCompra === 'delivery') {
    const form = document.getElementById('form-delivery');
    if (!form.nombre.value || !form.direccion.value || !form.telefono.value) {
      alert('Completa todos los campos de delivery');
      return;
    }
    totalFinal += 5.90;
    contenido += `\nDelivery a: ${form.direccion.value}\nNombre: ${form.nombre.value}\nTeléfono: ${form.telefono.value}\nCosto de envío: S/ 5.90`;
  } else {
    alert('Selecciona tipo de compra');
    return;
  }

  contenido += `\n\nTotal final: S/ ${totalFinal.toFixed(2)}`;

  // Crear PDF usando jsPDF
  import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(jsPDFModule => {
    const { jsPDF } = jsPDFModule;
    const doc = new jsPDF();
    doc.text(contenido, 10, 10);
    doc.save('compra.pdf');

    // Instrucciones para WhatsApp
    alert(`Envía el PDF y la captura del Yape al WhatsApp: 912886670`);
  });
});


















// checkout.js

// checkout.js

// checkout.js

// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const tipoCompraRadios = document.querySelectorAll('input[name="tipo-compra"]');
  const tiendaDiv = document.getElementById("tienda");
  const deliveryDiv = document.getElementById("delivery");
  const generarPDFBtn = document.getElementById("generarPDF");

  // Cargar carrito del localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  tipoCompraRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "tienda") {
        tiendaDiv.style.display = "block";
        deliveryDiv.style.display = "none";
      } else {
        tiendaDiv.style.display = "none";
        deliveryDiv.style.display = "block";
      }
    });
  });

  generarPDFBtn.addEventListener("click", () => {
    if (!window.jspdf) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = generarPDF;
      document.body.appendChild(script);
    } else {
      generarPDF();
    }
  });

  function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    doc.setFontSize(16);
    doc.text("Detalle de Compra", 10, y);
    y += 10;

    // Listado de productos
    doc.setFontSize(12);
    carrito.forEach(item => {
      let linea = `${item.nombre} - S/ ${item.precio.toFixed(2)} x ${item.cantidad} = S/ ${(item.precio * item.cantidad).toFixed(2)}`;
      doc.text(linea, 10, y);
      y += 8;
    });

    y += 5;

    // Tipo de compra
    const tipoSeleccionado = document.querySelector('input[name="tipo-compra"]:checked');
    if (tipoSeleccionado) {
      doc.setFontSize(12);
      doc.text(`Tipo de compra: ${tipoSeleccionado.value}`, 10, y);
      y += 10;

      if (tipoSeleccionado.value === "tienda") {
        const localSeleccionado = document.querySelector('input[name="local"]:checked');
        if (localSeleccionado) {
          // Tomar solo el texto del label (dirección completa)
          const direccionCompleta = localSeleccionado.parentElement.innerText
            .replace(/^\s*📍\s*/, "") // eliminar el icono 📍 si existe
            .trim();

          doc.text(`Dirección del local: ${direccionCompleta}`, 10, y);
          y += 10;
        } else {
          doc.text("⚠ No se seleccionó ningún local.", 10, y);
          y += 10;
        }
      } else if (tipoSeleccionado.value === "delivery") {
        const form = document.getElementById("form-delivery");
        doc.text(`Nombre: ${form.nombre.value}`, 10, y);
        y += 8;
        doc.text(`Dirección: ${form.direccion.value}`, 10, y);
        y += 8;
        doc.text(`Teléfono: ${form.telefono.value}`, 10, y);
        y += 10;

        total += 5.90; // costo de envío
        doc.text("Costo de envío: S/ 5.90", 10, y);
        y += 10;
      }
    }

    // Total final
    doc.setFontSize(14);
    doc.text(`TOTAL FINAL: S/ ${total.toFixed(2)}`, 10, y + 5);

    // Guardar PDF
    doc.save("compra.pdf");
  }
});

