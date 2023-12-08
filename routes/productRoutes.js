const express = require("express");
const router = express.Router();

const {
  getAllProductsController,
  addProductsController,
  updateProductsController,
  findOneProductController,
  deleteProductController,
} = require("../controller/productController");
const cacheMiddleware = require("../middlewares/cachedMiddleware");

router.get("/all-products", cacheMiddleware, getAllProductsController);
router.post("/create-product", addProductsController);
router.put("/update-product/:id", updateProductsController);
router.get("/get-product/:id", cacheMiddleware, findOneProductController);
router.delete("/delete-product/:id", deleteProductController);

module.exports = router;
