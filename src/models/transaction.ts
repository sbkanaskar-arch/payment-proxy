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

export type RiskInput = {
    amount: number;
    email?: string;
    source?: string;
    metadata?: any

}
export type FraudRules = {
    highAmount: number;
    suspiciousDomains: string[];
};