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

exports.updateCategory = async (req, res, next) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ status: 'fail', message: 'Category ID is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedCategory) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }

    res.status(200).json({
      status: 'success',
      updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    let allCategory = await Category.find()
    res.status(200).json({ status: 'success', allCategory });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'Category ID is required' });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }

    res.status(200).json({ status: 'success', deletedCategory });
  } catch (error) {
    next(error);
  }
};

