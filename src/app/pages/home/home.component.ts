import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../services/citas.service';
import { VisitantesService } from '../../services/visitantes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = signal(false);

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

  stats = computed(() => {
    const citas = this.citasService.citas();
    const visitantes = this.visitantesService.visitantes();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return {
      visitantesRegistrados: visitantes.length,
      citasProgramadas: citas.filter(c => c.estado === 'programada').length,
      citasHoy: citas.filter(c => {
        const citaFecha = new Date(c.fecha);
        citaFecha.setHours(0, 0, 0, 0);
        return citaFecha.getTime() === hoy.getTime();
      }).length,
      citasReagendadas: citas.filter(c => c.estado === 'reagendada').length
    };
  });
}
