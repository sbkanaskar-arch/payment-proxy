import express from 'express';
import paymentRoutes from './routes/paymentRoutes';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/charge', paymentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
