import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Importante para los iconos de editar/borrar
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; // Para los tooltips
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServicioProducto, Producto } from '../../services/products';
import { ComponenteFormularioProducto } from '../formulario-producto/formulario-producto';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.scss']
})
export class ComponenteListaProductos implements OnInit {
  productosFiltrados$!: Observable<Producto[]>;
  controlBuscador = new FormControl('');
  
  columnasMostradas: string[] = ['nombre', 'categoria', 'precio', 'stock', 'acciones'];

  constructor(
    private servicio: ServicioProducto,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Lógica reactiva: Combina la lista del servicio con el texto del buscador
    this.productosFiltrados$ = combineLatest([
      this.servicio.productos$, // Flujo 1: Lista de productos
      this.controlBuscador.valueChanges.pipe(startWith('')) // Flujo 2: Buscador (inicia vacío)
    ]).pipe(
      map(([productos, filtro]) => {
        const termino = (filtro || '').toLowerCase();
        return productos.filter(p => 
          p.nombre.toLowerCase().includes(termino) || 
          p.categoria.toLowerCase().includes(termino)
        );
      })
    );
  }

  abrirFormulario(producto?: Producto): void {
    const dialogRef = this.dialog.open(ComponenteFormularioProducto, {
      width: '500px',
      data: producto ? { ...producto } : null,
      disableClose: true // Evita cerrar al hacer clic fuera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (producto) {
          // Si editamos, actualizamos
          this.servicio.editar(producto.id, { ...producto, ...result });
        } else {
          // Si creamos, el propio formulario ya se encargó de llamar al servicio
          // O si devolvió datos, los agregamos aquí (depende de tu implementación del form)
          // Como tu formulario ya tiene "guardarYContinuar", aquí no hace falta hacer nada extra
          // si el formulario maneja la lógica.
        }
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.servicio.eliminar(id);
    }
  }
}