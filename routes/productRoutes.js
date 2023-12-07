const express = require("express");
const router = express.Router();

const {
  getAllProductsController,
  addProductsController,
  updateProductsController,
  findOneProductController,
  deleteProductController,
} = require("../controller/productController");

router.get("/all-products", getAllProductsController);
router.post("/create-product", addProductsController);
router.put("/update-product/:id", updateProductsController);
router.get("/get-product/:id", findOneProductController);
router.delete("/delete-product/:id", deleteProductController);

module.exports = router;
