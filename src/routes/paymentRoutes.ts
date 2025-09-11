import { Router } from 'express';
import { postCharge, getTransactions } from '../controllers/paymentController';

const router = Router();

router.post('/', postCharge);
router.get('/transactions', getTransactions);

export default router;