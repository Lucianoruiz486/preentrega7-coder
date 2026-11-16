// ===================================================
// Pre-Entrega 7: Interfaz dinámica con DOM y eventos
// Simulador: Validador de Stock de un negocio de indumentaria deportiva
// Continuación de las pre-entregas anteriores: la clase Producto y la lógica
// de stock ahora se manejan desde la página (sin prompt, alert ni consola)
// ===================================================

// ===================================================
// 1. CLASE (Pre-Entrega 5): la "fábrica" de productos del simulador
// ===================================================
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  // INFORMA: indica si hay unidades suficientes para el pedido
  hayStock(cantidad) {
    return cantidad <= this.stock;
  }

  // MODIFICA el estado: descuenta unidades. Solo vende enteros mayores a 0 que alcancen el stock
  // Retorna true si la venta se realizó y false si no
  vender(cantidad) {
    if (Number.isInteger(cantidad) && cantidad > 0 && this.hayStock(cantidad)) {
      this.stock = this.stock - cantidad;
      return true;
    }
    return false;
  }

  // MODIFICA el estado: baja el precio según el porcentaje (solo entre 0 y 100, sin incluirlos)
  aplicarDescuento(porcentaje) {
    if (porcentaje > 0 && porcentaje < 100) {
      this.precio = Math.round(this.precio - (this.precio * porcentaje) / 100);
    }
    return this.precio;
  }

  // CALCULA: precio final con IVA (21%), sin modificar el precio base
  calcularPrecioConIva() {
    return Math.round(this.precio * 1.21);
  }
}

// ===================================================
// 2. ESTADO DEL SIMULADOR: el array de objetos que se dibuja en pantalla
// ===================================================
let productos = [
  new Producto(1, "Zapatillas Running", 85000, 10),
  new Producto(2, "Remera Deportiva", 22000, 15),
  new Producto(3, "Short Deportivo", 18000, 12),
  new Producto(4, "Medias", 6000, 30),
  new Producto(5, "Mochila", 35000, 8),
  new Producto(6, "Botella Térmica", 9000, 0),
];

// Contador para dar un id único a cada producto nuevo (aunque se eliminen otros)
let proximoId = 7;

// ===================================================
// 3. SELECCIÓN DE ELEMENTOS DEL DOM
// ===================================================
const contenedorProductos = document.getElementById("contenedor-productos");
const mensaje = document.getElementById("mensaje");

const inputNombre = document.querySelector("#input-nombre");
const inputPrecio = document.querySelector("#input-precio");
const inputStock = document.querySelector("#input-stock");
const btnAgregar = document.querySelector("#btn-agregar");

const inputBuscar = document.querySelector("#input-buscar");
const checkDisponibles = document.querySelector("#check-disponibles");

const statProductos = document.querySelector("#stat-productos");
const statUnidades = document.querySelector("#stat-unidades");
const statValor = document.querySelector("#stat-valor");
const statAgotados = document.querySelector("#stat-agotados");

// ===================================================
// 4. FUNCIONES AUXILIARES
// ===================================================

// Formatea un número como precio argentino: 45000 -> "45.000"
const formatearPrecio = (valor) => valor.toLocaleString("es-AR");

