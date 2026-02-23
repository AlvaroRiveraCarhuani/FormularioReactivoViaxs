import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudiantesSource = new BehaviorSubject<any[]>([]);
  estudiantes$ = this.estudiantesSource.asObservable();

  private estudianteEditSource = new BehaviorSubject<any>(null);
  estudianteEdit$ = this.estudianteEditSource.asObservable();

  constructor() {
    // 1. Al iniciar la app, leemos si hay algo en LocalStorage
    const datosGuardados = localStorage.getItem('estudiantesVaixs');
    if (datosGuardados) {
      this.estudiantesSource.next(JSON.parse(datosGuardados));
    }
  }

  // 2. Función auxiliar para guardar en el BehaviorSubject y en LocalStorage al mismo tiempo
  private actualizarDatos(nuevosDatos: any[]) {
    this.estudiantesSource.next(nuevosDatos);
    localStorage.setItem('estudiantesVaixs', JSON.stringify(nuevosDatos));
  }

  agregar(estudiante: any) {
    const actuales = this.estudiantesSource.value;
    const nuevos = [...actuales, { ...estudiante, id: Date.now() }];
    this.actualizarDatos(nuevos); // Usamos nuestra nueva función
  }

  eliminar(id: number) {
    const actuales = this.estudiantesSource.value.filter(e => e.id !== id);
    this.actualizarDatos(actuales); // Usamos nuestra nueva función
  }

  seleccionarParaEditar(estudiante: any) {
    this.estudianteEditSource.next(estudiante);
  }

  editar(id: number, estudianteEditado: any) {
    const actuales = this.estudiantesSource.value.map(e => 
      e.id === id ? { ...estudianteEditado, id } : e
    );
    this.actualizarDatos(actuales); // Usamos nuestra nueva función
    this.estudianteEditSource.next(null);
  }

  limpiarEdicion() {
    this.estudianteEditSource.next(null);
  }
}