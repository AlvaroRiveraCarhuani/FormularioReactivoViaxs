import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ServicioEstudiante } from '../../services/estudiante';
import { ComponenteFormulario } from '../formulario/formulario';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatSnackBarModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './lista-estudiantes.html',
  styleUrls: ['./lista-estudiantes.scss']
})
export class ComponenteListaEstudiantes implements OnInit {
  estudiantesFiltrados$!: Observable<any[]>;
  controlBuscador = new FormControl(''); 
  columnasMostradas: string[] = ['nombre', 'telefono', 'colegio', 'curso', 'acciones'];

  constructor(
    private servicioEstudiante: ServicioEstudiante,
    private barraNotificaciones: MatSnackBar,
    private dialogo: MatDialog
  ) {}

  ngOnInit(): void {
    this.estudiantesFiltrados$ = combineLatest([
      this.servicioEstudiante.estudiantes$,
      this.controlBuscador.valueChanges.pipe(startWith('')) 
    ]).pipe(
      map(([estudiantes, busqueda]) => {
        const termino = (busqueda || '').toLowerCase();
        return estudiantes.filter(e => 
          e.nombres.toLowerCase().includes(termino) || 
          e.apellidos.toLowerCase().includes(termino)
        );
      })
    );
  }

  abrirFormulario(estudiante?: any) {
    const referenciaDialogo = this.dialogo.open(ComponenteFormulario, {
      width: '500px',
      data: estudiante
    });

    referenciaDialogo.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (estudiante) {
          this.servicioEstudiante.editar(estudiante.id, resultado);
          this.mostrarNotificacion('✅ Estudiante actualizado');
        } else {
          this.servicioEstudiante.agregar(resultado);
          this.mostrarNotificacion('🎉 Estudiante registrado');
        }
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar a este estudiante?')) {
      this.servicioEstudiante.eliminar(id);
      this.mostrarNotificacion('🗑️ Estudiante eliminado');
    }
  }

  private mostrarNotificacion(mensaje: string) {
    this.barraNotificaciones.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}