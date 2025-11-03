import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin(): Promise<void> {
    if (!this.correo || !this.contrasena) {
      this.errorMessage = 'Por favor ingresa correo y contraseña';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.login(this.correo, this.contrasena);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
      }
    } catch (error) {
      this.errorMessage = 'Error al conectar con el servidor. Por favor intenta más tarde.';
      console.error('Error en login:', error);
    } finally {
      this.loading = false;
    }
  }
}
