const Blog = require('../models/Blogs');

// Create a new blog
exports.addBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({ status: 'success', blog: newBlog });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', blogs });
  } catch (error) {
    next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.body.id);
    if (!blog) return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    res.status(200).json({ status: 'success', blog });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
 
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    res.status(200).json({ status: 'success', blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.body.id);
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    res.status(200).json({ status: 'success', message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Publish blog
exports.publishBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.body.id,
      { isPublished: req?.body?.isPublished },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog published successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
};



