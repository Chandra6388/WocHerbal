const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {addCategory} = require('../controllers/categoryControllers');

router.use(protect);

router.post('/add', addCategory);


module.exports = router; 