export interface AccountingPlanResponseType {
    id: number;
    code: string;
    name: string;
    empresa_id: number;
    createdAt: string;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface AccountingPlanRequestType {
code: string;
name: string;
empresa_id: number; // Opcional si se asigna automáticamente en el backend
}