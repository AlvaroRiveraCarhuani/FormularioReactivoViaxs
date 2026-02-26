import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
    template: `
    <mat-toolbar color="primary" class="header">
      <button mat-icon-button (click)="toggleSidebar.emit()" class="menu-btn">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="logo">Vaix</span>
      
      <span class="spacer"></span>
      
      <div class="user-info" *ngIf="authService.currentUser() as user">
        <span class="username">{{ user.username }}</span>
        <span class="role-badge" [class.admin]="user.role === 'admin'">{{ user.role }}</span>
      </div>
      
      <button mat-icon-button (click)="authService.logout()" matTooltip="Cerrar Sesión">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
    styles: [`
    .header {
      background: rgba(30, 30, 30, 0.8) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--vaixs-border);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .logo {
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--vaixs-neon);
      margin-left: 10px;
    }
    .spacer { flex: 1 1 auto; }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-right: 15px;
      line-height: 1.2;
    }
    .username {
      font-size: 0.9rem;
      font-weight: 500;
    }
    .role-badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: #444;
      color: #ccc;
    }
    .role-badge.admin {
      background: rgba(0, 230, 118, 0.2);
      color: var(--vaixs-neon);
      border: 1px solid rgba(0, 230, 118, 0.3);
    }
    .menu-btn {
      margin-right: 10px;
    }
  `]
})
export class HeaderComponent {
    @Output() toggleSidebar = new EventEmitter<void>();

    constructor(public authService: AuthService) { }
}
