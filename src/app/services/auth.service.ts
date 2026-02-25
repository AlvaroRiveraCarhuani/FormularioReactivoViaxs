import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'usuario';

export interface User {
    username: string;
    role: UserRole;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser = signal<User | null>(null);
    currentUser = computed(() => this._currentUser());

    constructor(private router: Router) {
        const savedUser = localStorage.getItem('vaixs_user');
        if (savedUser) {
            this._currentUser.set(JSON.parse(savedUser));
        }
    }

    login(username: string, password: string): boolean {
        // Logic simple: si es 'admin' es admin, si no es usuario
        // Password es ignorado por ahora para "login simple"
        let role: UserRole = 'usuario';
        if (username.toLowerCase().includes('admin')) {
            role = 'admin';
        }

        const user: User = { username, role };
        this._currentUser.set(user);
        localStorage.setItem('vaixs_user', JSON.stringify(user));
        this.router.navigate(['/inventario']);
        return true;
    }

    register(username: string, password: string, role: UserRole = 'usuario'): boolean {
        // Registro simple: solo guarda el usuario actual
        const user: User = { username, role };
        this._currentUser.set(user);
        localStorage.setItem('vaixs_user', JSON.stringify(user));
        this.router.navigate(['/inventario']);
        return true;
    }

    logout() {
        this._currentUser.set(null);
        localStorage.removeItem('vaixs_user');
        this.router.navigate(['/login']);
    }

    isAdmin(): boolean {
        return this._currentUser()?.role === 'admin';
    }

    isLoggedIn(): boolean {
        return this._currentUser() !== null;
    }
}
