import { Injectable, signal } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private citasSignal = signal<Cita[]>([
    {
      id: 1,
      visitante_id: 1,
      usuario_id: 1,
      fecha: new Date('2025-11-03'),
      hora: '10:00',
      persona_a_visitar: 'Dr. Carlos Mendoza',
      area: 'Dirección Académica',
      medio_ingreso: 'peatonal',
      estado: 'programada',
      creado_en: new Date('2025-10-28')
    },
    {
      id: 2,
      visitante_id: 2,
      usuario_id: 2,
      fecha: new Date('2025-11-04'),
      hora: '14:30',
      persona_a_visitar: 'Lic. Ana Patricia Ruiz',
      area: 'Recursos Humanos',
      medio_ingreso: 'vehicular',
      marca_vehiculo: 'Toyota',
      modelo_vehiculo: 'Corolla',
      color_vehiculo: 'Gris',
      placas_vehiculo: 'ABC-123-D',
      estado: 'programada',
      creado_en: new Date('2025-10-29')
    },
    {
      id: 3,
      visitante_id: 3,
      usuario_id: 1,
      fecha: new Date('2025-11-05'),
      hora: '09:00',
      persona_a_visitar: 'Mtro. Luis Fernando Gómez',
      area: 'Coordinación de Ingeniería',
      medio_ingreso: 'vehicular',
      marca_vehiculo: 'Nissan',
      modelo_vehiculo: 'Sentra',
      color_vehiculo: 'Azul',
      placas_vehiculo: 'XYZ-456-A',
      estado: 'programada',
      creado_en: new Date('2025-10-31')
    }
  ]);

  citas = this.citasSignal.asReadonly();

  getCitas(): Cita[] {
    return this.citasSignal();
  }

  getCita(id: number): Cita | undefined {
    return this.citasSignal().find(c => c.id === id);
  }

  addCita(cita: Omit<Cita, 'id' | 'creado_en'>): Cita {
    const newCita: Cita = {
      ...cita,
      id: Math.max(...this.citasSignal().map(c => c.id), 0) + 1,
      creado_en: new Date()
    };
    this.citasSignal.update(citas => [...citas, newCita]);
    return newCita;
  }

  updateCita(id: number, cita: Partial<Cita>): void {
    this.citasSignal.update(citas =>
      citas.map(c => c.id === id ? { ...c, ...cita } : c)
    );
  }

  deleteCita(id: number): void {
    this.citasSignal.update(citas => citas.filter(c => c.id !== id));
  }

  reagendarCita(id: number, nuevaFecha: Date, nuevaHora: string): void {
    this.updateCita(id, {
      fecha: nuevaFecha,
      hora: nuevaHora,
      estado: 'reagendada'
    });
  }
}
