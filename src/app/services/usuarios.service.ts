import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import api from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuariosSignal = signal<Usuario[]>([]);
  usuarios = this.usuariosSignal.asReadonly();

  async loadUsuarios(): Promise<void> {
    try {
      const response = await api.get('/usuarios');
      this.usuariosSignal.set(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  getUsuarios(): Usuario[] {
    return this.usuariosSignal();
  }

  async getUsuario(id: number): Promise<Usuario | null> {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  async addUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario | null> {
    try {
      const backendData = {
        nombre: usuario.nombre,
        correo: usuario.correo,
        contrasena: (usuario as any).contrasena,
        rol: usuario.rol
      };
      
      const response = await api.post('/usuarios', backendData);
      const newUsuario = response.data;
      this.usuariosSignal.update(usuarios => [...usuarios, newUsuario]);
      return newUsuario;
    } catch (error) {
      console.error('Error creando usuario:', error);
      return null;
    }
  }

  async updateUsuario(id: number, usuario: Partial<Usuario>): Promise<boolean> {
    try {
      const backendData: any = {};
      if (usuario.nombre !== undefined) backendData.nombre = usuario.nombre;
      if (usuario.correo !== undefined) backendData.correo = usuario.correo;
      if ((usuario as any).contrasena !== undefined) backendData.contrasena = (usuario as any).contrasena;
      if (usuario.rol !== undefined) backendData.rol = usuario.rol;
      
      const response = await api.put(`/usuarios/${id}`, backendData);
      const updatedUsuario = response.data;
      this.usuariosSignal.update(usuarios =>
        usuarios.map(u => u.id === id ? updatedUsuario : u)
      );
      return true;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return false;
    }
  }

  async deleteUsuario(id: number): Promise<boolean> {
    try {
      await api.delete(`/usuarios/${id}`);
      this.usuariosSignal.update(usuarios => usuarios.filter(u => u.id !== id));
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  }
}
