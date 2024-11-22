export interface DatCentro {
  id?: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  codigo_empresa?: string;
}

export interface Asiento {
  id?: number;
  fecha_emision: string;
  nro_asiento: string;
  comentario: string;
  tipo_transaccion: string;
  estado: string;
  nro_referencia: string;
  secuencial: string;
  codigo_centro: string;
  codigo_empresa: string;
  total_debe: number;
  total_haber: number;
  lineItems: AsientoItem[];
}

export interface AsientoItem {
  id?: number;
  codigo_centro: string;
  cta: string;
  cta_nombre: string;
  debe: number;
  haber: number;
  nota?: string;
}
