export interface Cita {
  id: number;
  visitante_id: number;
  usuario_id: number;
  fecha: Date;
  hora: string;
  persona_a_visitar: string;
  area?: string;
  medio_ingreso?: 'peatonal' | 'vehicular';
  marca_vehiculo?: string;
  modelo_vehiculo?: string;
  color_vehiculo?: string;
  placas_vehiculo?: string;
  estado: 'programada' | 'reagendada' | 'finalizada';
  creado_en?: Date;
  visitante?: any;
}
