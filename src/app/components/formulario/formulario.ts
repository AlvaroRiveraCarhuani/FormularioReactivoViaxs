import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// CORRECCIÓN: Nombre en español
import { ServicioEstudiante } from '../../services/estudiante';
import { PuedeDesactivarComponente } from '../../guards/cambios-sin-guardar';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './formulario.html', 
  styleUrls: ['./formulario.scss']  
})
export class ComponenteFormulario implements OnInit, OnDestroy, PuedeDesactivarComponente {
  formularioEstudiante!: FormGroup;
  cursosDisponibles = ['1ro de Secundaria', '2do de Secundaria', '3ro de Secundaria', '4to de Secundaria', '5to de Secundaria', '6to de Secundaria', 'Universidad'];
  
  idEstudianteEnEdicion: number | null = null;
  suscripcionEdicion!: Subscription;
  formularioGuardado = false;

  constructor(
    private constructorFormularios: FormBuilder, 
    private servicioEstudiante: ServicioEstudiante, // CORRECCIÓN
    private enrutador: Router,
    private barraNotificaciones: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formularioEstudiante = this.constructorFormularios.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      colegio: ['', [Validators.required, Validators.minLength(2)]],
      curso: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

    // CORRECCIÓN: Usar 'servicioEstudiante' y 'estudianteEnEdicion$'
    this.suscripcionEdicion = this.servicioEstudiante.estudianteEnEdicion$.subscribe((estudiante: any) => {
      if (estudiante) {
        this.idEstudianteEnEdicion = estudiante.id;
        this.formularioEstudiante.patchValue(estudiante);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.suscripcionEdicion) this.suscripcionEdicion.unsubscribe();
  }

  puedeDesactivar(): boolean {
    if (this.formularioEstudiante.dirty && !this.formularioGuardado) {
      return confirm('Tienes cambios sin guardar. ¿Estás seguro de abandonar esta página?');
    }
    return true;
  }

  guardarDatos(): void {
    if (this.formularioEstudiante.valid) {
      if (this.idEstudianteEnEdicion) {
        this.servicioEstudiante.editar(this.idEstudianteEnEdicion, this.formularioEstudiante.value);
        this.mostrarNotificacion('✅ Estudiante actualizado con éxito');
      } else {
        this.servicioEstudiante.agregar(this.formularioEstudiante.value);
        this.mostrarNotificacion('🎉 Estudiante registrado con éxito');
      }
      
      this.formularioGuardado = true; 
      this.formularioEstudiante.reset();
      this.servicioEstudiante.limpiarEdicion();
      this.enrutador.navigate(['/lista']);
    } else {
      this.formularioEstudiante.markAllAsTouched();
    }
  }

  cancelarEdicion(): void {
    this.enrutador.navigate(['/lista']);
  }

  private mostrarNotificacion(mensaje: string) {
    this.barraNotificaciones.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}