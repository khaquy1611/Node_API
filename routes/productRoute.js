const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");

const {
  getProducts,
  getProductWithById,
  createProducts,
  updateProducts,
  deleteProducts,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productServices");
const reviewsRoute = require('./reviewRoute');

const router = express.Router();
router.use('/:productId/reviews', reviewsRoute);
// clean route
router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProducts
  );
router
  .route("/:id")
  .get(getProductValidator, getProductWithById)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProducts
  )
  .delete(deleteProductValidator, deleteProducts);

module.exports = router;
