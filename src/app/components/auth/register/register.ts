import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
        MatSelectModule
    ],
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    hidePassword = true;
    roles: UserRole[] = ['admin', 'usuario'];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['usuario', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const { username, password, role } = this.registerForm.value;
            if (this.authService.register(username, password, role)) {
                // Redirección manejada en el servicio
            }
        }
    }
}
