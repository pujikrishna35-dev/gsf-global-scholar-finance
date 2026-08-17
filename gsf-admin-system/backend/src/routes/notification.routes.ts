import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/notifications', (req, res) => notificationController.getNotifications(req, res));
router.get('/notifications/unread-count', (req, res) => notificationController.getUnreadCount(req, res));
router.patch('/notifications/read-all', (req, res) => notificationController.markAllAsRead(req, res));
router.patch('/notifications/:id/read', (req, res) => notificationController.markAsRead(req, res));

export default router;
