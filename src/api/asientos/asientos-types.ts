export interface DatCentro {
  id?: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  empresa_id: number;
}

export interface Asiento {
  id?: number;
  fecha_emision: string;
  nro_asiento: string;
  comentario: string;
  codigo_transaccion: string;
  estado: string;
  nro_referencia: string;
  codigo_centro: string;
  empresa_id: number;
  total_debe: number;
  total_haber: number;
  lineItems: AsientoItem[];
}

export interface AsientoItem {
  id?: number;
  codigo_centro: string;
  cta: string;
  cta_nombre: string;
  debe: number | string;
  haber: number | string;
  nota?: string;
}
