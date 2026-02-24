import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioProducto {
  private fuenteProductos = new BehaviorSubject<Producto[]>([]);
  productos$ = this.fuenteProductos.asObservable();

  // Un catálogo base más completo para el autocompletado y datos iniciales
  private catalogoBase: string[] = [
    // Laptops
    'Laptop Dell Inspiron 15', 'MacBook Air M2', 'Lenovo ThinkPad X1', 'Asus ROG Strix G15',
    // Monitores
    'Monitor Samsung 24" Curvo', 'Monitor LG UltraWide 29"', 'Monitor Dell P2723QE 4K',
    // Periféricos
    'Teclado Mecánico Redragon Kumara', 'Mouse Logitech G203 Lightsync', 'Headset HyperX Cloud II', 'Webcam Logitech C920',
    // Componentes
    'Procesador AMD Ryzen 7 5800X', 'Tarjeta Gráfica NVIDIA RTX 4060', 'Memoria RAM Corsair Vengeance 16GB DDR4', 'Disco SSD NVMe Samsung 980 Pro 1TB',
    // Accesorios
    'Silla Gamer Ergonómica', 'Escritorio Ajustable en Altura', 'Mochila para Laptop Antirrobo', 'Soporte para Monitor Doble',
    // Software
    'Licencia Windows 11 Pro', 'Suscripción Office 365 Personal', 'Antivirus Bitdefender Total Security'
  ];

  constructor() {
    const datosGuardados = localStorage.getItem('productosVaixs');
    if (datosGuardados) {
      this.fuenteProductos.next(JSON.parse(datosGuardados));
    } else {
      // ¡Si no hay datos, cargamos unos productos iniciales de ejemplo!
      this.cargarProductosIniciales();
    }
  }

  // Función para crear datos de prueba al inicio
  private cargarProductosIniciales() {
    const productosIniciales: Producto[] = [
      { id: 1, nombre: 'Laptop Dell Inspiron 15', categoria: 'Hardware', precio: 4500, stock: 10 },
      { id: 2, nombre: 'Monitor Samsung 24" Curvo', categoria: 'Periféricos', precio: 1200, stock: 25 },
      { id: 3, nombre: 'Teclado Mecánico Redragon Kumara', categoria: 'Periféricos', precio: 350, stock: 50 },
      { id: 4, nombre: 'Mouse Logitech G203 Lightsync', categoria: 'Periféricos', precio: 200, stock: 4 }, // Stock bajo para probar la alerta
      { id: 5, nombre: 'Licencia Windows 11 Pro', categoria: 'Software', precio: 850, stock: 100 },
      { id: 6, nombre: 'Silla Gamer Ergonómica', categoria: 'Mobiliario', precio: 1800, stock: 8 },
      { id: 7, nombre: 'Disco SSD NVMe Samsung 1TB', categoria: 'Hardware', precio: 650, stock: 15 }
    ];
    this.actualizarYGuardar(productosIniciales);
  }

  buscarEnCatalogo(termino: string): Observable<string[]> {
    const filtro = termino.toLowerCase();
    // Buscamos en el catálogo base y también en los productos ya registrados
    const nombresRegistrados = this.fuenteProductos.value.map(p => p.nombre);
    const universoDeBusqueda = Array.from(new Set([...this.catalogoBase, ...nombresRegistrados]));

    return of(universoDeBusqueda.filter(p => p.toLowerCase().includes(filtro)).slice(0, 10)); // Limitamos a 10 sugerencias
  }

  private actualizarYGuardar(nuevos: Producto[]) {
    this.fuenteProductos.next(nuevos);
    localStorage.setItem('productosVaixs', JSON.stringify(nuevos));
  }

  agregar(producto: Producto) {
    const actuales = this.fuenteProductos.value;
    const nuevos = [...actuales, { ...producto, id: Date.now() }];
    this.actualizarYGuardar(nuevos);
    
    if (!this.catalogoBase.includes(producto.nombre)) {
      this.catalogoBase.push(producto.nombre);
    }
  }

  editar(id: number, productoEditado: Producto) {
    const actuales = this.fuenteProductos.value.map(p => 
      p.id === id ? { ...productoEditado, id } : p
    );
    this.actualizarYGuardar(actuales);
  }

  eliminar(id: number) {
    const actuales = this.fuenteProductos.value.filter(p => p.id !== id);
    this.actualizarYGuardar(actuales);
  }
}