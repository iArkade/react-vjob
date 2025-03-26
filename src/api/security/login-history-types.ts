export interface CreateLoginHistoryDto {
     userId: number;
     userName: string;
}

export type LoginHistoryItem = {
     id: number;
     ip: string;
     browser: string;
     os: string;
     timestamp: string;
     userName: string;
};

