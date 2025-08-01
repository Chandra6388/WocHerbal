const express = require('express');
const router = express.Router();
const { addBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, publishBlog } = require('../controllers/blogsControllers');

router.post('/add', addBlog);
router.post('/get', getAllBlogs);
router.post('/getBlogById', getBlogById);
router.post('/delete', deleteBlog);
router.post('/publish', publishBlog);
router.post('/update', updateBlog);





module.exports = router; 