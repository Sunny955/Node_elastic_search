const { Op } = require("sequelize");
const fs = require("fs");
const caCert = fs.readFileSync(process.env.CA_CERT_PATH);
const { Product } = require("../models/productModel");
const { Client } = require("@elastic/elasticsearch");
const { delAsync } = require("../config/redisConnect");

const productsAll = "/api/products/all-products";
const productOne = "/api/products/get-product/";

// Create an Elasticsearch client
const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: caCert,
    rejectUnauthorized: true,
  },
});

// Index name in Elasticsearch
const INDEX_NAME = "products";

const getAllProductsController = async (req, res) => {
  try {
    // const conditions = {};

    // Iterate over keys in req.query and build conditions
    /*
    const { Op } = require("sequelize");
    Post.findAll({
      where: {
        authorId: {
          [Op.eq]: 2
        }
      }
    });
    // SELECT * FROM post WHERE authorId = 2;
    */
    // Object.keys(req.query).forEach((key) => {
    //   if (key !== "sortBy" && key !== "order") {
    //     conditions[key] = { [Op.eq]: req.query[key] };
    //   }
    // });

    // const order = [];
    // if (req.query.sortBy && req.query.order) {
    //   order.push([req.query.sortBy, req.query.order.toUpperCase()]);
    // }

    // const products = await Product.findAll({
    //   where: conditions,
    //   order: order,
    // });

    // res
    //   .status(200)
    //   .json({ success: true, count: products.length, data: products });

    const conditions = [];

    // Iterate over keys in req.query and build conditions
    Object.keys(req.query).forEach((key) => {
      if (key !== "sortBy" && key !== "order") {
        conditions.push({
          match: {
            [key]: req.query[key],
          },
        });
      }
    });

    const body = {
      query: {
        bool: {
          must: conditions,
        },
      },
    };

    const order = [];
    if (req.query.sortBy && req.query.order) {
      order.push({
        [req.query.sortBy]: { order: req.query.order.toLowerCase() },
      });
    }

    const searchResults = await client.search({
      index: INDEX_NAME,
      body: body,
      sort: order,
    });

    const products = searchResults.hits.hits.map((hit) => hit._source);

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.log("Error occurred!", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addProductsController = async (req, res) => {
  try {
    const { name, price, color, specifications, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Name, price and quantity is required a field",
      });
    }

    const newProduct = await Product.create({
      name,
      price,
      color,
      specifications,
      quantity,
    });

    const response = await client.index({
      index: INDEX_NAME,
      id: newProduct.id,
      body: {
        name,
        price,
        color,
        specifications,
        quantity,
        image: newProduct.image,
      },
    });

    console.log("Elasticsearch response:", response);
    delAsync(productsAll);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Added new product successfully",
    });
  } catch (error) {
    console.log("Error occurred", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProductsController = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, price, color, specifications, quantity } = req.body;

    // check if product exists or not
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with given id didn't exists",
      });
    }

    // update the product and validate it
    const updatedProduct = await existingProduct.update({
      name,
      price,
      color,
      specifications,
      quantity,
    });

    const response = await client.update({
      index: INDEX_NAME,
      id: productId,
      body: {
        doc: {
          name,
          price,
          color,
          specifications,
          quantity,
        },
      },
    });

    console.log("Elastic search response", response);
    delAsync(productsAll);
    const productNew = productOne + productId;
    delAsync(productNew);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const uploadPicController = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const imageURLs = req.files.map((file) => file.location);

    // Fetch existing image URLs from the database
    const existingProduct = await Product.findByPk(productId);
    const existingImageURLs = existingProduct.image || "";

    const updatedImageURLs = existingImageURLs
      .split(",")
      .map((url) =>
        url.startsWith("https://www.google.com/")
          ? imageURLs.join(",") // Replace existing URL with new URLs
          : url + "," + imageURLs
      )
      .join(",");

    await Product.update(
      { image: updatedImageURLs },
      { where: { id: productId } }
    );

    const response = await client.update({
      index: INDEX_NAME,
      id: productId,
      body: {
        doc: {
          image: updatedImageURLs,
        },
      },
    });

    console.log("Elastic-search response", response);

    delAsync(productsAll);
    const productNew = productOne + productId;
    delAsync(productNew);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      urls: updatedImageURLs,
    });
  } catch (error) {
    next(error);
  }
};

const findOneProductController = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "No product exists for given id" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const findaProduct = await Product.findByPk(productId);

    if (!findaProduct) {
      return res
        .status(400)
        .json({ success: false, message: "No product exists for given id" });
    }
    const deleteProduct = await Product.destroy({
      where: { id: productId },
    });

    // Delete the product from the Elasticsearch index
    const response = await client.delete({
      index: INDEX_NAME,
      id: productId,
    });

    console.log("Elastic search response", response);
    delAsync(productsAll);
    const productNew = productOne + productId;
    delAsync(productNew);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductsController,
  addProductsController,
  updateProductsController,
  findOneProductController,
  deleteProductController,
  uploadPicController,
};
