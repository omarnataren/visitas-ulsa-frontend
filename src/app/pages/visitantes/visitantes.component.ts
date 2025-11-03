import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitantesService } from '../../services/visitantes.service';
import { Visitante } from '../../models/visitante.model';

@Component({
  selector: 'app-visitantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitantes.component.html',
  styleUrls: ['./visitantes.component.css']
})
export class VisitantesComponent implements OnInit {
  showForm = signal(false);
  editingId = signal<number | null>(null);
  loading = signal(false);

  formData = signal<Partial<Visitante>>({
    nombre: '',
    genero: '',
    fecha_nacimiento: undefined,
    correo: '',
    telefono: '',
    ine: ''
  });

  constructor(private visitantesService: VisitantesService) {}

  async ngOnInit() {
    this.loading.set(true);
    await this.visitantesService.loadVisitantes();
    this.loading.set(false);
  }

  get visitantes() {
    return this.visitantesService.visitantes;
  }

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.resetForm();
  }

  editVisitante(visitante: Visitante): void {
    this.showForm.set(true);
    this.editingId.set(visitante.id);
    this.formData.set({ ...visitante });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      nombre: '',
      genero: '',
      fecha_nacimiento: undefined,
      correo: '',
      telefono: '',
      ine: ''
    });
  }

  async saveVisitante(): Promise<void> {
    const data = this.formData();
    if (!data.nombre) {
      alert('El nombre es requerido');
      return;
    }

    this.loading.set(true);
    const editId = this.editingId();
    let success = false;

    if (editId) {
      success = await this.visitantesService.updateVisitante(editId, data);
    } else {
      const result = await this.visitantesService.addVisitante(data as Omit<Visitante, 'id' | 'creado_en'>);
      success = result !== null;
    }

    this.loading.set(false);

    if (success) {
      this.closeForm();
    } else {
      alert('Error al guardar el visitante. Por favor intente de nuevo.');
    }
  }

  async deleteVisitante(id: number): Promise<void> {
    if (confirm('¿Está seguro de eliminar este visitante?')) {
      this.loading.set(true);
      const success = await this.visitantesService.deleteVisitante(id);
      this.loading.set(false);

      if (!success) {
        alert('Error al eliminar el visitante. Por favor intente de nuevo.');
      }
    }
  }
}
