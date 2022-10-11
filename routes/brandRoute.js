const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator");

const {
  getBrands,
  getBrandsWithById,
  createBrands,
  updateBrands,
  deleteBrands,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices");

const router = express.Router();
// clean route
router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrandsWithById)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrands)
  .delete(deleteBrandValidator, deleteBrands);

module.exports = router;
