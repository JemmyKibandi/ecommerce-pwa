import { Router } from 'express';
import { visualSearch } from '../controllers/visualSearch';
import { uploadTemp } from '../middleware/upload';

const router = Router();

router.post('/', uploadTemp.single('image'), visualSearch);

export default router;
