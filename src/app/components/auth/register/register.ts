import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, UserRole } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatSnackBarModule
    ],
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    hidePassword = true;
    roles: UserRole[] = ['admin', 'vendedor'];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['vendedor', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const { username, password, role } = this.registerForm.value;
            if (this.authService.register({ username, password, role })) {
                this.snackBar.open('¡Cuenta creada con éxito! Inicia sesión ahora.', 'Cerrar', { duration: 4000 });
                this.router.navigate(['/login'], { queryParams: { prefill: username } });
            } else {
                this.snackBar.open('Error: El usuario ya existe.', 'Cerrar', { duration: 3000 });
            }
        }
    }
}
