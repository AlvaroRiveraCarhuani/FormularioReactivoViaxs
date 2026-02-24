import { Routes } from '@angular/router';
import { ComponenteListaProductos } from './components/lista-productos/lista-productos';
import { VentaProductosComponent } from './components/venta-producto/venta-productos';
import { HistorialVentasComponent } from './components/historial-ventas/historial-ventas'; 
export const rutas: Routes = [
  { path: 'inventario', component: ComponenteListaProductos },
  { path: 'ventas', component: VentaProductosComponent },
  { path: 'historial', component: HistorialVentasComponent }, 
  { path: '', redirectTo: '/inventario', pathMatch: 'full' },
  { path: '**', redirectTo: '/inventario' }
];