const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});
// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(BrandModel);

// @desc   Get list of brands sepecifices by ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrandsWithById = factory.getOne(BrandModel);

// @desc   Create category
// @route  POST /api/v1/brands
// @access Private
exports.createBrands = factory.createOne(BrandModel, "create brands success");

// @desc   Update list of brands sepecifices by ID
// @route  GET /api/v1/brands/:id
// @access Private
exports.updateBrands = factory.updateOne(BrandModel, "update brands success");

// @desc   Delete list of brands sepecifices by ID
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrands = factory.deleteOne(BrandModel, "delete brands success");
