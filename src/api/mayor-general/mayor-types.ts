export interface MayorGeneralMovimiento {
     fecha: string;
     nro_asiento: string;
     descripcion: string;
     nota?: string;
     debe: number;
     haber: number;
     saldo: number;
}

export interface MayorGeneralCuenta {
     cuenta: string; // ejemplo: "1.1.1.01 Caja General"
     saldoInicial: number;
     movimientos: MayorGeneralMovimiento[];
}

export interface MayorGeneralResponseType {
     report: MayorGeneralCuenta[];
     startDate: string | undefined;  
     endDate: string | undefined; 
     initialAccount?: string;
     finalAccount?: string;
     transaction?: string;
}