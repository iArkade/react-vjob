export interface LibroDiarioItem {
    cta: string;
    cta_nombre: string;
    codigo_centro: string;
    debe: number;
    haber: number;
    nota?: string;
}

export interface LibroDiarioAsiento {
    id: number;
    fecha_emision: string;
    nro_asiento: string;
    codigo_transaccion: string;
    comentario?: string;
    nro_referencia?: string;
    total_debe: number;
    total_haber: number;
    items: LibroDiarioItem[];
}

export interface LibroDiarioResponseType {
    asientos: LibroDiarioAsiento[];
    fechaDesde: string;
    fechaHasta: string;
    codigoTransaccion: string | null;
    totalDebe: number;
    totalHaber: number;
    totalDiferencia: number;
}