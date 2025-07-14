const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

const {
  getAllNotifications,
  getNotificationStats,
  deleteNotification,
  bulkDeleteNotifications,
  getNotificationHistory,
  sendTestNotification,
  getNotificationTemplates
} = require('../controllers/notificationController');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// Notification management routes
router.get('/admin/all', getAllNotifications);
router.get('/admin/stats', getNotificationStats);
router.delete('/admin/:id', deleteNotification);
router.delete('/admin/bulk-delete', bulkDeleteNotifications);
router.get('/admin/history', getNotificationHistory);

// Test and template routes
router.post('/admin/test', sendTestNotification);
router.get('/admin/templates', getNotificationTemplates);

module.exports = router; 