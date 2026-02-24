import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponenteFormulario } from './formulario';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ComponenteFormulario', () => {
  let componente: ComponenteFormulario;
  let fixture: ComponentFixture<ComponenteFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponenteFormulario,
        NoopAnimationsModule 
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteFormulario);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente el componente del formulario', () => {
    expect(componente).toBeTruthy();
  });
});