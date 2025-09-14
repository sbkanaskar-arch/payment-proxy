import fs from 'fs';
import path from 'path';
import { WEIGHT_SCORE } from '../config/constant';
import { FraudRules, RiskInput } from '../models/transaction';

const defaultRules: FraudRules = {
    highAmount: WEIGHT_SCORE.highAmount,
    suspiciousDomains: ['.ru', 'test.com']
};

let rules: FraudRules = defaultRules;

const rulesPath = path.join(__dirname, '..', 'config', 'fraudRules.json');

try {
    if (fs.existsSync(rulesPath)) {
        const file = fs.readFileSync(rulesPath, 'utf8');
        const parsed = JSON.parse(file);
        rules = { ...defaultRules, ...parsed };
    }
} catch (e: any) {
    console.warn(`could not load fraud rules from ${rulesPath}, using defaults. Error: `, e.message);
}

export function computeRisk(input: RiskInput) {
    const reasons: string[] = [];
    let score =  WEIGHT_SCORE.initialScore;

    const amt = input.amount;

    // Amount-based risk calculation
    if (amt >= rules.highAmount) {
        score += WEIGHT_SCORE.highAmountScore;
        reasons.push(`high_amount >= ${rules.highAmount}`);
    }

    // Email domain check
    if (input.email) {
        const email = input.email.toLowerCase();
        for (const domain of rules.suspiciousDomains) {
            if (email.endsWith(domain) || email.includes(domain)) {
                score += WEIGHT_SCORE.fraudEmailScore;
                reasons.push(`suspicious_email_domain ${domain}`);
                break; // Only add one reason per email check
            }
        }
    }

    // clamp
    if (score > 1) score = 1;


    return { score: Number(score.toFixed(2)), reasons };
}