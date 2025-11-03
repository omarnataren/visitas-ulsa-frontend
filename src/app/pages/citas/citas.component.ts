import { Component, signal, computed, OnInit } from '@angular/core';
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
export class CitasComponent implements OnInit {
  showForm = signal(false);
  editingId = signal<number | null>(null);
  loading = signal(false);

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

  async ngOnInit() {
    this.loading.set(true);
    await Promise.all([
      this.citasService.loadCitas(),
      this.visitantesService.loadVisitantes()
    ]);
    this.loading.set(false);
  }

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

  async saveCita(): Promise<void> {
    const data = this.formData();
    if (!data.visitante_id || !data.hora || !data.persona_a_visitar) {
      alert('Complete los campos requeridos');
      return;
    }

    this.loading.set(true);
    const editId = this.editingId();
    let success = false;

    if (editId) {
      success = await this.citasService.updateCita(editId, data);
    } else {
      const result = await this.citasService.addCita(data as Omit<Cita, 'id' | 'creado_en'>);
      success = result !== null;
    }

    this.loading.set(false);

    if (success) {
      this.closeForm();
    } else {
      alert('Error al guardar la cita. Por favor intente de nuevo.');
    }
  }

  async deleteCita(id: number): Promise<void> {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.loading.set(true);
      const success = await this.citasService.deleteCita(id);
      this.loading.set(false);

      if (!success) {
        alert('Error al eliminar la cita. Por favor intente de nuevo.');
      }
    }
  }

  async reagendarCita(cita: Cita): Promise<void> {
    const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD):', cita.fecha.toString().split('T')[0]);
    const nuevaHora = prompt('Nueva hora (HH:MM):', cita.hora);
    
    if (nuevaFecha && nuevaHora) {
      this.loading.set(true);
      const success = await this.citasService.reagendarCita(cita.id, new Date(nuevaFecha), nuevaHora);
      this.loading.set(false);

      if (!success) {
        alert('Error al reagendar la cita. Por favor intente de nuevo.');
      }
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
