const { UniqueConstraintError } = require("sequelize");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof UniqueConstraintError) {
    res.status(409).json({ error: "Registo duplicado." });
    return;
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Erro interno do servidor." : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
