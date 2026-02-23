import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioEstudiante {
  private fuenteEstudiantes = new BehaviorSubject<any[]>([]);
  estudiantes$ = this.fuenteEstudiantes.asObservable();

  constructor() {
    const datosGuardados = localStorage.getItem('estudiantesVaixs');
    if (datosGuardados) {
      this.fuenteEstudiantes.next(JSON.parse(datosGuardados));
    }
  }

  private actualizarYGuardarDatos(nuevosDatos: any[]) {
    this.fuenteEstudiantes.next(nuevosDatos);
    localStorage.setItem('estudiantesVaixs', JSON.stringify(nuevosDatos));
  }

  agregar(estudiante: any) {
    const actuales = this.fuenteEstudiantes.value;
    const nuevos = [...actuales, { ...estudiante, id: Date.now() }];
    this.actualizarYGuardarDatos(nuevos);
  }

  eliminar(id: number) {
    const actuales = this.fuenteEstudiantes.value.filter(e => e.id !== id);
    this.actualizarYGuardarDatos(actuales);
  }

  editar(id: number, estudianteEditado: any) {
    const actuales = this.fuenteEstudiantes.value.map(e => 
      e.id === id ? { ...estudianteEditado, id } : e
    );
    this.actualizarYGuardarDatos(actuales);
  }
}