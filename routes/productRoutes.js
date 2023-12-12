const express = require("express");
const router = express.Router();

const {
  getAllProductsController,
  addProductsController,
  updateProductsController,
  findOneProductController,
  deleteProductController,
  uploadPicController,
} = require("../controller/productController");
const upload = require("../utils/s3Uploader");
const cacheMiddleware = require("../middlewares/cachedMiddleware");

router.get("/all-products", cacheMiddleware, getAllProductsController);
router.post("/create-product", addProductsController);
router.put("/update-product/:id", updateProductsController);
router.put("/upload-pic/:id", upload.array("image", 5), uploadPicController);
router.get("/get-product/:id", cacheMiddleware, findOneProductController);
router.delete("/delete-product/:id", deleteProductController);

module.exports = router;
