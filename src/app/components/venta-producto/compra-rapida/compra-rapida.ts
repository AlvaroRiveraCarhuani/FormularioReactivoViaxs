import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; // Para la lista visual
import { ServicioProducto, Producto } from '../../../services/products';
import { Observable, startWith, map } from 'rxjs';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-compra-rapida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatAutocompleteModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './compra-rapida.html',
  styleUrls: ['./compra-rapida.scss']
})
export class CompraRapidaComponent implements OnInit {
  formBusqueda!: FormGroup;
  productosDisponibles: Producto[] = [];
  productosFiltrados$!: Observable<Producto[]>;
  
  carrito: ItemCarrito[] = [];
  totalGeneral = 0;

  constructor(
    private fb: FormBuilder,
    private servicio: ServicioProducto,
    private dialogRef: MatDialogRef<CompraRapidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formBusqueda = this.fb.group({
      productoSeleccionado: ['', Validators.required], // Input de búsqueda
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });

    // Cargar productos para el autocompletado
    this.servicio.productos$.subscribe(prods => {
      this.productosDisponibles = prods;
      
      // Si venimos de un botón "Agregar" directo
      if (this.data?.productoPreseleccionado) {
        this.agregarDirecto(this.data.productoPreseleccionado);
      }
    });

    // Filtro del autocompletado
    this.productosFiltrados$ = this.formBusqueda.get('productoSeleccionado')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(nombre => (nombre ? this._filtrar(nombre) : this.productosDisponibles.slice()))
    );
  }

  // Para mostrar el nombre en el input en vez del objeto
  displayFn(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  private _filtrar(nombre: string): Producto[] {
    const filtro = nombre.toLowerCase();
    return this.productosDisponibles.filter(p => p.nombre.toLowerCase().includes(filtro));
  }

  agregarAlCarrito() {
    const prod = this.formBusqueda.get('productoSeleccionado')?.value;
    const cant = this.formBusqueda.get('cantidad')?.value;

    if (prod && typeof prod === 'object' && cant > 0) {
      this.procesarAgregado(prod, cant);
    }
  }

  agregarDirecto(prod: Producto) {
    this.procesarAgregado(prod, 1);
  }

  procesarAgregado(producto: Producto, cantidad: number) {
    // Verificar si ya existe en el carrito
    const existe = this.carrito.find(item => item.producto.id === producto.id);

    if (existe) {
      existe.cantidad += cantidad;
      existe.subtotal = existe.cantidad * existe.producto.precio;
    } else {
      this.carrito.push({
        producto: producto,
        cantidad: cantidad,
        subtotal: cantidad * producto.precio
      });
    }

    this.calcularTotal();
    // Limpiar formulario para seguir añadiendo rápido
    this.formBusqueda.patchValue({ productoSeleccionado: '', cantidad: 1 });
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalGeneral = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  finalizarCompra() {
    // Aquí iría la lógica para descontar stock del servicio
    alert(`Venta realizada por Bs ${this.totalGeneral}`);
    this.dialogRef.close(true);
  }
}