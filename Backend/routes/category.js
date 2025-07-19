const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {addCategory, getCategory, deleteCategory, updateCategory} = require('../controllers/categoryControllers');

router.use(protect);

router.post('/add', addCategory);
router.post('/get', getCategory);
router.post('/delete', deleteCategory);
router.post('/update', updateCategory);





module.exports = router; 