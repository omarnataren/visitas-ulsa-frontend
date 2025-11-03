import { Component, signal } from '@angular/core';
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
export class VisitantesComponent {
  showForm = signal(false);
  editingId = signal<number | null>(null);

  formData = signal<Partial<Visitante>>({
    nombre: '',
    genero: '',
    fecha_nacimiento: undefined,
    correo: '',
    telefono: '',
    ine: ''
  });

  constructor(private visitantesService: VisitantesService) {}

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

  saveVisitante(): void {
    const data = this.formData();
    if (!data.nombre) {
      alert('El nombre es requerido');
      return;
    }

    const editId = this.editingId();
    if (editId) {
      this.visitantesService.updateVisitante(editId, data);
    } else {
      this.visitantesService.addVisitante(data as Omit<Visitante, 'id' | 'creado_en'>);
    }

    this.closeForm();
  }

  deleteVisitante(id: number): void {
    if (confirm('¿Está seguro de eliminar este visitante?')) {
      this.visitantesService.deleteVisitante(id);
    }
  }
}
