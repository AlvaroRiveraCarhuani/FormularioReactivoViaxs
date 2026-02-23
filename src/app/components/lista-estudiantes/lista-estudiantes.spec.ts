import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteListaEstudiantes } from './lista-estudiantes';

describe('ComponenteListaEstudiantes', () => {
  let componente: ComponenteListaEstudiantes;
  let fixture: ComponentFixture<ComponenteListaEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteListaEstudiantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteListaEstudiantes);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente el componente de la lista', () => {
    expect(componente).toBeTruthy();
  });
});