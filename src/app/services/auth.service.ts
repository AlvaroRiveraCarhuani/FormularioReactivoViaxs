import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'vendedor';

export interface User {
    id: string;
    username: string;
    password?: string;
    role: UserRole;
    token?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser = signal<User | null>(null);

    // Signals públicos reactivos
    currentUser = computed(() => this._currentUser());
    isLoggedIn = computed(() => this._currentUser() !== null);
    isAdmin = computed(() => this._currentUser()?.role === 'admin');

    constructor(private router: Router) {
        this.checkSession();
    }

    private checkSession() {
        const token = localStorage.getItem('vaixs_token');
        const savedUser = localStorage.getItem('vaixs_user');

        if (token && savedUser) {
            try {
                this._currentUser.set(JSON.parse(savedUser));
            } catch (e) {
                this.logout();
            }
        }
    }

    // Simulación de generación de Token JWT
    private generateFakeToken(user: User): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
        }));
        return `${header}.${payload}.fake_signature`;
    }

    // Persistencia de la "Base de Datos" local
    private getUsers(): User[] {
        const users = localStorage.getItem('vaixs_users');
        return users ? JSON.parse(users) : [];
    }

    private saveUsers(users: User[]) {
        localStorage.setItem('vaixs_users', JSON.stringify(users));
    }

    // --- MÉTODOS PÚBLICOS ---

    register(user: Omit<User, 'id' | 'token'>): boolean {
        const users = this.getUsers();

        if (users.find(u => u.username === user.username)) {
            return false; // Error: Usuario ya existe
        }

        const newUser: User = {
            ...user,
            id: crypto.randomUUID(),
        };

        users.push(newUser);
        this.saveUsers(users);

        return true;
    }

    login(username: string, password: string): boolean {
        const users = this.getUsers();

        // Simulación de búsqueda y validación
        const user = users.find(u => u.username === username && u.password === password);

        // Fallback para admin inicial si la lista está vacía o es el primer acceso
        if (!user && username.toLowerCase().includes('admin')) {
            const adminUser: User = {
                id: 'admin-1',
                username: username,
                password: password,
                role: 'admin'
            };
            this.finalizeLogin(adminUser);
            return true;
        }

        if (user) {
            this.finalizeLogin(user);
            return true;
        }

        return false;
    }

    private finalizeLogin(user: User) {
        const token = this.generateFakeToken(user);
        const sessionUser = { ...user };
        delete sessionUser.password; // Por seguridad no guardamos pass en signal/token

        localStorage.setItem('vaixs_token', token);
        localStorage.setItem('vaixs_user', JSON.stringify(sessionUser));

        this._currentUser.set(sessionUser);

        const target = sessionUser.role === 'admin' ? '/inventario' : '/ventas';
        this.router.navigate([target]);
    }

    logout() {
        localStorage.removeItem('vaixs_token');
        localStorage.removeItem('vaixs_user');
        this._currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getUser(): User | null {
        return this._currentUser();
    }

    getRole(): UserRole | null {
        return this._currentUser()?.role || null;
    }
}
