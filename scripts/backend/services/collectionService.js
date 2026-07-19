const ApiError = require("../errors/ApiError");
const CollectionHistory = require("../models/CollectionHistory");
const { CollectionCard } = require("../models");
const { serializeCollectionCard } = require("./serializers");
const {
  optionalPositiveInteger,
  optionalString,
  requiredNumber,
  requiredString,
} = require("./validation");
const { findUserOrFail } = require("./userService");

function buildCreatePayload(payload, userId) {
  return {
    userId,
    cardId: requiredString(payload, "cardId"),
    nome: requiredString(payload, "nome"),
    expansao: requiredString(payload, "expansao"),
    imagem: requiredString(payload, "imagem"),
    data_registo: new Date(),
    preco_compra: requiredNumber(payload, "preco_compra"),
    quantidade: optionalPositiveInteger(payload, "quantidade", 1),
    estado: optionalString(payload, "estado", ""),
    observacoes: optionalString(payload, "observacoes", ""),
  };
}

function buildUpdatePayload(payload) {
  const updates = {};

  ["nome", "expansao", "imagem", "estado", "observacoes"].forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = optionalString(payload, field, "");
    }
  });

  if (payload.preco_compra !== undefined) {
    updates.preco_compra = requiredNumber(payload, "preco_compra");
  }

  if (payload.quantidade !== undefined) {
    updates.quantidade = optionalPositiveInteger(payload, "quantidade", 1);
  }

  return updates;
}

async function listCollection(userId) {
  await findUserOrFail(userId);

  const cards = await CollectionCard.findAll({
    where: { userId },
    order: [["data_registo", "DESC"], ["nome", "ASC"]],
  });

  return cards.map(serializeCollectionCard);
}

async function createCollectionCard(userId, payload) {
  await findUserOrFail(userId);

  const createPayload = buildCreatePayload(payload, userId);
  const existingCard = await CollectionCard.findOne({
    where: { userId, cardId: createPayload.cardId },
  });

  if (existingCard) {
    throw new ApiError(409, "Esta carta ja existe na coleção.");
  }

  const card = await CollectionCard.create(createPayload);

  return serializeCollectionCard(card);
}

async function updateCollectionCard(userId, cardId, payload) {
  await findUserOrFail(userId);

  const card = await CollectionCard.findOne({ where: { userId, cardId } });

  if (!card) {
    throw new ApiError(404, "Carta nao encontrada na coleção.");
  }

  const updates = buildUpdatePayload(payload);

  for (const campo of Object.keys(updates)) {

      if (String(card[campo]) !== String(updates[campo])) {

          await CollectionHistory.create({
              collectionCardId: card.id,
              campo,
              valorAntigo: card[campo],
              valorNovo: updates[campo]
          });
      }
  }

  await card.update(updates);

  return serializeCollectionCard(card);
}

async function deleteCollectionCard(userId, cardId) {
  await findUserOrFail(userId);

  const deletedCount = await CollectionCard.destroy({ where: { userId, cardId } });

  if (deletedCount === 0) {
    throw new ApiError(404, "Carta nao encontrada na coleção.");
  }
}

async function getPriceHistory(userId, cardId) {

    await findUserOrFail(userId);

    const card = await CollectionCard.findOne({
        where: { userId, cardId }
    });

    if (!card)
        throw new ApiError(404, "Carta não encontrada.");

    return CollectionHistory.findAll({
        where: {
            collectionCardId: card.id
        },
        order: [["dataAlteracao", "DESC"]]
    });
}

module.exports = {
  createCollectionCard,
  deleteCollectionCard,
  listCollection,
  updateCollectionCard,
  getPriceHistory
};
