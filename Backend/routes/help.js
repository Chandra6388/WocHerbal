const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  createHelpRequest,
  getMyHelpRequests,
  getHelpRequest,
  updateHelpRequest,
  deleteHelpRequest,
  respondToHelpRequest,
  rateHelpRequest,
  getHelpRequestStats,
  getHelpCategories
} = require('../controllers/helpController');

// Public routes
router.get('/categories', getHelpCategories);

// Protected routes
router.use(protect);

// Help request routes
router.post('/', validate('createHelpRequest'), createHelpRequest);
router.get('/my-requests', getMyHelpRequests);
router.get('/:id', getHelpRequest);
router.put('/:id', updateHelpRequest);
router.delete('/:id', deleteHelpRequest);
router.post('/:id/respond', respondToHelpRequest);
router.post('/:id/rate', rateHelpRequest);

// Admin routes
router.get('/admin/stats', adminOnly, getHelpRequestStats);

module.exports = router; 