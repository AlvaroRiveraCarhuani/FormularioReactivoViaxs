import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';

// Layout
import { HeaderComponent } from './components/layout/header/header';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { FooterComponent } from './components/layout/footer/footer';

// State
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'FormularioReactivoViaxs';
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService) { }
}