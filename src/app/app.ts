import { Component } from '@angular/core';
import { FormularioComponent } from './components/formulario/formulario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormularioComponent], // Ya no importamos RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {  // <-- Aquí está la corrección clave
  title = 'formulario-reactivo';
}