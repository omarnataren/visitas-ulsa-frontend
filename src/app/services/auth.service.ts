import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<Usuario | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  // Login simplificado - sin endpoint de autenticación en el backend
  async login(correo: string, contrasena: string): Promise<boolean> {
    try {
      // Simular login exitoso y guardar usuario mock
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Usuario Admin',
        correo: correo,
        rol: 'admin_sistema'
      };
      
      this.currentUserSignal.set(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
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
