const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get all notifications for authenticated user
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.patch('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, notificationController.markAllAsRead);

// Delete all notifications
router.delete('/all', auth, notificationController.deleteAllNotifications);

module.exports = router; 