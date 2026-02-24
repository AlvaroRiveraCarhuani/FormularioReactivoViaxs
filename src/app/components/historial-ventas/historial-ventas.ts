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
    <div style="padding: 20px; max-width: 1000px; margin: 0 auto;">
      <h2 style="display: flex; align-items: center; gap: 10px; color: #333;">
        <mat-icon>history</mat-icon> Historial de Transacciones
      </h2>

      <div class="mat-elevation-z8" style="overflow-x: auto; border-radius: 8px; background: white;">
        <table mat-table [dataSource]="(ventas$ | async) || []" style="width: 100%;">

          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef> Fecha </th>
            <td mat-cell *matCellDef="let v"> {{ v.fecha | date:'dd/MM/yyyy HH:mm' }} </td>
          </ng-container>

          <ng-container matColumnDef="cliente">
            <th mat-header-cell *matHeaderCellDef> Cliente </th>
            <td mat-cell *matCellDef="let v" style="font-weight: 600;"> {{ v.cliente }} </td>
          </ng-container>

          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef> Detalle </th>
            <td mat-cell *matCellDef="let v"> 
              <span style="color: #666; font-size: 0.85rem;">
                {{ v.items.length }} prod. ({{ obtenerResumen(v.items) }})
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef> Total </th>
            <td mat-cell *matCellDef="let v" style="color: #2e7d32; font-weight: bold;"> Bs {{ v.total }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>
        
        @if ((ventas$ | async)?.length === 0) {
          <div style="padding: 40px; text-align: center; color: #999;">
            No se han realizado ventas todavía.
          </div>
        }
      </div>
    </div>
  `
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