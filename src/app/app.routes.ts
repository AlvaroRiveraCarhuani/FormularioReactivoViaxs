import { Routes } from '@angular/router';
import { ComponenteFormulario } from './components/formulario/formulario';
import { ComponenteListaEstudiantes } from './components/lista-estudiantes/lista-estudiantes';
import { guardiaCambiosSinGuardar } from './guards/cambios-sin-guardar';

export const rutas: Routes = [
  { path: 'registro', component: ComponenteFormulario, canDeactivate: [guardiaCambiosSinGuardar] },
  { path: 'lista', component: ComponenteListaEstudiantes },
  { path: '', redirectTo: '/registro', pathMatch: 'full' }
];