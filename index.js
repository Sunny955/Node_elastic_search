const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const {
  handleSequelizeValidationError,
  handleUnexpectedError,
} = require("./config/errorHandler");
const productRoute = require("./routes/productRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoute);

app.use(handleSequelizeValidationError);
app.use(handleUnexpectedError);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running of port ${PORT}`);
});
