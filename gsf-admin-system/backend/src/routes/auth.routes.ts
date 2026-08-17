import { Router } from 'express';
import { loginAdmin, getMe } from '../controllers/auth.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', authenticateAdmin, getMe);

export default router;
