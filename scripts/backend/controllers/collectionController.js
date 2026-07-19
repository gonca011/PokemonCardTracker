const collectionService = require("../services/collectionService");
const CollectionCard = require("../models/CollectionCard");

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

async function getCollectionEvolution(req, res) {
    try {
        const userId = req.params.id;

        const cards = await CollectionCard.findAll({
            where: { userId },
            order: [["data_registo", "ASC"]]
        });

        res.json(cards);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
            stack: err.stack
        });
    }
}

async function history(req, res) {

    const history = await collectionService.getHistory(
        req.params.id,
        req.params.cardId
    );

    res.json(history);
}

module.exports = {
  create,
  list,
  remove,
  update,
  getCollectionEvolution,
  history
};
