const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../database/sequelize");

const migrationsDirectory = __dirname;
const migrationsTable = "migrations";

async function ensureMigrationsTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${migrationsTable} (
      name TEXT PRIMARY KEY,
      executedAt TEXT NOT NULL
    )
  `);
}

async function getAppliedMigrations() {
  const [rows] = await sequelize.query(`SELECT name FROM ${migrationsTable}`);

  return new Set(rows.map((row) => row.name));
}

async function markMigrationAsApplied(name, transaction) {
  await sequelize.query(
    `INSERT INTO ${migrationsTable} (name, executedAt) VALUES (:name, :executedAt)`,
    {
      replacements: {
        name,
        executedAt: new Date().toISOString(),
      },
      transaction,
    }
  );
}

async function runMigrations() {
  await ensureMigrationsTable();

  const queryInterface = sequelize.getQueryInterface();
  const appliedMigrations = await getAppliedMigrations();
  const migrationFiles = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => /^\d+-.+\.js$/.test(file))
    .sort();

  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      continue;
    }

    const migration = require(path.join(migrationsDirectory, file));

    await sequelize.transaction(async (transaction) => {
      await migration.up(queryInterface, Sequelize, transaction);
      await markMigrationAsApplied(file, transaction);
    });
  }
}

module.exports = {
  runMigrations,
};
