const collectionService = require("../services/collectionService");

async function list(req, res) {
  const collection = await collectionService.listCollection(req.params.id);

  res.json(collection);
}

async function create(req, res) {
  const card = await collectionService.createCollectionCard(req.params.id, req.body);

  res.status(201).json(card);
}

async function update(req, res) {
  const card = await collectionService.updateCollectionCard(
    req.params.id,
    req.params.cardId,
    req.body
  );

  res.json(card);
}

async function remove(req, res) {
  await collectionService.deleteCollectionCard(req.params.id, req.params.cardId);

  res.status(204).send();
}

module.exports = {
  create,
  list,
  remove,
  update,
};
