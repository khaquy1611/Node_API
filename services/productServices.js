const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

// @desc   Get list of products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(ProductModel);

// @desc   Get list of products sepecifices by ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProductWithById = factory.getOne(ProductModel);
// @desc   Create products
// @route  POST /api/v1/products
// @access Private
exports.createProducts = factory.createOne(
  ProductModel,
  "Create product success"
);

// @desc   Update list of products sepecifices by ID
// @route  GET /api/v1/products/:id
// @access Private
exports.updateProducts = factory.updateOne(
  ProductModel,
  "Update product success"
);

// @desc   Delete list of products sepecifices by ID
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProducts = factory.deleteOne(
  ProductModel,
  "Delete product success"
);
