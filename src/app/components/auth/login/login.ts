import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
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
        MatSnackBarModule
    ],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        const prefill = this.route.snapshot.queryParamMap.get('prefill');
        if (prefill) {
            this.loginForm.patchValue({ username: prefill });
        }
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            if (this.authService.login(username, password)) {
                this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 2000 });
            } else {
                this.snackBar.open('Usuario o contraseña incorrectos.', 'Cerrar', { duration: 3000 });
            }
        }
    }
}
