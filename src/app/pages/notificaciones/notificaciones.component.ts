import { Component } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent {
  enviarNotificacion(): void {
    alert('Notificaciones enviadas correctamente (mock)');
  }
}
