const User = require("./User");
const CollectionCard = require("./CollectionCard");
const WishlistCard = require("./WishlistCard");

User.hasMany(CollectionCard, {
  as: "colecao",
  foreignKey: "userId",
  onDelete: "CASCADE",
});

CollectionCard.belongsTo(User, {
  as: "utilizador",
  foreignKey: "userId",
});

User.hasMany(WishlistCard, {
  as: "listaDesejos",
  foreignKey: "userId",
  onDelete: "CASCADE",
});

WishlistCard.belongsTo(User, {
  as: "utilizador",
  foreignKey: "userId",
});

module.exports = {
  User,
  CollectionCard,
  WishlistCard,
};
