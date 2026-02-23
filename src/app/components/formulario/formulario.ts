import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './formulario.html', 
  styleUrls: ['./formulario.scss']  
})
export class FormularioComponent implements OnInit {
  estudianteForm!: FormGroup;
  cursosDisponibles = [
    '1ro de Secundaria', '2do de Secundaria', '3ro de Secundaria', 
    '4to de Secundaria', '5to de Secundaria', '6to de Secundaria', 'Universidad'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.estudianteForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      colegio: ['', [Validators.required, Validators.minLength(2)]],
      curso: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  registrarEstudiante(): void {
    if (this.estudianteForm.valid) {
      console.log('Estudiante registrado:', this.estudianteForm.value);
      alert('¡Estudiante registrado con éxito! Revisa la consola.');
      this.estudianteForm.reset();
    } else {
      this.estudianteForm.markAllAsTouched();
    }
  }
}