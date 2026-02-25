import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ServicioProducto, Venta } from '../../services/products';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, DatePipe],
  template: `
    <div class="contenedor-historial">
      <h2 class="text-neon header-titulo">
        <mat-icon>history</mat-icon> Historial de Transacciones
      </h2>

      <div class="tabla-container glass">
        <table mat-table [dataSource]="(ventas$ | async) || []">

          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef> Fecha </th>
            <td mat-cell *matCellDef="let v"> {{ v.fecha | date:'dd/MM/yyyy HH:mm' }} </td>
          </ng-container>

          <ng-container matColumnDef="cliente">
            <th mat-header-cell *matHeaderCellDef> Cliente </th>
            <td mat-cell *matCellDef="let v" class="cliente-nombre"> {{ v.cliente }} </td>
          </ng-container>

          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef> Detalle </th>
            <td mat-cell *matCellDef="let v" class="items-detalle"> 
              {{ v.items.length }} prod. <small>({{ obtenerResumen(v.items) }})</small>
            </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef> Total </th>
            <td mat-cell *matCellDef="let v" class="total-monto"> Bs {{ v.total | number:'1.2-2' }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>
        
        @if ((ventas$ | async)?.length === 0) {
          <div class="vacio-mensaje">
            <mat-icon>info</mat-icon>
            <p>No se han realizado ventas todavía.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .contenedor-historial {
      animation: fadeIn 0.5s ease-out;
    }
    .header-titulo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.8rem;
      margin-bottom: 24px;
    }
    .tabla-container {
      border-radius: 12px;
      overflow: hidden;
    }
    .cliente-nombre {
      font-weight: 700;
      color: white;
    }
    .items-detalle {
      color: var(--vaixs-text-muted);
      font-size: 0.9rem;
      small { opacity: 0.7; }
    }
    .total-monto {
      font-weight: 800;
      color: var(--vaixs-neon);
      font-size: 1rem;
    }
    .vacio-mensaje {
      padding: 60px;
      text-align: center;
      color: var(--vaixs-text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.5; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HistorialVentasComponent {
  ventas$!: Observable<Venta[]>;
  columnas: string[] = ['fecha', 'cliente', 'items', 'total'];

  constructor(private servicio: ServicioProducto) {
    this.ventas$ = this.servicio.ventas$;
  }

  obtenerResumen(items: any[]): string {
    const nombres = items.map(i => i.productoNombre).join(', ');
    return nombres.length > 35 ? nombres.substring(0, 35) + '...' : nombres;
  }
}