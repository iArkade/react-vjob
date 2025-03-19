// Updated type definition to match our backend response
export interface ProfitLossItem {
    code: string;
    name: string;
    level: number;
    monthly: number;
    total: number;
    isHeader?: boolean;
}

export interface ProfitLossResponseType {
    report: ProfitLossItem[];
    startDate: string;
    endDate: string;
    level: number | 'All';
}