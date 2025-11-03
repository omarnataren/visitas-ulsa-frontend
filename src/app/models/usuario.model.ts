export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin_sistema' | 'admin_universitario';
}
