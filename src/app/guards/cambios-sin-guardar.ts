import { CanDeactivateFn } from '@angular/router';

export interface PuedeDesactivarComponente {
  puedeDesactivar: () => boolean;
}

export const guardiaCambiosSinGuardar: CanDeactivateFn<PuedeDesactivarComponente> = (componente) => {
  return componente.puedeDesactivar ? componente.puedeDesactivar() : true;
};