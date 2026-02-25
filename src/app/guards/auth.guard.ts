import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // Verificar rol si es necesario
        const requiredRole = route.data['role'];
        if (requiredRole && authService.currentUser()?.role !== requiredRole && authService.currentUser()?.role !== 'admin') {
            router.navigate(['/inventario']);
            return false;
        }
        return true;
    }

    router.navigate(['/login']);
    return false;
};
