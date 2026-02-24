import { Routes } from '@angular/router';
import { ComponenteListaProductos } from './components/lista-productos/lista-productos';

export const rutas: Routes = [
  { path: 'lista', component: ComponenteListaProductos },
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: '**', redirectTo: '/lista' }
];