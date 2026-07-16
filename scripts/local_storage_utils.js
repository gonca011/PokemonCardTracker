// Legacy helpers kept only to avoid breaking older pages during development.
// The application now stores user data through the REST API in api_client.js.
async function inicializarBanco() {
  return { utilizadores: [] };
}

async function obterBanco() {
  return { utilizadores: [] };
}

async function salvarBanco() {
  throw new Error("salvarBanco foi substituido pela API REST.");
}

async function adicionarUtilizador(login, password, nome, tipo = "utilizador") {
  return PokemonApi.register({
    email: login,
    password,
    username: nome,
    tipo,
  });
}

async function listarUtilizadores() {
  console.warn("listarUtilizadores foi substituido pela API REST.");
}

async function recuperarUtilizador(id) {
  return PokemonApi.getUser(id);
}

async function deletarUtilizador() {
  throw new Error("A remocao de utilizadores ainda nao esta exposta na API.");
}
