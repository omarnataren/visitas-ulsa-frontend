import { Injectable, signal } from '@angular/core';
import { Visitante } from '../models/visitante.model';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private visitantesSignal = signal<Visitante[]>([
    {
      id: 1,
      nombre: 'Juan Carlos Pérez García',
      genero: 'Masculino',
      fecha_nacimiento: new Date('1985-05-15'),
      correo: 'juan.perez@email.com',
      telefono: '9511234567',
      ine: 'PEGA850515HOCRR01',
      creado_en: new Date('2025-10-28')
    },
    {
      id: 2,
      nombre: 'María Guadalupe López Martínez',
      genero: 'Femenino',
      fecha_nacimiento: new Date('1990-08-22'),
      correo: 'maria.lopez@email.com',
      telefono: '9517654321',
      ine: 'LOMM900822MOCRR02',
      creado_en: new Date('2025-10-29')
    },
    {
      id: 3,
      nombre: 'Roberto Sánchez Hernández',
      genero: 'Masculino',
      fecha_nacimiento: new Date('1978-12-10'),
      correo: 'roberto.sanchez@email.com',
      telefono: '9519876543',
      ine: 'SAHR781210HOCRR03',
      creado_en: new Date('2025-10-31')
    }
  ]);

  visitantes = this.visitantesSignal.asReadonly();

  getVisitantes(): Visitante[] {
    return this.visitantesSignal();
  }

  getVisitante(id: number): Visitante | undefined {
    return this.visitantesSignal().find(v => v.id === id);
  }

  addVisitante(visitante: Omit<Visitante, 'id' | 'creado_en'>): Visitante {
    const newVisitante: Visitante = {
      ...visitante,
      id: Math.max(...this.visitantesSignal().map(v => v.id), 0) + 1,
      creado_en: new Date()
    };
    this.visitantesSignal.update(visitantes => [...visitantes, newVisitante]);
    return newVisitante;
  }

  updateVisitante(id: number, visitante: Partial<Visitante>): void {
    this.visitantesSignal.update(visitantes =>
      visitantes.map(v => v.id === id ? { ...v, ...visitante } : v)
    );
  }

  deleteVisitante(id: number): void {
    this.visitantesSignal.update(visitantes => visitantes.filter(v => v.id !== id));
  }
}
