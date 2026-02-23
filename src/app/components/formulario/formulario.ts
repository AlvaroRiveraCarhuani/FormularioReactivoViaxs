import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatButtonModule
  ],
  templateUrl: './formulario.html'
})
export class ComponenteFormulario implements OnInit {
  formularioEstudiante!: FormGroup;
  cursosDisponibles = ['1ro de Secundaria', '2do de Secundaria', '3ro de Secundaria', '4to de Secundaria', '5to de Secundaria', '6to de Secundaria', 'Universidad'];

  constructor(
    private constructorFormularios: FormBuilder,
    private referenciaDialogo: MatDialogRef<ComponenteFormulario>,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) {}

  ngOnInit(): void {
    this.formularioEstudiante = this.constructorFormularios.group({
      nombres: [this.datos?.nombres || '', [Validators.required, Validators.minLength(3)]],
      apellidos: [this.datos?.apellidos || '', [Validators.required, Validators.minLength(3)]],
      telefono: [this.datos?.telefono || '', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      colegio: [this.datos?.colegio || '', [Validators.required, Validators.minLength(2)]],
      curso: [this.datos?.curso || '', Validators.required],
      correo: [this.datos?.correo || '', [Validators.required, Validators.email]]
    });
  }

  guardar(): void {
    if (this.formularioEstudiante.valid) {
      this.referenciaDialogo.close(this.formularioEstudiante.value);
    }
  }

  cancelar(): void {
    this.referenciaDialogo.close();
  }
}