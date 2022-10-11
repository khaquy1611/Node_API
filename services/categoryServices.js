const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

// Upload single image
exports.uploadCategoryImage  = uploadSingleImage('image');


// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }
  next();
});
// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(CategoryModel);

// @desc   Get list of categories sepecifices by ID
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategoryWithById = factory.getOne(CategoryModel);;

// @desc   Create category
// @route  POST /api/v1/categories
// @access Private
exports.createCategories = factory.createOne(CategoryModel, 'Create categories success');

// @desc   Update list of categories sepecifices by ID
// @route  GET /api/v1/categories/:id
// @access Private
exports.updateCategories = factory.updateOne(CategoryModel, 'Update categories success');

// @desc   Delete list of categories sepecifices by ID
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategories = factory.deleteOne(CategoryModel, 'Delete categories success');
