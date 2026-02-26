import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServicioProducto, Producto } from '../../services/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { CompraRapidaComponent } from './compra-rapida/compra-rapida';

@Component({
  selector: 'app-venta-productos',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatChipsModule
  ],
  templateUrl: './venta-productos.html',
  styleUrls: ['./venta-productos.scss'] // <--- ¡OJO AQUÍ! Debe coincidir exactamente
})
export class VentaProductosComponent implements OnInit {
  // ... (El resto de la lógica que ya tenías está bien)
  productosFiltrados$!: Observable<Producto[]>;
  controlCategoria = new FormControl('');
  categorias = ['Hardware', 'Software', 'Periféricos', 'Redes', 'Mobiliario', 'Accesorios'];

  constructor(private servicio: ServicioProducto, private dialog: MatDialog) {
    this.productosFiltrados$ = combineLatest([
      this.servicio.productos$,
      this.controlCategoria.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([productos, categoriaSeleccionada]) => {
        if (!categoriaSeleccionada) return productos;
        return productos.filter(p => p.categoria === categoriaSeleccionada);
      })
    );
  }

  ngOnInit(): void { }

  abrirCompraRapida() {
    this.dialog.open(CompraRapidaComponent, { width: '600px', maxHeight: '90vh', disableClose: true });
  }

  agregarAlCarrito(producto: Producto) {
    if (producto.stock <= 0) return;
    this.dialog.open(CompraRapidaComponent, { width: '600px', data: { productoPreseleccionado: producto } });
  }
}