import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menuOpen = signal(false);

  menuItems = [
    { icon: '▣', label: 'Inicio', route: '/dashboard/home' },
    { icon: '▣', label: 'Visitantes', route: '/dashboard/visitantes' },
    { icon: '▣', label: 'Citas', route: '/dashboard/citas' },
    { icon: '▣', label: 'Consultas', route: '/dashboard/consultas' },
    { icon: '▣', label: 'Notificaciones', route: '/dashboard/notificaciones' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get currentUser() {
    return this.authService.currentUser;
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
