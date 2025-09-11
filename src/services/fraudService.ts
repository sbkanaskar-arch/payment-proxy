import fs from 'fs';
import path from 'path';
type RiskInput = {
    amount: number;
    email?: string;
    source?: string;
    metadata?: any

}
const rulesPath = path.join(__dirname, '..', 'config', 'fraudRules.json');
let rules = {
    highAmount: 1000,
    suspiciousDomains: ['.ru', 'test.com']
};

try {
    if (fs.existsSync(rulesPath)) {
        const file = fs.readFileSync(rulesPath, 'utf8');
        rules = JSON.parse(file);
    }
} catch (e: any) {
    console.warn(`could not load fraud rules from ${rulesPath}, using defaults. Error: `, e.message);
}

export function computeRisk(input: RiskInput) {
    const reasons: string[] = [];
    let score = 0.0;

    const amt = input.amount;

    // Amount-based risk calculation
    if (amt >= rules.highAmount) {
        score += 0.5;
        reasons.push(`high_amount >= ${rules.highAmount}`);
    } else {
        score += (amt / rules.highAmount) * 0.3;
    }

    // Email domain check
    if (input.email) {
        const email = input.email.toLowerCase();
        for (const domain of rules.suspiciousDomains) {
            if (email.endsWith(domain) || email.includes(domain)) {
                score += 0.3;
                reasons.push(`suspicious_email_domain ${domain}`);
                break; // Only add one reason per email check
            }
        }
    }

    // suspicious source token (simple pattern)
    if (input.source && input.source.includes('test')) {
        score += 0.2;
        reasons.push('test_source_token');
    }


    // clamp
    if (score > 1) score = 1;


    return { score: Number(score.toFixed(2)), reasons };
}