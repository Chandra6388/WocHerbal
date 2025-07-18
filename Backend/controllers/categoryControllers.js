const Category = require('../models/Category');

exports.addCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      status: 'success',
      newCategory
    });
  } catch (error) {
    next(error);
  }
};

