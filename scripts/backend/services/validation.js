const ApiError = require("../errors/ApiError");

function trimString(value) {
  return typeof value === "string" ? value.trim() : value;
}

function requiredString(payload, fieldName) {
  const value = trimString(payload[fieldName]);

  if (!value) {
    throw new ApiError(400, `Campo obrigatorio: ${fieldName}.`);
  }

  return value;
}

function optionalString(payload, fieldName, fallback = "") {
  const value = trimString(payload[fieldName]);

  return value || fallback;
}

function requiredNumber(payload, fieldName) {
  const value = Number(payload[fieldName]);

  if (!Number.isFinite(value) || value < 0) {
    throw new ApiError(400, `Campo numerico invalido: ${fieldName}.`);
  }

  return value;
}

function optionalPositiveInteger(payload, fieldName, fallback = 1) {
  const value = payload[fieldName];

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new ApiError(400, `Campo inteiro invalido: ${fieldName}.`);
  }

  return parsedValue;
}

module.exports = {
  optionalPositiveInteger,
  optionalString,
  requiredNumber,
  requiredString,
  trimString,
};
