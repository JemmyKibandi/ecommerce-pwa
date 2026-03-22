import { Router } from 'express';
import { createOrder, getMyOrders, getOrder } from '../controllers/orders';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);

export default router;
