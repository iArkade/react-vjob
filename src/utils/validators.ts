import { AccountingPlanResponseType } from "@/api/accounting-plan/account-types";

export const validateCode = (code: string): boolean => {
    const regex = /^(\d+\.)*\d+\.?$/;
    return regex.test(code);
};

export const validateHierarchy = (code: string, accounts: AccountingPlanResponseType[]): { isValid: boolean; error?: string } => {
    const parts = code.split('.').filter(Boolean);

    if (accounts.length === 0 && (/^\d+(\.)?$/.test(code))) {
        return { isValid: true };
    }

    if (parts.length === 1) return { isValid: true };

    const parentCode = parts.slice(0, -1).join('.');
    const parent = accounts.find(account => account.code === parentCode || account.code === parentCode + '.');

    if (!parent) {
        return { isValid: false, error: `La cuenta padre ${parentCode} no existe.` };
    }

    if (!parent.code.endsWith('.')) {
        return { isValid: false, error: `La cuenta padre ${parentCode} no puede tener subcuentas porque no termina en punto.` };
    }

    if (code.includes('.') && !code.endsWith('.')) {
        const isTryingToCreateSubaccount = parts.length > 1;
        if (isTryingToCreateSubaccount && !parent.code.endsWith('.')) {
            return { isValid: false, error: `No se puede crear subcuentas para el código ${code} porque la cuenta padre ${parentCode} no termina en punto.` };
        }
    }

    return { isValid: true };
};

export const normalizeCode = (code: string): string => {
    return code.endsWith('.') ? code.slice(0, -1) : code;
};