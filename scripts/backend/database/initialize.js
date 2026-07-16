const { sequelize } = require("./sequelize");
const { runMigrations } = require("../migrations/runMigrations");

require("../models");

async function initializeDatabase() {
  await sequelize.authenticate();
  await runMigrations();
}

module.exports = {
  initializeDatabase,
};
