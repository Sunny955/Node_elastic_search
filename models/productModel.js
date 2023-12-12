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
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fboschbrandstore.com%2Fproduct%2Fdetergent%2F&psig=AOvVaw1V5gIlb95wn2e4Rb4bXwdK&ust=1702299251961000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCNiTxYb1hIMDFQAAAAAdAAAAABAV",
    },
  },
  {
    timestamps: false,
  }
);

// Sync the model with the database
Product.sync();

module.exports = { Product };
