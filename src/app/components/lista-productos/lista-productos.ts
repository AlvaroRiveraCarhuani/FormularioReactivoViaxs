import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ServicioProducto } from '../../services/products'; // Servicio correcto
import { ComponenteFormularioProducto } from '../formulario-producto/formulario-producto'; // Componente correcto

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // Opcional si usas iconos

import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule, 
    MatInputModule, MatFormFieldModule, MatTableModule, MatDialogModule, MatIconModule
  ],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.scss']
})
export class ComponenteListaProductos implements OnInit {
  productosFiltrados$!: Observable<any[]>;
  controlBuscador = new FormControl(''); 
  
  // Nuevas columnas adaptadas al sistema de productos
  columnasMostradas: string[] = ['nombre', 'categoria', 'precio', 'stock', 'acciones'];

  constructor(
    private servicio: ServicioProducto,
    private snackBar: MatSnackBar,
    private dialogo: MatDialog
  ) {}

  ngOnInit(): void {
    this.productosFiltrados$ = combineLatest([
      this.servicio.productos$,
      this.controlBuscador.valueChanges.pipe(startWith('')) 
    ]).pipe(
      map(([productos, busqueda]) => {
        const termino = (busqueda || '').toLowerCase();
        // Filtra por nombre o por categoría
        return productos.filter(p => 
          p.nombre.toLowerCase().includes(termino) || 
          p.categoria.toLowerCase().includes(termino)
        );
      })
    );
  }

  abrirFormulario(producto?: any) {
    const referenciaDialogo = this.dialogo.open(ComponenteFormularioProducto, {
      width: window.innerWidth < 600 ? '95%' : '600px',
      maxWidth: '100vw',
      data: producto
    });

    referenciaDialogo.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (producto) {
          this.servicio.editar(producto.id, resultado);
          this.mostrarNotificacion('✅ Producto actualizado');
        } else {
          this.servicio.agregar(resultado);
          this.mostrarNotificacion('🎉 Producto registrado');
        }
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto del inventario?')) {
      this.servicio.eliminar(id);
      this.mostrarNotificacion('🗑️ Producto eliminado');
    }
  }

  private mostrarNotificacion(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}