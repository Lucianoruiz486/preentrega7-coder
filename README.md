# Simulador de Ventas - Validador de Stock

Simulador en JavaScript para un negocio de indumentaria deportiva. Es la **Pre-Entrega 7 (DOM y eventos)**: el catálogo de productos (instancias de la clase `Producto`) se dibuja en la página y todo se maneja desde la interfaz, sin `prompt`, `alert` ni consola.

## Estructura del repositorio
```
preentrega7-coder/
├── index.html      # estructura de la página; enlaza el CSS y el JS (con defer)
├── README.md
├── css/
│   └── style.css   # estilos y layout
└── js/
    └── main.js     # clase Producto, renderizado y eventos
```

## Cómo ejecutarlo
1. Descargá o cloná el repositorio.
2. Abrí `index.html` con doble clic. No hace falta instalar nada.

## Qué se puede hacer
- Ver el catálogo y un resumen del inventario (productos, unidades, valor total y agotados).
- **Agregar un producto** con el formulario (botón o tecla Enter) sin recargar la página.
- **Vender 1 unidad**, aplicar **-10%** o **eliminar** cada producto desde su tarjeta.
- **Buscar** escribiendo en el buscador (la lista se filtra con cada tecla; Esc lo limpia) y filtrar **solo con stock**.
- Ver un **mensaje en pantalla** por cada acción (verde: éxito, rojo: error, azul: información) y un **resaltado** en la tarjeta modificada.

## Criterios de la consigna y dónde se cumplen
| Criterio | Dónde está |
|---|---|
| Estructura y vinculación (15%) | `index.html` en la raíz, `css/style.css` y `js/main.js` enlazados en el `head` |
| Selección del DOM (15%) | Sección 3 de `main.js`: `getElementById` y `querySelector` |
| Renderizado dinámico (30%) | `renderizarProductos()`: recorre el array con `map` y arma cada tarjeta con template strings e `innerHTML` |
| Eventos (30%) | `click` (agregar y botones de cada tarjeta), `keydown` (Enter en el formulario), `keyup` (buscador y Esc) y `change` (checkbox) |
| Estilos básicos (10%) | `css/style.css`: paleta de colores, layout con grid, tarjetas, botones y estados |
