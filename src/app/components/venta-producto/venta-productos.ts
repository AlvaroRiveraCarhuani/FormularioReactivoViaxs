import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Importación necesaria
import { ServicioProducto, Producto } from '../../services/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CompraRapidaComponent } from './compra-rapida/compra-rapida';

@Component({
  selector: 'app-venta-productos',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule
  ],
  templateUrl: './venta-productos.html',
  styleUrls: ['./venta-productos.scss']
})
export class VentaProductosComponent implements OnInit {
  // Declaramos la propiedad sin inicializarla aquí para evitar el error TS2729
  productos$!: Observable<Producto[]>;

  constructor(
    private servicio: ServicioProducto,
    private dialog: MatDialog
  ) {
    // Inicializamos dentro del constructor, donde 'servicio' ya está disponible
    this.productos$ = this.servicio.productos$;
  }

  ngOnInit(): void {}

  abrirCompraRapida() {
    this.dialog.open(CompraRapidaComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: true 
    });
  }

  agregarAlCarrito(producto: Producto) {
    this.dialog.open(CompraRapidaComponent, {
      width: '600px',
      data: { productoPreseleccionado: producto }
    });
  }
}