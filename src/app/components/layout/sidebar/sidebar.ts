import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
    template: `
    <mat-nav-list class="sidebar-list">
      <div class="sidebar-header">
        <mat-icon class="app-icon">dashboard</mat-icon>
        <span>MENÚ PRINCIPAL</span>
      </div>

      <a mat-list-item routerLink="/inventario" routerLinkActive="active-link" *ngIf="authService.isAdmin()">
        <mat-icon matListItemIcon>inventory_2</mat-icon>
        <span matListItemTitle>Inventario</span>
      </a>

      <a mat-list-item routerLink="/ventas" routerLinkActive="active-link">
        <mat-icon matListItemIcon>shopping_cart</mat-icon>
        <span matListItemTitle>Realizar Venta</span>
      </a>

      <a mat-list-item routerLink="/historial" routerLinkActive="active-link" *ngIf="authService.isAdmin()">
        <mat-icon matListItemIcon>history</mat-icon>
        <span matListItemTitle>Historial Ventas</span>
      </a>
      
      <mat-divider></mat-divider>
      
      <div class="sidebar-footer" *ngIf="authService.currentUser() as user">
        <p>Sesión como: <strong>{{user.role}}</strong></p>
      </div>
    </mat-nav-list>
  `,
    styles: [`
    .sidebar-list {
      height: 100%;
      background: var(--vaixs-panel-bg);
      border-right: 1px solid var(--vaixs-border);
    }
    .sidebar-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--vaixs-text-muted);
      font-size: 0.8rem;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .app-icon {
      color: var(--vaixs-neon);
    }
    .active-link {
      background: rgba(0, 230, 118, 0.1) !important;
      color: var(--vaixs-neon) !important;
      border-left: 4px solid var(--vaixs-neon);
    }
    .sidebar-footer {
      padding: 20px;
      font-size: 0.75rem;
      color: var(--vaixs-text-muted);
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class SidebarComponent {
    constructor(public authService: AuthService) { }
}
