import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicioEstudiante {
  private fuenteEstudiantes = new BehaviorSubject<any[]>([]);
  estudiantes$ = this.fuenteEstudiantes.asObservable();

  private fuenteEdicionEstudiante = new BehaviorSubject<any>(null);
  estudianteEnEdicion$ = this.fuenteEdicionEstudiante.asObservable();

  constructor() {
    const datosGuardados = localStorage.getItem('estudiantesVaixs');
    if (datosGuardados) this.fuenteEstudiantes.next(JSON.parse(datosGuardados));
  }

  private actualizarYGuardarDatos(nuevosDatos: any[]) {
    this.fuenteEstudiantes.next(nuevosDatos);
    localStorage.setItem('estudiantesVaixs', JSON.stringify(nuevosDatos));
  }

  agregar(estudiante: any) {
    const nuevos = [...this.fuenteEstudiantes.value, { ...estudiante, id: Date.now() }];
    this.actualizarYGuardarDatos(nuevos);
  }

  eliminar(id: number) {
    const actuales = this.fuenteEstudiantes.value.filter(e => e.id !== id);
    this.actualizarYGuardarDatos(actuales);
  }

  seleccionarParaEditar(estudiante: any) { this.fuenteEdicionEstudiante.next(estudiante); }

  editar(id: number, estudianteEditado: any) {
    const actuales = this.fuenteEstudiantes.value.map(e => e.id === id ? { ...estudianteEditado, id } : e);
    this.actualizarYGuardarDatos(actuales);
    this.fuenteEdicionEstudiante.next(null);
  }

  limpiarEdicion() { this.fuenteEdicionEstudiante.next(null); }
}