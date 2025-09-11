export type Transaction = {
    id: string;
    amount: number;
    currency: string;
    source: string;
    provider: string | null;
    status: string;
    riskScore: number;
    explanation?: string;
    timestamp: string;
};