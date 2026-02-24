import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioProducto, Producto } from '../../services/products';
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
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './formulario-producto.html',
  styleUrls: ['./formulario-producto.scss']
})
export class ComponenteFormularioProducto implements OnInit {
  formularioProducto!: FormGroup;
  categorias = ['Hardware', 'Software', 'Periféricos', 'Redes', 'Mobiliario', 'Accesorios'];
  sugerencias$!: Observable<string[]>;
  
  // Lista temporal (Staging Area)
  productosAcumulados: any[] = []; // Usamos 'any' temporalmente porque aún no tienen ID

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

    this.sugerencias$ = this.formularioProducto.get('nombre')!.valueChanges.pipe(
      startWith(''),
      switchMap(valor => this.servicio.buscarEnCatalogo(valor || ''))
    );
  }

  // 1. Agregar a la lista temporal (NO GUARDAR EN BD AÚN)
  agregarALista(): void {
    if (this.formularioProducto.valid) {
      const prod = this.formularioProducto.value;
      
      this.productosAcumulados.push(prod);
      
      // UX: Guardar categoría para no re-seleccionar
      const catActual = prod.categoria;
      
      this.formularioProducto.reset();
      this.formularioProducto.patchValue({ categoria: catActual });
      
      // Limpiar errores visuales
      Object.keys(this.formularioProducto.controls).forEach(key => {
        this.formularioProducto.get(key)?.setErrors(null);
      });
    }
  }

  // 2. Eliminar de la lista temporal antes de guardar
  eliminarDeLista(index: number): void {
    this.productosAcumulados.splice(index, 1);
  }

  // 3. Guardar todo de golpe
  registrarTodo(): void {
    // Si hay algo en el formulario sin agregar a la lista, lo agregamos automáticamente
    if (this.formularioProducto.valid && this.formularioProducto.dirty) {
      this.productosAcumulados.push(this.formularioProducto.value);
    }

    if (this.datos) {
      // MODO EDICIÓN (Solo uno)
      if (this.formularioProducto.valid) {
         this.dialogRef.close(this.formularioProducto.value);
      }
    } else {
      // MODO CREACIÓN MASIVA
      if (this.productosAcumulados.length > 0) {
        // Aquí simulamos el "bulk insert" recorriendo el array
        this.productosAcumulados.forEach(prod => {
          this.servicio.agregar(prod);
        });
        
        this.snackBar.open(`✅ Se registraron ${this.productosAcumulados.length} productos correctamente.`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}