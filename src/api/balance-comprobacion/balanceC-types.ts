export interface BalanceComprobacionItem {
    codigo: string;
    nombre: string;
    saldoAnterior: number;   
    movimientosDebe: number; 
    movimientosHaber: number;
    saldoAnteriorDebe: number; 
    saldoAnteriorHaber: number; 
    saldoDebe: number;       
    saldoHaber: number;
    tipoCuenta: string;      
    level: number;           
}

export interface BalanceComprobacionResponse {
    report: BalanceComprobacionItem[];
    startDate: string;
    endDate: string;
    initialAccount?: string;
    finalAccount?: string;
    level?: number;
    totalSaldoAnteriorDebe: number;
    totalSaldoAnteriorHaber: number;
    totalMovimientosDebe: number;
    totalMovimientosHaber: number;
    totalSaldosDebe: number;
    totalSaldosHaber: number;
    diferenciaMovimientos: number;
    diferenciaSaldos: number;
}