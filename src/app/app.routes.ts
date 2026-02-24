import { Routes } from '@angular/router';
import { ComponenteListaProductos } from './components/lista-productos/lista-productos';
import { VentaProductosComponent } from './components/venta-producto/venta-productos';

export const rutas: Routes = [
  { path: 'inventario', component: ComponenteListaProductos },
  { path: 'ventas', component: VentaProductosComponent },
  { path: '', redirectTo: '/inventario', pathMatch: 'full' },
  { path: '**', redirectTo: '/inventario' }
];