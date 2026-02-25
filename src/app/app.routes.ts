import { Routes } from '@angular/router';
import { ComponenteListaProductos } from './components/lista-productos/lista-productos';
import { VentaProductosComponent } from './components/venta-producto/venta-productos';
import { HistorialVentasComponent } from './components/historial-ventas/historial-ventas';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { authGuard } from './guards/auth.guard';

export const rutas: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'inventario',
    component: ComponenteListaProductos,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'ventas',
    component: VentaProductosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'historial',
    component: HistorialVentasComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { path: '', redirectTo: '/inventario', pathMatch: 'full' },
  { path: '**', redirectTo: '/inventario' }
];