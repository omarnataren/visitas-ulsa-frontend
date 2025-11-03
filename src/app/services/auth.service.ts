import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<Usuario | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  // Datos mock
  private mockUsers: Usuario[] = [
    {
      id: 1,
      nombre: 'Administrador del Sistema',
      correo: 'admin@lasalle.mx',
      rol: 'admin_sistema'
    },
    {
      id: 2,
      nombre: 'Coordinador Académico',
      correo: 'coordinador@lasalle.mx',
      rol: 'admin_universitario'
    }
  ];

  login(correo: string, contrasena: string): boolean {
    // Login mock - acepta cualquier usuario
    const user = this.mockUsers[0];
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    if (!this.currentUserSignal()) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSignal.set(JSON.parse(storedUser));
      }
    }
    return !!this.currentUserSignal();
  }
}
