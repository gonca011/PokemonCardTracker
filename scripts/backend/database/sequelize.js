const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

const dataDirectory = path.resolve(__dirname, "../../../data");
const storage = path.join(dataDirectory, "pokemon_card_tracker.sqlite");

fs.mkdirSync(dataDirectory, { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = {
  sequelize,
  storage,
};
