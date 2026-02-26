# 📦 Vaixs ERP - Manual de Instrucciones

Bienvenido al sistema **Vaixs ERP**, un sistema de gestión de inventario y ventas moderno, desarrollado con tecnologías de vanguardia y un diseño premium.

---

## 🚀 Tecnologías Utilizadas

- **Angular 20**: Uso de las últimas características del framework.
- **Zoneless Change Detection**: Optimización de rendimiento al eliminar la dependencia de `Zone.js`.
- **Angular Signals**: Gestión de estado reactiva y eficiente.
- **Angular Material**: Componentes de interfaz de usuario de alta calidad.
- **Sass (SCSS)**: Sistema de estilos avanzado con arquitectura modular.
- **RxJS**: Manejo de flujos de datos asíncronos para búsquedas y filtrado.

---

## 🔐 Sistema de Autenticación y Roles

El sistema implementa un control de acceso basado en roles para asegurar la integridad de la información.

### Roles Disponibles

1. **Administrador (admin)**:
   - Acceso total al sistema.
   - Gestión de inventario y visualización del historial.
2. **Vendedor (vendedor)**:
   - Acceso restringido.
   - Solo puede ver el catálogo de ventas y realizar transacciones.
   - No tiene acceso a la configuración de inventario.

### Seguridad Simulada (JWT)

- El sistema simula la generación de un **Token JWT** falso tras el login.
- El token contiene un header, payload (con ID, nombre, rol y expiración) y firma falsa.
- Este token se almacena en `localStorage` como `vaixs_token`.
- Los usuarios registrados se guardan en un array persistente en `localStorage`.

### Reglas de Login Simple

- Si el nombre de usuario contiene la palabra **"admin"**, el sistema le asigna el rol de Administrador.
- Cualquier otro nombre de usuario recibirá el rol de Vendedor regular.

---

## 📦 Gestión de Inventario

Ubicado en el módulo "Inventario", permite el control total de los productos.

### Puntos Clave

- **Registro Masivo**: El formulario de creación permite agregar múltiples productos a una "cola de registro" antes de guardarlos definitivamente, facilitando el ingreso de gran volumen de mercancía.
- **Autocomplete Inteligente**: Al registrar un producto, el sistema sugiere nombres basados en el catálogo existente para evitar duplicidad o errores de escritura.
- **Control de Stock**: Los productos con stock bajo (menos de 5 unidades) se resaltan automáticamente con una alerta visual de color rojo.
- **Buscador en Tiempo Real**: Filtrado instantáneo por nombre o categoría.

---

## 🛒 Ventas y Catálogo

Diseñado para una experiencia de usuario fluida y rápida.

### Funcionalidades

- **Catálogo Visual**: Tarjetas interactivas con efectos de hover premium que muestran precio, categoría y disponibilidad.
- **Filtro por Categoría**: Permite segmentar el catálogo rápidamente.
- **Compra Rápida**: Modal optimizado para agregar productos al carrito y finalizar la venta ingresando el nombre del cliente.
- **Historial de Transacciones**: Registro detallado de cada venta realizada, incluyendo fecha, cliente, productos vendidos y total recaudado.

---

## 🎨 Diseño y Estética Premium

El sistema utiliza una estética **Neon-Dark & Glassmorphism**:

- **Dark Mode**: Fondo degradado radial oscuro para reducir la fatiga visual.
- **Glassmorphism**: Paneles con efectos de desenfocado (blur) y bordes semi-transparentes.
- **Acentos Neón**: Uso de verde neón para elementos críticos y estados de éxito.
- **Tipografía**: Fuente **Outfit** para un aspecto tecnológico y limpio.

---

## 📂 Estructura del Proyecto

- `src/app/services/`: Contiene `AuthService` (autenticación) y `ServicioProducto` (lógica de negocio).
- `src/app/components/`: Organizado por módulos (auth, layout, lista-productos, venta-producto).
- `src/_shared.scss`: Contiene los tokens de diseño compartidos (glass, text-neon).
- `src/app/guards/`: `authGuard` protege las rutas según el estado del usuario.

---

## 🛠️ Ejecución y Desarrollo

- **Servidor de desarrollo**: `npm start` o `ng serve`.
- **Compilación de producción**: `npm run build` o `ng build`.
- **URL por defecto**: `http://localhost:4200`
