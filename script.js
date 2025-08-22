// ========================
// Toggle del menú hamburguesa
// ========================
const toggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (toggle && mobileMenu) {
  toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

// ========================
// Intercambio de menú principal y categorías
// ========================
const productosBtn = document.querySelector(".productos-btn");
const volverBtn = document.querySelector(".volver-btn");

const menuPrincipal = document.querySelector(".menu-principal");
const menuCategorias = document.querySelector(".menu-categorias");

if (productosBtn && volverBtn && menuPrincipal && menuCategorias) {
  // Mostrar categorías y ocultar menú principal
  productosBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menuPrincipal.classList.add("hide");
    menuCategorias.classList.add("active");
  });

  // Volver al menú principal
  volverBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menuCategorias.classList.remove("active");
    menuPrincipal.classList.remove("hide");
  });
}

// ========================
// Carrito lateral
// ========================
const carritoIcon = document.querySelectorAll('a[aria-label="Carrito"]');
const carritoSidebar = document.getElementById("carritoSidebar");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const carritoItems = document.querySelector(".carrito-items");
const carritoTotal = document.getElementById("carritoTotal");

// Recuperar carrito guardado o iniciar vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Abrir carrito
carritoIcon.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    carritoSidebar.classList.add("open");
  });
});

// Cerrar carrito
if (cerrarCarrito) {
  cerrarCarrito.addEventListener("click", () => {
    carritoSidebar.classList.remove("open");
  });
}

// ========================
// Agregar producto al carrito
// ========================
const botonesAgregar = document.querySelectorAll("button[aria-label^='Agregar']");

botonesAgregar.forEach((btn) => {
  btn.addEventListener("click", () => {
    const articulo = btn.closest("article");
    const id = articulo.dataset.productoId || Math.random().toString(36).substr(2, 9);
    const nombre = articulo.querySelector("h3").textContent;
    const precioText = articulo.querySelector("strong")
      ? articulo.querySelector("strong").textContent
      : articulo.querySelector(".precio-nuevo").textContent;
    const precio = parseFloat(precioText.replace("S/", "").trim().replace(",", "."));

    const img = articulo.querySelector("img").src;

    const itemExistente = carrito.find((p) => p.id === id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({ id, nombre, precio, img, cantidad: 1 });
    }

    renderCarrito();
    carritoSidebar.classList.add("open");
  });
});

// ========================
// Renderizar carrito
// ========================
function renderCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.classList.add("carrito-item");

    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}">
      <div class="item-info">
        <h4>${item.nombre}</h4>
        <p>Precio: S/ ${item.precio.toFixed(2)}</p>
        <p>Subtotal: S/ ${subtotal.toFixed(2)}</p>
      </div>
      <div class="cantidad">
        <button class="menos" data-id="${item.id}">-</button>
        <span class="cantidad-text">${item.cantidad}</span>
        <button class="mas" data-id="${item.id}">+</button>
      </div>
      <button class="eliminar" data-id="${item.id}">❌</button>
    `;

    carritoItems.appendChild(div);
  });

  // Guardar carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar total en el HTML
  if (carritoTotal) {
    carritoTotal.textContent = total.toFixed(2);
  }

  // Eventos para +, -, eliminar
  document.querySelectorAll(".menos").forEach((btn) => {
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.id, -1));
  });

  document.querySelectorAll(".mas").forEach((btn) => {
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.id, 1));
  });

  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", () => eliminarItem(btn.dataset.id));
  });
}


// ========================
// Cambiar cantidad
// ========================
function cambiarCantidad(id, delta) {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }
  }
  renderCarrito();
}

// ========================
// Eliminar producto
// ========================
function eliminarItem(id) {
  carrito = carrito.filter((p) => p.id !== id);
  renderCarrito();
}
// Renderizar carrito al cargar la página
renderCarrito();

















const btnFinalizar = document.getElementById("finalizarCompra");

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    // Guardar el carrito en localStorage para la página checkout
    localStorage.setItem("carritoFinal", JSON.stringify(carrito));
    // Redirigir a la página de checkout
    window.location.href = "checkout.html";
  });
}








