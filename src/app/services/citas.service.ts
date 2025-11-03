import { Injectable, signal } from '@angular/core';
import { Cita } from '../models/cita.model';
import api from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private citasSignal = signal<Cita[]>([]);
  citas = this.citasSignal.asReadonly();

  async loadCitas(): Promise<void> {
    try {
      const response = await api.get('/citas');
      this.citasSignal.set(response.data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    }
  }

  getCitas(): Cita[] {
    return this.citasSignal();
  }

  async getCita(id: number): Promise<Cita | null> {
    try {
      const response = await api.get(`/citas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cita:', error);
      return null;
    }
  }

  async addCita(cita: Omit<Cita, 'id' | 'creado_en'>): Promise<Cita | null> {
    try {
      // Convertir campos al formato camelCase del backend
      const backendData = {
        visitanteId: cita.visitante_id,
        usuarioId: cita.usuario_id,
        fecha: cita.fecha,
        hora: cita.hora,
        personaAVisitar: cita.persona_a_visitar,
        area: cita.area,
        medioIngreso: cita.medio_ingreso,
        marcaVehiculo: cita.marca_vehiculo,
        modeloVehiculo: cita.modelo_vehiculo,
        colorVehiculo: cita.color_vehiculo,
        placasVehiculo: cita.placas_vehiculo
      };
      
      const response = await api.post('/citas', backendData);
      const newCita = response.data;
      this.citasSignal.update(citas => [...citas, newCita]);
      return newCita;
    } catch (error) {
      console.error('Error creando cita:', error);
      return null;
    }
  }

  async updateCita(id: number, cita: Partial<Cita>): Promise<boolean> {
    try {
      // Convertir campos al formato camelCase del backend
      const backendData: any = {};
      if (cita.visitante_id !== undefined) backendData.visitanteId = cita.visitante_id;
      if (cita.usuario_id !== undefined) backendData.usuarioId = cita.usuario_id;
      if (cita.fecha !== undefined) backendData.fecha = cita.fecha;
      if (cita.hora !== undefined) backendData.hora = cita.hora;
      if (cita.persona_a_visitar !== undefined) backendData.personaAVisitar = cita.persona_a_visitar;
      if (cita.area !== undefined) backendData.area = cita.area;
      if (cita.medio_ingreso !== undefined) backendData.medioIngreso = cita.medio_ingreso;
      if (cita.marca_vehiculo !== undefined) backendData.marcaVehiculo = cita.marca_vehiculo;
      if (cita.modelo_vehiculo !== undefined) backendData.modeloVehiculo = cita.modelo_vehiculo;
      if (cita.color_vehiculo !== undefined) backendData.colorVehiculo = cita.color_vehiculo;
      if (cita.placas_vehiculo !== undefined) backendData.placasVehiculo = cita.placas_vehiculo;
      if (cita.estado !== undefined) backendData.estado = cita.estado;
      
      const response = await api.put(`/citas/${id}`, backendData);
      const updatedCita = response.data;
      this.citasSignal.update(citas =>
        citas.map(c => c.id === id ? updatedCita : c)
      );
      return true;
    } catch (error) {
      console.error('Error actualizando cita:', error);
      return false;
    }
  }

  async deleteCita(id: number): Promise<boolean> {
    try {
      await api.delete(`/citas/${id}`);
      this.citasSignal.update(citas => citas.filter(c => c.id !== id));
      return true;
    } catch (error) {
      console.error('Error eliminando cita:', error);
      return false;
    }
  }

  async updateEstadoCita(id: number, estado: string): Promise<boolean> {
    try {
      const response = await api.patch(`/citas/${id}/estado`, { estado });
      const updatedCita = response.data;
      this.citasSignal.update(citas =>
        citas.map(c => c.id === id ? updatedCita : c)
      );
      return true;
    } catch (error) {
      console.error('Error actualizando estado de cita:', error);
      return false;
    }
  }

  async reagendarCita(id: number, nuevaFecha: Date, nuevaHora: string): Promise<boolean> {
    try {
      const backendData = {
        fecha: nuevaFecha,
        hora: nuevaHora,
        estado: 'REAGENDADA'
      };
      const response = await api.put(`/citas/${id}`, backendData);
      const updatedCita = response.data;
      this.citasSignal.update(citas =>
        citas.map(c => c.id === id ? updatedCita : c)
      );
      return true;
    } catch (error) {
      console.error('Error reagendando cita:', error);
      return false;
    }
  }
}
