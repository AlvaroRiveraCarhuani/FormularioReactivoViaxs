import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // Importante para el buscador
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioProducto } from '../../services/products'; // Importamos el servicio renombrado
import { Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatAutocompleteModule
  ],
  templateUrl: './formulario-producto.html',
  styleUrls: ['./formulario-producto.scss']
})
export class ComponenteFormularioProducto implements OnInit {
  formularioProducto!: FormGroup;
  categorias = ['Hardware', 'Software', 'Periféricos', 'Redes', 'Mobiliario', 'Accesorios'];
  sugerencias$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ComponenteFormularioProducto>,
    private servicio: ServicioProducto,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) {}

  ngOnInit(): void {
    this.formularioProducto = this.fb.group({
      nombre: [this.datos?.nombre || '', [Validators.required, Validators.minLength(3)]],
      categoria: [this.datos?.categoria || '', Validators.required],
      precio: [this.datos?.precio || '', [Validators.required, Validators.min(1)]],
      stock: [this.datos?.stock || '', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]]
    });

    // Reactividad: Escucha lo que escribes y busca en el catálogo
    this.sugerencias$ = this.formularioProducto.get('nombre')!.valueChanges.pipe(
      startWith(''),
      switchMap(valor => this.servicio.buscarEnCatalogo(valor || ''))
    );
  }

  // Cierra el modal tras guardar
  guardarYCerrar(): void {
    if (this.formularioProducto.valid) {
      this.dialogRef.close(this.formularioProducto.value);
    }
  }

  // Guarda pero mantiene el modal abierto para seguir registrando
  guardarYContinuar(): void {
    if (this.formularioProducto.valid) {
      this.servicio.agregar(this.formularioProducto.value);
      
      this.snackBar.open('✅ Producto agregado. Sigue registrando.', 'Ok', { duration: 2000 });
      
      // Guardamos la categoría actual para no tener que seleccionarla de nuevo (Mejora UX)
      const categoriaActual = this.formularioProducto.get('categoria')?.value;
      
      this.formularioProducto.reset();
      // Restauramos la categoría y ponemos valores por defecto
      this.formularioProducto.patchValue({ 
        categoria: categoriaActual,
        precio: '',
        stock: '' 
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}