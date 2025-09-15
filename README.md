# Payment Proxy

A Node.js Express server for payment processing proxy functionality with integrated fraud detection and risk assessment.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd payment-proxy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your actual values:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Or build and start production:
   ```bash
   npm run build
   npm start
   ```

The server will start on the port specified in your `.env` file (default: 3000).

### Health Check

Visit `http://localhost:3000/health` to verify the server is running. You should see:
```json
{
  "status": "ok"
}
```

## 🔍 Fraud Detection Logic

### Risk Scoring System

The payment proxy implements a multi-layered fraud detection system with the following components:

#### 1. Amount-Based Risk Assessment
- **High Amount Threshold**: Configurable via `src/config/fraudRules.json` (default: 1000)
- **Scoring Logic**:
  - If `amount >= highAmount`: +0.5 risk score
- **Reason**: "high_amount >= {threshold}" for high amounts

#### 2. Email Domain Analysis
- **Suspicious Domains**: Configurable list in fraud rules (default: [".ru", "test.com", "spam.xyz"])
- **Scoring Logic**: +0.3 risk score for suspicious domains
- **Detection**: Checks if email ends with or contains suspicious domains
- **Reason**: "suspicious_email_domain {domain}"

#### 4. Risk Score Calculation
- **Final Score**: Sum of all risk factors, clamped to maximum of 1.0
- **Blocking Threshold**: Transactions with score ≥ 0.5 are automatically blocked
- **Score Precision**: Rounded to 2 decimal places

### Configuration

Fraud rules are stored in `src/config/fraudRules.json`:
```json
{
  "highAmount": 1000,
  "suspiciousDomains": [".ru", "test.com", "spam.xyz"]
}
```

## 🤖 LLM Integration

### Risk Summary Generation

The system uses an LLM service to generate human-readable explanations for payment decisions:

#### Features:
- **Caching**: Results are cached to avoid recomputing identical scenarios
- **Dynamic Explanations**: Context-aware explanations based on transaction outcome
- **Structured Output**: Consistent format for all risk summaries

#### Explanation Format:
```
Risk score {score}. {routing_decision}. Reasons: {risk_factors}.
```

#### Routing Decisions:
- **Approved**: "The payment was routed to {provider}."
- **Blocked**: "The payment was blocked due to high risk."

#### Example Output:
```
Risk score 0.8. The payment was routed to stripe. Reasons: high_amount >= 1000, suspicious_email_domain .ru.
```

### LLM Service Architecture

- **File**: `src/services/llmService.ts`
- **Function**: `summarizeRisk()`
- **Caching**: In-memory Map for performance optimization
- **Fallback**: Safe fallback implementation (no external API required)

## 🏗️ Architecture

### Project Structure
```
src/
├── index.ts                 # Application entry point
├── app.ts                   # Express app configuration
├── routes/
│   └── paymentRoutes.ts     # Payment API routes
├── controllers/
│   └── paymentController.ts # Payment request handlers
├── services/
│   ├── fraudService.ts      # Fraud detection logic
│   ├── paymentService.ts    # Payment processing
│   └── llmService.ts        # LLM risk summarization
├── store/
│   └── transactionStore.ts  # In-memory transaction storage
├── models/
│   └── transaction.ts       # TypeScript interfaces
└── config/
    └── fraudRules.json      # Fraud detection rules
```

### API Endpoints

#### POST /charge
Process a payment with fraud detection:
```json
{
  "amount": 1000,
  "currency": "USD",
  "source": "web",
  "email": "user@example.com",
  "metadata": {}
}
```

**Responses:**
- **200**: Payment approved and routed
- **400**: Invalid request (missing/invalid amount)
- **403**: Payment blocked due to high risk

#### GET /transactions
Retrieve all transactions (most recent first)

#### GET /health
Health check endpoint

## ⚖️ Assumptions & Tradeoffs

1. **In-Memory Storage**: Transactions are stored in memory (not persistent)
2. **Simple Provider Routing**: Even amounts → Stripe, Odd amounts → PayPal
3. **Static Fraud Rules**: Rules loaded once at startup (no hot-reloading)
4. **Synchronous Processing**: All fraud checks are synchronous
5. **No External APIs**: LLM service uses fallback implementation

#### Performance vs. Accuracy
- **Fast Processing**: In-memory storage and caching for speed
- **Limited Persistence**: Data lost on server restart
- **Simple Rules**: Basic heuristics vs. complex ML models

#### Security vs. Usability
- **Conservative Blocking**: 0.5 threshold may block legitimate transactions
- **No Rate Limiting**: No protection against rapid-fire requests
- **Basic Validation**: Minimal input validation beyond amount

#### Scalability vs. Simplicity
- **Single Instance**: No distributed fraud detection
- **No Database**: Limited to single server deployment
- **Memory Constraints**: Transaction history grows indefinitely

### Future Improvements

1. **Database Integration**: Persistent transaction storage
2. **External LLM APIs**: OpenAI/Anthropic integration
3. **Advanced Fraud Detection**: Machine learning models
4. **Rate Limiting**: Request throttling and abuse prevention
5. **Audit Logging**: Comprehensive transaction logging
6. **Configuration Management**: Hot-reloading of fraud rules
7. **Monitoring**: Metrics and alerting for fraud patterns

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- API endpoint functionality
- Fraud detection logic
- Transaction storage
- Health check endpoint

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
