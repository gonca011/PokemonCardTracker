const { sequelize } = require("./database/sequelize");
const { runMigrations } = require("./migrations/runMigrations");

runMigrations()
  .then(async () => {
    console.log("Migrations executed successfully.");
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error("Migration failed:", error);
    await sequelize.close();
    process.exit(1);
  });
