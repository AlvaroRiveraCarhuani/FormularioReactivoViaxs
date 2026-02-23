import { Routes } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario';
import { ListaEstudiantesComponent } from './components/lista-estudiantes/lista-estudiantes';

export const routes: Routes = [
  { path: 'registro', component: FormularioComponent },
  { path: 'lista', component: ListaEstudiantesComponent },
  { path: '', redirectTo: '/registro', pathMatch: 'full' }
];