// Evita que el texto escrito por el usuario se interprete como HTML dentro del innerHTML
function escaparHtml(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// FEEDBACK VISUAL: muestra un mensaje en pantalla y lo oculta solo a los 3,5 segundos
// tipo: "exito" (verde), "error" (rojo) o "info" (azul)
let temporizadorMensaje;
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje mensaje--${tipo}`;

  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(() => {
    mensaje.className = "mensaje oculto";
  }, 3500);
}

// FILTRO: devuelve los productos que coinciden con el texto buscado y con "solo con stock"
function obtenerProductosFiltrados() {
  const texto = inputBuscar.value.trim().toLowerCase();

  return productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(texto) &&
      (!checkDisponibles.checked || producto.stock > 0)
  );
}

// ===================================================
// 5. RENDERIZADO DINÁMICO
// ===================================================

// Recorre el array y dibuja una tarjeta por cada producto usando template strings
function renderizarProductos(lista) {
  if (lista.length === 0) {
    contenedorProductos.innerHTML = `<p class="vacio">No hay productos para mostrar.</p>`;
    return;
  }

  contenedorProductos.innerHTML = lista
    .map((producto) => {
      const agotado = producto.stock === 0;

      return `
        <article class="card ${agotado ? "card--agotado" : ""}" data-id="${producto.id}">
          <span class="etiqueta">${agotado ? "Agotado" : "En stock"}</span>
          <h3>${escaparHtml(producto.nombre)}</h3>
          <p class="card__precio">$${formatearPrecio(producto.precio)}</p>
          <p class="card__detalle">Con IVA: $${formatearPrecio(producto.calcularPrecioConIva())}</p>
          <p class="card__detalle">Stock: ${producto.stock} unidades</p>
          <div class="card__acciones">
            <button class="btn btn--primario" data-accion="vender" data-id="${producto.id}" ${agotado ? "disabled" : ""}>Vender 1</button>
            <button class="btn btn--secundario" data-accion="descuento" data-id="${producto.id}">-10%</button>
            <button class="btn btn--peligro" data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
          </div>
        </article>`;
    })
    .join("");
}

// Actualiza el resumen del inventario (reduce suma, filter cuenta)
function actualizarResumen() {
  const unidades = productos.reduce((acumulado, producto) => acumulado + producto.stock, 0);
  const valorInventario = productos.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.stock,
    0
  );
  const agotados = productos.filter((producto) => producto.stock === 0).length;

  statProductos.textContent = productos.length;
  statUnidades.textContent = unidades;
  statValor.textContent = `$${formatearPrecio(valorInventario)}`;
  statAgotados.textContent = agotados;
}

// Vuelve a dibujar todo cada vez que el array cambia; si se pasa un id, resalta esa tarjeta
function actualizarVista(idResaltado) {
  renderizarProductos(obtenerProductosFiltrados());
  actualizarResumen();

  if (idResaltado !== undefined) {
    const tarjeta = document.querySelector(`.card[data-id="${idResaltado}"]`);
    if (tarjeta) {
      tarjeta.classList.add("resaltada");
    }
  }
}

// ===================================================
// 6. ACCIONES DEL SIMULADOR
// ===================================================

// Valida los datos del formulario y agrega un producto nuevo al array
function agregarProducto() {
  const nombre = inputNombre.value.trim();
  const precio = Number(inputPrecio.value);
  const stock = Number(inputStock.value);

  if (nombre === "") {
    mostrarMensaje("Ingresá el nombre del producto.", "error");
  } else if (!(precio > 0)) {
    mostrarMensaje("Ingresá un precio mayor a 0.", "error");
  } else if (inputStock.value === "" || !Number.isInteger(stock) || stock < 0) {
    mostrarMensaje("Ingresá un stock entero (0 o más).", "error");
  } else if (productos.some((producto) => producto.nombre.toLowerCase() === nombre.toLowerCase())) {
    mostrarMensaje(`Ya existe un producto llamado "${nombre}".`, "error");
  } else {
    const nuevoProducto = new Producto(proximoId, nombre, precio, stock);
    proximoId++;
    productos.push(nuevoProducto);

    // Se limpian el formulario y los filtros para que el producto nuevo se vea seguro
    inputNombre.value = "";
    inputPrecio.value = "";
    inputStock.value = "";
    inputBuscar.value = "";
    checkDisponibles.checked = false;

    mostrarMensaje(`Agregaste "${nuevoProducto.nombre}" al catálogo.`, "exito");
    actualizarVista(nuevoProducto.id);
  }
}

// Vende 1 unidad validando el stock con el método del objeto
function venderUnidad(producto) {
  if (producto.vender(1)) {
    mostrarMensaje(`Vendiste 1 unidad de ${producto.nombre}. Quedan ${producto.stock}.`, "exito");
  } else {
    mostrarMensaje(`${producto.nombre} está agotado.`, "error");
  }
  actualizarVista(producto.id);
}

// Aplica un 10% de descuento con el método del objeto
function aplicarDescuentoDiez(producto) {
  producto.aplicarDescuento(10);
  mostrarMensaje(`${producto.nombre} ahora cuesta $${formatearPrecio(producto.precio)}.`, "info");
  actualizarVista(producto.id);
}

// Quita el producto del array (filter se queda con todos los demás)
function eliminarProducto(producto) {
  productos = productos.filter((item) => item.id !== producto.id);
  mostrarMensaje(`Eliminaste "${producto.nombre}" del catálogo.`, "info");
  actualizarVista();
}

// ===================================================
// 7. EVENTOS
// ===================================================

// CLICK en el botón Agregar
btnAgregar.addEventListener("click", agregarProducto);

// TECLADO: Enter en cualquier campo del formulario también agrega el producto
[inputNombre, inputPrecio, inputStock].forEach((campo) => {
  campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      agregarProducto();
    }
  });
});

// TECLADO: la búsqueda filtra la lista mientras se escribe; Esc limpia el buscador
inputBuscar.addEventListener("keyup", (evento) => {
  if (evento.key === "Escape") {
    inputBuscar.value = "";
  }
  actualizarVista();
});

// CAMBIO en el checkbox "Solo con stock"
checkDisponibles.addEventListener("change", () => {
  actualizarVista();
});

// CLICK en los botones de cada tarjeta. Como las tarjetas se vuelven a dibujar
// cada vez, se escucha un solo click en el contenedor y se lee qué botón se tocó
contenedorProductos.addEventListener("click", (evento) => {
  const accion = evento.target.dataset.accion;
  const id = Number(evento.target.dataset.id);
  const producto = productos.find((item) => item.id === id);

  if (accion === undefined || producto === undefined) {
    return;
  }

  switch (accion) {
    case "vender":
      venderUnidad(producto);
      break;
    case "descuento":
      aplicarDescuentoDiez(producto);
      break;
    case "eliminar":
      eliminarProducto(producto);
      break;
  }
});

// ===================================================
// 8. INICIO: dibuja el catálogo apenas carga la página
// ===================================================
actualizarVista();
