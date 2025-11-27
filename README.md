# KJM Sports Web

Aplicación web construida con React + Vite y React Bootstrap, con control de acceso por roles y flujo de compra integrado con un backend Spring Boot.

## Requisitos
- Node.js 18+
- Backend API corriendo en `http://localhost:8080` (Spring Boot)
	- Endpoints usados: `GET /api/productos`, `GET /api/categorias`, `GET /api/boletas`, `POST /api/boletas`

## Instalación y Ejecución

```powershell
npm install
npm run dev
```

La app de desarrollo quedará disponible en `http://localhost:5173` (por defecto de Vite).

## Roles y Acceso
- **ADMIN**: acceso total. Puede usar todas las vistas (tienda, carrito, checkout, mis compras, etc.) y el panel de administración.
- **VENDEDOR**: acceso restringido al panel de ventas/administración. No ve las vistas de tienda en la barra de navegación.
- **CLIENTE**: acceso a la tienda, carrito, checkout, perfil y mis compras.

## Rutas Clave
- `/` Inicio
- `/productos` Listado de productos
- `/categoria/:idCategoria` Filtrado por categoría
- `/carrito` Carrito de compras
- `/checkout` Finalización de compra
- `/mis-compras` Historial de boletas del usuario
- `/perfil` Perfil del usuario
- `/admin` Panel de administración/ventas

## Integración de Boletas
Al finalizar compra se envía `POST /api/boletas` con el siguiente payload:

```json
{
	"usuario": { "id": 123 },
	"detalles": [
		{ "producto": { "id": 1 }, "cantidad": 2 },
		{ "producto": { "id": 5 }, "cantidad": 1 }
	]
}
```

El backend (entidad `Boleta`) debe asociar la boleta al usuario (`@ManyToOne Usuario usuario`) y persistir `detalles` (`@OneToMany DetalleBoleta`).

### Confirmación y Mis Compras
- La página de confirmación muestra número y fecha de boleta, y resumen del pedido.
- `Mis Compras` lista las boletas del usuario y permite ver el detalle de productos de cada boleta.

## Notas
- La marca en la barra de navegación redirige a `/admin` para VENDEDOR y a `/` para otros roles.
- El badge del carrito se oculta cuando la cantidad total es 0.

