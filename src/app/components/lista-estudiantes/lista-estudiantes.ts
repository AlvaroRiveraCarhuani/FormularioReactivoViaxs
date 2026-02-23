import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstudianteService } from '../../services/estudiante';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './lista-estudiantes.html',
  styleUrls: ['./lista-estudiantes.scss']
})
export class ListaEstudiantesComponent implements OnInit {
  estudiantes$!: Observable<any[]>;

  constructor(
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Nos conectamos al cerebro de datos
    this.estudiantes$ = this.estudianteService.estudiantes$;
  }

  editar(estudiante: any) {
    this.estudianteService.seleccionarParaEditar(estudiante);
    this.router.navigate(['/registro']); // Mandamos al usuario de vuelta al formulario
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar a este estudiante?')) {
      this.estudianteService.eliminar(id);
    }
  }

  irARegistro() {
    this.estudianteService.limpiarEdicion();
    this.router.navigate(['/registro']);
  }
}