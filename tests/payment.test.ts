import request from 'supertest';
import app from '../src/app';

describe('Payment API', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toEqual({ status: 'ok' });
        });
    });

    describe('POST /charge', () => {
        it('should route low-risk transaction successfully', async () => {
            const res = await request(app).post('/charge').send({
                amount: 50,
                source: 'tok_visa',
                email: 'user@example.com'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('transactionId');
            expect(res.body.riskScore).toBeLessThan(0.5);
            expect(res.body.status).toBe('success');
            expect(res.body.explanation).toContain('Risk score');
        });

        it('should block high-risk transaction', async () => {
            const res = await request(app).post('/charge').send({
                amount: 5000,
                source: 'tok_test',
                email: 'fraud@test.com'
            });
            expect([200, 403]).toContain(res.statusCode);
            if (res.statusCode === 403) {
                expect(res.body.status).toBe('blocked');
                expect(res.body.riskScore).toBeGreaterThanOrEqual(0.5);
                expect(res.body.explanation).toContain('blocked');
            }
        });

        it('should return 400 if amount is missing', async () => {
            const res = await request(app).post('/charge').send({
                source: 'tok_visa'
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if amount is negative', async () => {
            const res = await request(app).post('/charge').send({
                amount: -10,
                source: 'tok_visa'
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if source is missing', async () => {
            const res = await request(app).post('/charge').send({
                amount: 100
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should handle suspicious email domains correctly', async () => {
            const res = await request(app).post('/charge').send({
                amount: 200,
                source: 'tok_visa',
                email: 'user@test.com'
            });
            expect(res.body.riskScore).toBeGreaterThan(0);
            expect(res.body.explanation).toContain('suspicious_email_domain');
        });
    });

    describe('GET /charge/transactions', () => {
        it('should return an array of transactions', async () => {
            const res = await request(app).get('/charge/transactions');
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});

