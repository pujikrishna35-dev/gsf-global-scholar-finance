import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';

const router = Router();

router.get('/settings', (req, res) => settingsController.getSettings(req, res));
router.patch('/settings', (req, res) => settingsController.updateSettings(req, res));

export default router;
