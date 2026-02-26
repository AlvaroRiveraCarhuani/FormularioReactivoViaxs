import { TestBed } from '@angular/core/testing';
import { ServicioEstudiante } from './estudiante';

describe('ServicioEstudiante', () => {
  let servicio: ServicioEstudiante;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ServicioEstudiante);
  });

  it('debe crearse correctamente', () => {
    expect(servicio).toBeTruthy();
  });
});