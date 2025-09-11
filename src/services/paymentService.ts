import { v4 as uuidv4 } from 'uuid';


export async function processPayment({ amount, currency, provider, source }: { amount: number; currency: string; provider: string | null; source: string }) {
    // This is a mocked function — in a real system i would call payment platform
    await new Promise((r) => setTimeout(r, 120)); // simulate IO latency


    return {
        id: `txn_${uuidv4()}`,
        status: 'success'
    };
}