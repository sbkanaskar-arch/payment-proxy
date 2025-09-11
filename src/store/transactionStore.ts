import { v4 as uuidv4 } from 'uuid';

type Tx = {
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

const txs: Tx[] = [];

export function addTransaction(data: Partial<Tx>) {
    const tx: Tx = {
        id: data.id || `txn_${uuidv4()}`,
        amount: data.amount || 0,
        currency: data.currency || 'USD',
        source: data.source || 'unknown',
        provider: data.provider || null,
        status: data.status || 'unknown',
        riskScore: data.riskScore ?? 0,
        explanation: data.explanation,
        timestamp: new Date().toISOString()
    };
    txs.push(tx);
    return tx;
}

export function getAllTransactions() {
    return txs.slice().reverse();
}