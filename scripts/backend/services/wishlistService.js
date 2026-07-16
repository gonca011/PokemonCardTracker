const ApiError = require("../errors/ApiError");
const { WishlistCard } = require("../models");
const { serializeWishlistCard } = require("./serializers");
const { optionalString, requiredNumber, requiredString } = require("./validation");
const { findUserOrFail } = require("./userService");

function buildCreatePayload(payload, userId) {
  return {
    userId,
    cardId: requiredString(payload, "cardId"),
    nome: requiredString(payload, "nome"),
    expansao: requiredString(payload, "expansao"),
    imagem: requiredString(payload, "imagem"),
    data_adicao: new Date(),
    preco_alvo: requiredNumber(payload, "preco_alvo"),
    prioridade: optionalString(payload, "prioridade", "media"),
  };
}

function buildUpdatePayload(payload) {
  const updates = {};

  ["nome", "expansao", "imagem", "prioridade"].forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = optionalString(payload, field, field === "prioridade" ? "media" : "");
    }
  });

  if (payload.preco_alvo !== undefined) {
    updates.preco_alvo = requiredNumber(payload, "preco_alvo");
  }

  return updates;
}

async function listWishlist(userId) {
  await findUserOrFail(userId);

  const cards = await WishlistCard.findAll({
    where: { userId },
    order: [["data_adicao", "DESC"], ["nome", "ASC"]],
  });

  return cards.map(serializeWishlistCard);
}

async function createWishlistCard(userId, payload) {
  await findUserOrFail(userId);

  const createPayload = buildCreatePayload(payload, userId);
  const existingCard = await WishlistCard.findOne({
    where: { userId, cardId: createPayload.cardId },
  });

  if (existingCard) {
    throw new ApiError(409, "Esta carta ja existe na wishlist.");
  }

  const card = await WishlistCard.create(createPayload);

  return serializeWishlistCard(card);
}

async function updateWishlistCard(userId, cardId, payload) {
  await findUserOrFail(userId);

  const card = await WishlistCard.findOne({ where: { userId, cardId } });

  if (!card) {
    throw new ApiError(404, "Carta nao encontrada na wishlist.");
  }

  await card.update(buildUpdatePayload(payload));

  return serializeWishlistCard(card);
}

async function deleteWishlistCard(userId, cardId) {
  await findUserOrFail(userId);

  const deletedCount = await WishlistCard.destroy({ where: { userId, cardId } });

  if (deletedCount === 0) {
    throw new ApiError(404, "Carta nao encontrada na wishlist.");
  }
}

module.exports = {
  createWishlistCard,
  deleteWishlistCard,
  listWishlist,
  updateWishlistCard,
};
