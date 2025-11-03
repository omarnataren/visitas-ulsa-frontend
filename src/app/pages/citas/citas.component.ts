import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas.service';
import { VisitantesService } from '../../services/visitantes.service';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent {
  showForm = signal(false);
  editingId = signal<number | null>(null);

  formData = signal<Partial<Cita>>({
    visitante_id: 0,
    usuario_id: 1,
    fecha: new Date(),
    hora: '',
    persona_a_visitar: '',
    area: '',
    medio_ingreso: 'peatonal',
    marca_vehiculo: '',
    modelo_vehiculo: '',
    color_vehiculo: '',
    placas_vehiculo: '',
    estado: 'programada'
  });

  constructor(
    private citasService: CitasService,
    private visitantesService: VisitantesService
  ) {}

  get citas() {
    return this.citasService.citas;
  }

  get visitantes() {
    return this.visitantesService.visitantes;
  }

  citasConVisitante = computed(() => {
    return this.citas().map(cita => ({
      ...cita,
      visitante: this.visitantes().find(v => v.id === cita.visitante_id)
    }));
  });

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.resetForm();
  }

  editCita(cita: Cita): void {
    this.showForm.set(true);
    this.editingId.set(cita.id);
    this.formData.set({ ...cita });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      visitante_id: 0,
      usuario_id: 1,
      fecha: new Date(),
      hora: '',
      persona_a_visitar: '',
      area: '',
      medio_ingreso: 'peatonal',
      marca_vehiculo: '',
      modelo_vehiculo: '',
      color_vehiculo: '',
      placas_vehiculo: '',
      estado: 'programada'
    });
  }

  saveCita(): void {
    const data = this.formData();
    if (!data.visitante_id || !data.hora || !data.persona_a_visitar) {
      alert('Complete los campos requeridos');
      return;
    }

    const editId = this.editingId();
    if (editId) {
      this.citasService.updateCita(editId, data);
    } else {
      this.citasService.addCita(data as Omit<Cita, 'id' | 'creado_en'>);
    }

    this.closeForm();
  }

  deleteCita(id: number): void {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.citasService.deleteCita(id);
    }
  }

  reagendarCita(cita: Cita): void {
    const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD):', cita.fecha.toString().split('T')[0]);
    const nuevaHora = prompt('Nueva hora (HH:MM):', cita.hora);
    
    if (nuevaFecha && nuevaHora) {
      this.citasService.reagendarCita(cita.id, new Date(nuevaFecha), nuevaHora);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      'programada': 'badge-success',
      'reagendada': 'badge-warning',
      'finalizada': 'badge-gray'
    };
    return classes[estado] || '';
  }
}
