import { Router } from 'express';
import { checkout, listMyOrders, getOrder } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/checkout', checkout);
router.get('/', listMyOrders);
router.get('/:id', getOrder);

export default router;

