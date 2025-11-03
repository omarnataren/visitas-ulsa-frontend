export interface Visitante {
  id: number;
  nombre: string;
  genero?: string;
  fecha_nacimiento?: Date;
  correo?: string;
  telefono?: string;
  ine?: string;
  creado_en?: Date;
}
