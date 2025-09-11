import { Request, Response } from 'express';
import { computeRisk } from '../services/fraudService';
import { processPayment } from '../services/paymentService';
import { summarizeRisk } from '../services/llmService';
import { addTransaction, getAllTransactions } from '../store/transactionStore';

export async function postCharge(req: Request, res: Response) {
    try {
        const { amount, currency = 'USD', source, email, metadata } = req.body;

        // basic validation
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'amount is required and must be a positive number' });
        }

        if (!source || typeof source !== 'string') {
            return res.status(400).json({ error: 'source is required' });
        }

        const { score, reasons } = computeRisk({ amount, email, source, metadata });

        if (score >= 0.5) {
            // blocked
            const explanation = await summarizeRisk({ amount, currency, score, reasons, routed: false });
            const tx = addTransaction({ amount, currency, source, provider: null, status: 'blocked', riskScore: score, explanation });
            return res.status(403).json({ transactionId: tx.id, status: 'blocked', riskScore: score, explanation });
        }

        // route to a provider (simple: choose stripe for even, paypal for odd cents, demo)
        const provider = amount % 2 === 0 ? 'stripe' : 'paypal';
        const paymentResult = await processPayment({ amount, currency, provider, source });

        const explanation = await summarizeRisk({ amount, currency, score, reasons, routed: true, provider });

        const tx = addTransaction({
            amount,
            currency,
            source,
            provider,
            status: paymentResult.status,
            riskScore: score,
            explanation
        });

        return res.status(200).json({ transactionId: tx.id, provider, status: paymentResult.status, riskScore: score, explanation });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: 'internal_server_error' });
    }
}

export function getTransactions(req: Request, res: Response) {
    return res.status(200).json(getAllTransactions());
}