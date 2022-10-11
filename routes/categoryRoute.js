const express = require("express");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validator/categoryValidator");
// auth protected
const authService = require("../services/authService");

const {
  getCategories,
  createCategories,
  getCategoryWithById,
  updateCategories,
  deleteCategories,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryServices");

const subcategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);
// clean route
router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategories
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryWithById)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategories
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategories
  );

module.exports = router;
