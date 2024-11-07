export interface AccountingPlanResponseType {
    id: number;
    code: string;
    name: string;
    company_code: string;
    createdAt: string;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface AccountingPlanRequestType {
code: string;
name: string;
company_code?: string; // Opcional si se asigna automáticamente en el backend
}
