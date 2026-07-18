require("dotenv").config();

const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

module.exports = {
  sequelize,
};

