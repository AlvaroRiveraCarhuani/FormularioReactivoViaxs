import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ServicioProducto, Producto, Venta } from '../../../services/products';
import { Observable, startWith, map } from 'rxjs';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-compra-rapida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatAutocompleteModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './compra-rapida.html',
  styleUrls: ['./compra-rapida.scss']
})
export class CompraRapidaComponent implements OnInit {
  formBusqueda!: FormGroup;
  formCliente!: FormGroup;
  productosDisponibles: Producto[] = [];
  productosFiltrados$!: Observable<Producto[]>;
  carrito: ItemCarrito[] = [];
  totalGeneral = 0;

  constructor(
    private fb: FormBuilder,
    private servicio: ServicioProducto,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CompraRapidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formBusqueda = this.fb.group({
      productoSeleccionado: [''],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.formCliente = this.fb.group({
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.servicio.productos$.subscribe(prods => {
      this.productosDisponibles = prods;
      if (this.data?.productoPreseleccionado) {
        this.procesarAgregado(this.data.productoPreseleccionado, 1);
      }
    });

    this.productosFiltrados$ = this.formBusqueda.get('productoSeleccionado')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(nombre => (nombre ? this._filtrar(nombre) : this.productosDisponibles.slice()))
    );
  }

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
      const itemEnCarrito = this.carrito.find(i => i.producto.id === prod.id);
      const cantidadTotalEnCarrito = (itemEnCarrito?.cantidad || 0) + cant;

      if (cantidadTotalEnCarrito > prod.stock) {
        this.snackBar.open(`Stock insuficiente. Solo quedan ${prod.stock} unidades.`, 'Cerrar', { duration: 3000 });
        return;
      }

      this.procesarAgregado(prod, cant);
      this.formBusqueda.get('productoSeleccionado')?.setValue('');
      this.formBusqueda.get('cantidad')?.setValue(1);
    }
  }

  procesarAgregado(producto: Producto, cantidad: number) {
    const existe = this.carrito.find(item => item.producto.id === producto.id);
    if (existe) {
      existe.cantidad += cantidad;
      existe.subtotal = existe.cantidad * existe.producto.precio;
    } else {
      this.carrito.push({ producto, cantidad, subtotal: cantidad * producto.precio });
    }
    this.calcularTotal();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalGeneral = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  finalizarCompra() {
    if (this.formCliente.valid && this.carrito.length > 0) {
      const nuevaVenta: Venta = {
        id: Date.now(),
        fecha: new Date(),
        cliente: this.formCliente.get('nombreCliente')?.value,
        total: this.totalGeneral,
        items: this.carrito.map(item => ({
          productoNombre: item.producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.subtotal
        }))
      };

      this.servicio.registrarVenta(nuevaVenta);
      this.dialogRef.close(true);
    }
  }
}