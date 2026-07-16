const ApiError = require("../errors/ApiError");
const { User, CollectionCard, WishlistCard } = require("../models");
const {
  serializeCollectionCard,
  serializeUser,
  serializeWishlistCard,
} = require("./serializers");
const { optionalString, requiredString, trimString } = require("./validation");

async function findUserOrFail(id) {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(404, "Utilizador nao encontrado.");
  }

  return user;
}

async function serializeUserWithLists(user) {
  const [collection, wishlist] = await Promise.all([
    CollectionCard.findAll({
      where: { userId: user.id },
      order: [["data_registo", "DESC"], ["nome", "ASC"]],
    }),
    WishlistCard.findAll({
      where: { userId: user.id },
      order: [["data_adicao", "DESC"], ["nome", "ASC"]],
    }),
  ]);

  return serializeUser(user, collection, wishlist);
}

async function registerUser(payload) {
  const username = requiredString(payload, "username");
  const email = requiredString(payload, "email").toLowerCase();
  const password = requiredString(payload, "password");

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new ApiError(409, "Este email ja esta registado.");
  }

  const user = await User.create({
    username,
    email,
    password,
    role: optionalString(payload, "tipo", "utilizador"),
  });

  return serializeUser(user);
}

async function loginUser(payload) {
  const email = requiredString(payload, "email").toLowerCase();
  const password = requiredString(payload, "password");
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    throw new ApiError(401, "Email ou palavra-passe invalidos.");
  }

  return serializeUserWithLists(user);
}

async function loginGoogleUser(payload) {
  const email = requiredString(payload, "email").toLowerCase();
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, "Este email Google nao esta registado.");
  }

  return serializeUserWithLists(user);
}

async function getUser(id) {
  const user = await findUserOrFail(id);

  return serializeUserWithLists(user);
}

async function updateUser(id, payload) {
  const user = await findUserOrFail(id);
  const username = trimString(payload.username ?? payload.nome);
  const email = trimString(payload.email ?? payload.login);

  if (username) {
    user.username = username;
  }

  if (email && email.toLowerCase() !== user.email) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser && existingUser.id !== user.id) {
      throw new ApiError(409, "Este email ja esta registado.");
    }

    user.email = normalizedEmail;
  }

  await user.save();

  return serializeUserWithLists(user);
}

async function getUserStats(id) {
  await findUserOrFail(id);

  const [collection, wishlist] = await Promise.all([
    CollectionCard.findAll({ where: { userId: id } }),
    WishlistCard.findAll({ where: { userId: id } }),
  ]);

  const totalCartas = collection.reduce(
    (total, card) => total + Number(card.quantidade || 1),
    0
  );
  const cartasUnicas = collection.length;
  const valorTotalInvestido = collection.reduce(
    (total, card) => total + Number(card.preco_compra || 0) * Number(card.quantidade || 1),
    0
  );
  const precoMedioPorCarta = totalCartas > 0 ? valorTotalInvestido / totalCartas : 0;
  const expansoes = new Map();

  collection.forEach((card) => {
    const expansion = card.expansao || "Sem expansao";
    const currentTotal = expansoes.get(expansion) || 0;

    expansoes.set(expansion, currentTotal + Number(card.quantidade || 1));
  });

  const expansaoComMaisCartas = Array.from(expansoes.entries())
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .map(([expansao, quantidade]) => ({ expansao, quantidade }))[0] || null;

  return {
    totalCartas,
    cartasUnicas,
    valorTotalInvestido: Number(valorTotalInvestido.toFixed(2)),
    precoMedioPorCarta: Number(precoMedioPorCarta.toFixed(2)),
    cartasWishlist: wishlist.length,
    expansaoComMaisCartas,
    colecao: collection.map(serializeCollectionCard),
    listaDesejos: wishlist.map(serializeWishlistCard),
  };
}

module.exports = {
  findUserOrFail,
  getUser,
  getUserStats,
  loginGoogleUser,
  loginUser,
  registerUser,
  updateUser,
};
