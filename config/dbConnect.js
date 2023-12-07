const { Sequelize } = require("sequelize");
const winston = require("winston");

// Configure Winston logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

logger.info("Initializing database connection...");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: (query, options) => {
      if (options.type === "SHOWINDEXES") {
        logger.info("Connected to database!");
      } else if (
        options.type === "SELECT" ||
        options.type === "INSERT" ||
        options.type === "UPDATE" ||
        options.type === "DELETE"
      ) {
        logger.info(`${query}`);
      }
    },
  }
);

module.exports = { sequelize };
