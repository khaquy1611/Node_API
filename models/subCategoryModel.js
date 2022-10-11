const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "Subcategory should be unique"],
      minlength: [2, "To short SubCategory name"],
      maxlength: [32, "To long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

// Mongo middleWares
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});
module.exports = mongoose.model("SubCategory", subCategorySchema);
