const express = require("express");
const {
  createSubCategory,
  getSubcategory,
  getCategoryWithById,
  updateSubCategories,
  deleteCategories,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(createFilterObj,getSubcategory)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getCategoryWithById)
  .put(updateSubCategoryValidator, updateSubCategories)
  .delete(deleteSubCategoryValidator, deleteCategories);

module.exports = router;
