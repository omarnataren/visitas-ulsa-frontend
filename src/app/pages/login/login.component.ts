import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    // Login mock - simplemente redirige al dashboard
    this.authService.login('admin@lasalle.mx', 'password');
    this.router.navigate(['/dashboard']);
  }
}
