// Updated type definition to match our backend response
export interface BalanceGeneralItem {
    code: string;
    name: string;
    level: number;
    total: number;
    isHeader?: boolean;
}

export interface BalanceGeneralResponseType {
    report: BalanceGeneralItem[];
    endDate: string;
    level: number | 'All';
}


