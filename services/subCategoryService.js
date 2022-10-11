const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = {
      category: req.params.categoryId,
    };
  }
  req.filterObj = filterObject;
  next();
};
// @desc Create a new SubCategory
// @router POST /api/v1/subCategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory, 'create subCategory success');


// @desc   Get list of subCategories
// @router GET /api/v1/subCategories
// @access Public
exports.getSubcategory = factory.getAll(SubCategory);

// @desc   Get list of subCategories sepecifices by ID
// @route  GET /api/v1/subCategories/:id
// @access Public
exports.getCategoryWithById = factory.getOne(SubCategory);



// @desc   Update list of sub categories sepecifices by ID
// @route  GET /api/v1/subCategories/:id
// @access Private
exports.updateSubCategories = factory.updateOne(SubCategory, 'Update subcategories success');

// @desc   Delete list of sub categories sepecifices by ID
// @route  DELETE /api/v1/subCategories/:id
// @access Private
exports.deleteCategories = factory.deleteOne(SubCategory, 'Delete subcategories success');
