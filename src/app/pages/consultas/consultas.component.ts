import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas.service';
import { VisitantesService } from '../../services/visitantes.service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  loading = signal(false);
  filtros = signal({
    fechaInicio: '',
    fechaFin: '',
    visitante: '',
    area: '',
    estado: ''
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

  citasFiltradas = computed(() => {
    let resultado = this.citas().map(cita => ({
      ...cita,
      visitante: this.visitantes().find(v => v.id === cita.visitante_id)
    }));

    const f = this.filtros();

    if (f.fechaInicio) {
      resultado = resultado.filter(c => new Date(c.fecha) >= new Date(f.fechaInicio));
    }
    if (f.fechaFin) {
      resultado = resultado.filter(c => new Date(c.fecha) <= new Date(f.fechaFin));
    }
    if (f.visitante) {
      resultado = resultado.filter(c => 
        c.visitante?.nombre.toLowerCase().includes(f.visitante.toLowerCase())
      );
    }
    if (f.area) {
      resultado = resultado.filter(c => 
        c.area?.toLowerCase().includes(f.area.toLowerCase())
      );
    }
    if (f.estado) {
      resultado = resultado.filter(c => c.estado === f.estado);
    }

    return resultado;
  });

  updateFiltro(campo: string, valor: string): void {
    this.filtros.update(f => ({ ...f, [campo]: valor }));
  }

  limpiarFiltros(): void {
    this.filtros.set({
      fechaInicio: '',
      fechaFin: '',
      visitante: '',
      area: '',
      estado: ''
    });
  }

  exportarPDF(): void {
    alert('Funcionalidad de exportar PDF (mock)');
  }

  exportarExcel(): void {
    alert('Funcionalidad de exportar Excel (mock)');
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
