import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Vaixs ERP - Todos los derechos reservados</p>
        <div class="status">
          <span class="status-dot"></span>
          Sistema en línea (Local)
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      padding: 15px 20px;
      background: #0a0a0a;
      border-top: 1px solid var(--vaixs-border);
      color: var(--vaixs-text-muted);
      font-size: 0.8rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--vaixs-neon);
      border-radius: 50%;
      box-shadow: 0 0 5px var(--vaixs-neon);
    }
    @media (max-width: 600px) {
      .footer-content {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent { }
