function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  return Number(value);
}

function serializeCollectionCard(card) {
  const data = card.get ? card.get({ plain: true }) : card;

  return {
    cardId: data.cardId,
    nome: data.nome,
    expansao: data.expansao,
    imagem: data.imagem,
    data_registo: new Date(data.data_registo).toISOString(),
    preco_compra: toNumber(data.preco_compra),
    quantidade: Number(data.quantidade || 1),
    estado: data.estado || "",
    observacoes: data.observacoes || "",
  };
}

function serializeWishlistCard(card) {
  const data = card.get ? card.get({ plain: true }) : card;

  return {
    cardId: data.cardId,
    nome: data.nome,
    expansao: data.expansao,
    imagem: data.imagem,
    data_adicao: new Date(data.data_adicao).toISOString(),
    preco_alvo: toNumber(data.preco_alvo),
    prioridade: data.prioridade || "media",
  };
}

function serializeUser(user, collection = [], wishlist = []) {
  const data = user.get ? user.get({ plain: true }) : user;

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    tipo: data.role,
    colecao: collection.map(serializeCollectionCard),
    listaDesejos: wishlist.map(serializeWishlistCard),
  };
}

module.exports = {
  serializeCollectionCard,
  serializeWishlistCard,
  serializeUser,
};
