import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ServicioEstudiante } from '../../services/estudiante';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table'; // <-- Nuevo: Módulo de tablas

import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    MatSnackBarModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatTableModule
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
    private enrutador: Router,
    private barraNotificaciones: MatSnackBar
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

  editar(estudiante: any) {
    this.servicioEstudiante.seleccionarParaEditar(estudiante);
    this.enrutador.navigate(['/registro']);
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar a este estudiante?')) {
      this.servicioEstudiante.eliminar(id);
      this.barraNotificaciones.open('🗑️ Estudiante eliminado', 'Cerrar', { duration: 3000 });
    }
  }

  irAlRegistro() {
    this.servicioEstudiante.limpiarEdicion();
    this.enrutador.navigate(['/registro']);
  }
}