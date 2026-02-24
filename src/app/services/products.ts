import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

// Definimos la estructura exacta de un Producto
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number; // En Bolivianos
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioProducto {
  private fuenteProductos = new BehaviorSubject<Producto[]>([]);
  productos$ = this.fuenteProductos.asObservable();

  // "Base de datos" simulada para el autocompletado
  private catalogoBase: string[] = [
    'Laptop Dell Inspiron 15', 'Monitor Samsung 24" Curvo', 'Teclado Mecánico Redragon', 
    'Mouse Logitech G203', 'Disco SSD Kingston 480GB', 'Memoria RAM HyperX 8GB', 
    'Procesador Ryzen 5 5600G', 'Fuente de Poder Corsair 650W', 'Case Gamer RGB', 
    'Cable HDMI 2.0', 'Licencia Windows 11 Pro', 'Antivirus Kaspersky'
  ];

  constructor() {
    const datosGuardados = localStorage.getItem('productosVaixs');
    if (datosGuardados) {
      this.fuenteProductos.next(JSON.parse(datosGuardados));
    }
  }

  // Método inteligente: Busca coincidencias para el autocompletado
  buscarEnCatalogo(termino: string): Observable<string[]> {
    const filtro = termino.toLowerCase();
    return of(this.catalogoBase.filter(p => p.toLowerCase().includes(filtro)));
  }

  private actualizarYGuardar(nuevos: Producto[]) {
    this.fuenteProductos.next(nuevos);
    localStorage.setItem('productosVaixs', JSON.stringify(nuevos));
  }

  agregar(producto: Producto) {
    const actuales = this.fuenteProductos.value;
    const nuevos = [...actuales, { ...producto, id: Date.now() }];
    this.actualizarYGuardar(nuevos);
    
    // Aprendizaje: Si el usuario escribe un producto nuevo, lo guardamos en el catálogo base
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