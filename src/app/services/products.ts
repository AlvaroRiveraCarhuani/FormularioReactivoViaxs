import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface DetalleVenta {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fecha: Date;
  cliente: string;
  items: DetalleVenta[];
  total: number;
}

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

  private fuenteVentas = new BehaviorSubject<Venta[]>([]);
  ventas$ = this.fuenteVentas.asObservable();

  private catalogoBase: string[] = [
    'Laptop Dell Inspiron 15', 'Monitor Samsung 24"', 'Teclado Mecánico Redragon',
    'Mouse Logitech G203', 'Disco SSD 1TB', 'Memoria RAM 16GB', 'Licencia Windows 11'
  ];

  constructor() {
    const prodGuardados = localStorage.getItem('productosVaixs');
    if (prodGuardados) {
      this.fuenteProductos.next(JSON.parse(prodGuardados));
    } else {
      this.cargarDatosPrueba();
    }

    const ventasGuardadas = localStorage.getItem('ventasVaixs');
    if (ventasGuardadas) {
      this.fuenteVentas.next(JSON.parse(ventasGuardadas));
    }
  }

  private cargarDatosPrueba() {
    const iniciales: Producto[] = [
      { id: 1, nombre: 'Laptop Dell Inspiron 15', categoria: 'Hardware', precio: 4500, stock: 10 },
      { id: 2, nombre: 'Monitor Samsung 24"', categoria: 'Periféricos', precio: 1200, stock: 5 }
    ];
    this.actualizarProductos(iniciales);
  }

  buscarEnCatalogo(termino: string): Observable<string[]> {
    const filtro = termino.toLowerCase();
    return of(this.catalogoBase.filter(p => p.toLowerCase().includes(filtro)));
  }

  private generarId(): number {
    const productos = this.fuenteProductos.value;
    const maxId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) : 0;
    return Math.max(Date.now(), maxId + 1);
  }

  private actualizarProductos(nuevos: Producto[]) {
    this.fuenteProductos.next(nuevos);
    localStorage.setItem('productosVaixs', JSON.stringify(nuevos));
  }

  agregar(producto: Producto) {
    const actuales = this.fuenteProductos.value;
    this.actualizarProductos([...actuales, { ...producto, id: this.generarId() }]);
  }

  agregarMuchos(nuevosProductos: Producto[]) {
    const actuales = this.fuenteProductos.value;
    let baseId = this.generarId();
    const paraAgregar = nuevosProductos.map(p => ({ ...p, id: baseId++ }));
    this.actualizarProductos([...actuales, ...paraAgregar]);
  }

  editar(id: number, productoEditado: Producto) {
    const actuales = this.fuenteProductos.value.map(p => p.id === id ? { ...productoEditado, id } : p);
    this.actualizarProductos(actuales);
  }

  eliminar(id: number) {
    this.actualizarProductos(this.fuenteProductos.value.filter(p => p.id !== id));
  }

  registrarVenta(nuevaVenta: Venta) {
    const ventasActualizadas = [...this.fuenteVentas.value, nuevaVenta];
    this.fuenteVentas.next(ventasActualizadas);
    localStorage.setItem('ventasVaixs', JSON.stringify(ventasActualizadas));

    const inventarioActualizado = this.fuenteProductos.value.map(prod => {
      const itemVendido = nuevaVenta.items.find(item => item.productoNombre === prod.nombre);
      if (itemVendido) {
        const stockCalculado = prod.stock - itemVendido.cantidad;
        return { ...prod, stock: stockCalculado < 0 ? 0 : stockCalculado };
      }
      return prod;
    });

    this.actualizarProductos(inventarioActualizado);
  }
}