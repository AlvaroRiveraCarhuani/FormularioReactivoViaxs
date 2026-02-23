import { Routes } from '@angular/router';
import { ComponenteListaEstudiantes } from './components/lista-estudiantes/lista-estudiantes';

export const rutas: Routes = [
  { path: 'lista', component: ComponenteListaEstudiantes },
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: '**', redirectTo: '/lista' }
];