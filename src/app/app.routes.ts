import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { VisitantesComponent } from './pages/visitantes/visitantes.component';
import { CitasComponent } from './pages/citas/citas.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'visitantes', component: VisitantesComponent },
      { path: 'citas', component: CitasComponent },
      { path: 'consultas', component: ConsultasComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
