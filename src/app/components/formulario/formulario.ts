import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Asegúrate de tener esto importado
import { Subscription } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { EstudianteService } from '../../services/estudiante';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './formulario.html', 
  styleUrls: ['./formulario.scss']  
})
export class FormularioComponent implements OnInit, OnDestroy {
  estudianteForm!: FormGroup;
  cursosDisponibles = ['1ro de Secundaria', '2do de Secundaria', '3ro de Secundaria', '4to de Secundaria', '5to de Secundaria', '6to de Secundaria', 'Universidad'];
  
  estudianteAEditarId: number | null = null;
  suscripcion!: Subscription;

  constructor(
    private fb: FormBuilder, 
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estudianteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      colegio: ['', [Validators.required, Validators.minLength(2)]],
      curso: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

    this.suscripcion = this.estudianteService.estudianteEdit$.subscribe(estudiante => {
      if (estudiante) {
        this.estudianteAEditarId = estudiante.id;
        this.estudianteForm.patchValue(estudiante);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.suscripcion) this.suscripcion.unsubscribe();
  }

  guardarEstudiante(): void {
    if (this.estudianteForm.valid) {
      if (this.estudianteAEditarId) {
        this.estudianteService.editar(this.estudianteAEditarId, this.estudianteForm.value);
      } else {
        this.estudianteService.agregar(this.estudianteForm.value);
      }
      this.estudianteForm.reset();
      this.estudianteService.limpiarEdicion();
      this.router.navigate(['/lista']);
    } else {
      this.estudianteForm.markAllAsTouched();
    }
  }

  // --- LÓGICA DE CANCELAR MEJORADA ---
  cancelarEdicion(): void {
    // 1. Verificamos si el usuario modificó algún campo (dirty)
    if (this.estudianteForm.dirty) {
      const confirma = confirm('¿Estás seguro que deseas cancelar? Se perderán los cambios que hiciste.');
      if (!confirma) {
        return; // Si dice "No", cortamos la ejecución y se queda en el formulario
      }
    }

    // 2. Si no había cambios, o si confirmó que quiere salir:
    this.estudianteForm.reset();
    this.estudianteService.limpiarEdicion();
    this.estudianteAEditarId = null;
    this.router.navigate(['/lista']); // Lo regresamos a la tabla
  }
}