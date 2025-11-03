import { Injectable, signal } from '@angular/core';
import { Visitante } from '../models/visitante.model';
import api from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private visitantesSignal = signal<Visitante[]>([]);
  visitantes = this.visitantesSignal.asReadonly();

  async loadVisitantes(): Promise<void> {
    try {
      const response = await api.get('/visitantes');
      this.visitantesSignal.set(response.data);
    } catch (error) {
      console.error('Error cargando visitantes:', error);
    }
  }

  getVisitantes(): Visitante[] {
    return this.visitantesSignal();
  }

  async getVisitante(id: number): Promise<Visitante | null> {
    try {
      const response = await api.get(`/visitantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo visitante:', error);
      return null;
    }
  }

  async addVisitante(visitante: Omit<Visitante, 'id' | 'creado_en'>): Promise<Visitante | null> {
    try {
      // Convertir campos al formato camelCase del backend
      const backendData = {
        nombre: visitante.nombre,
        genero: visitante.genero,
        fechaNacimiento: visitante.fecha_nacimiento,
        correo: visitante.correo,
        telefono: visitante.telefono,
        ine: visitante.ine
      };
      
      const response = await api.post('/visitantes', backendData);
      const newVisitante = response.data;
      this.visitantesSignal.update(visitantes => [...visitantes, newVisitante]);
      return newVisitante;
    } catch (error) {
      console.error('Error creando visitante:', error);
      return null;
    }
  }

  async updateVisitante(id: number, visitante: Partial<Visitante>): Promise<boolean> {
    try {
      // Convertir campos al formato camelCase del backend
      const backendData: any = {};
      if (visitante.nombre !== undefined) backendData.nombre = visitante.nombre;
      if (visitante.genero !== undefined) backendData.genero = visitante.genero;
      if (visitante.fecha_nacimiento !== undefined) backendData.fechaNacimiento = visitante.fecha_nacimiento;
      if (visitante.correo !== undefined) backendData.correo = visitante.correo;
      if (visitante.telefono !== undefined) backendData.telefono = visitante.telefono;
      if (visitante.ine !== undefined) backendData.ine = visitante.ine;
      
      const response = await api.put(`/visitantes/${id}`, backendData);
      const updatedVisitante = response.data;
      this.visitantesSignal.update(visitantes =>
        visitantes.map(v => v.id === id ? updatedVisitante : v)
      );
      return true;
    } catch (error) {
      console.error('Error actualizando visitante:', error);
      return false;
    }
  }

  async deleteVisitante(id: number): Promise<boolean> {
    try {
      await api.delete(`/visitantes/${id}`);
      this.visitantesSignal.update(visitantes => visitantes.filter(v => v.id !== id));
      return true;
    } catch (error) {
      console.error('Error eliminando visitante:', error);
      return false;
    }
  }
}
