import { Router } from 'express';
import { getCart, updateCart, removeFromCart, clearCart } from '../controllers/cart';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/', updateCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);

export default router;
