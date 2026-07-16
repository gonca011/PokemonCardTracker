const wishlistService = require("../services/wishlistService");

async function list(req, res) {
  const wishlist = await wishlistService.listWishlist(req.params.id);

  res.json(wishlist);
}

async function create(req, res) {
  const card = await wishlistService.createWishlistCard(req.params.id, req.body);

  res.status(201).json(card);
}

async function update(req, res) {
  const card = await wishlistService.updateWishlistCard(
    req.params.id,
    req.params.cardId,
    req.body
  );

  res.json(card);
}

async function remove(req, res) {
  await wishlistService.deleteWishlistCard(req.params.id, req.params.cardId);

  res.status(204).send();
}

module.exports = {
  create,
  list,
  remove,
  update,
};
