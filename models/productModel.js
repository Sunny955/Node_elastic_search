const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: true,
        isFloat: true,
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        isInt: true,
      },
    },
  },
  {
    timestamps: false,
  }
);

// Sync the model with the database
Product.sync();

module.exports = { Product };
