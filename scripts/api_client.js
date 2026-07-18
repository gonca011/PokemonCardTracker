const PokemonApi = (() => {
  const apiBaseUrl = "/api";
  const sessionKey = "pokemon_card_tracker_user";

  function normalizeUser(user) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username || user.nome || "",
      email: user.email || user.login || "",
      tipo: user.tipo || user.role || "utilizador",
    };
  }

  async function request(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.error || `Erro HTTP ${response.status}`);
    }

    return data;
  }

  function setAuthenticatedUser(user) {
    const normalizedUser = normalizeUser(user);

    sessionStorage.setItem(sessionKey, JSON.stringify(normalizedUser));

    return normalizedUser;
  }

  function getAuthenticatedUser() {
    const data = sessionStorage.getItem(sessionKey);

    if (!data) {
      return null;
    }

    try {
      return normalizeUser(JSON.parse(data));
    } catch (error) {
      sessionStorage.removeItem(sessionKey);
      return null;
    }
  }

  function clearAuthenticatedUser() {
    sessionStorage.removeItem(sessionKey);
  }

  function requireAuthenticatedUser() {
    const user = getAuthenticatedUser();

    if (!user?.id) {
      window.location.href = "/html/login.html";
      return null;
    }

    return user;
  }

  return {
    clearAuthenticatedUser,
    getAuthenticatedUser,
    requireAuthenticatedUser,
    setAuthenticatedUser,
    register: (payload) => request("/auth/register", { method: "POST", body: payload }),
    login: (payload) => request("/auth/login", { method: "POST", body: payload }),
    googleLogin: (email) => request("/auth/google", { method: "POST", body: { email } }),
    getUser: (userId) => request(`/users/${encodeURIComponent(userId)}`),
    updateUser: (userId, payload) =>
      request(`/users/${encodeURIComponent(userId)}`, { method: "PUT", body: payload }),
    getStats: (userId) => request(`/users/${encodeURIComponent(userId)}/stats`),
    getCollection: (userId) => request(`/users/${encodeURIComponent(userId)}/collection`),
    addCollectionCard: (userId, payload) =>
      request(`/users/${encodeURIComponent(userId)}/collection`, {
        method: "POST",
        body: payload,
      }),
    updateCollectionCard: (userId, cardId, payload) =>
      request(
        `/users/${encodeURIComponent(userId)}/collection/${encodeURIComponent(cardId)}`,
        { method: "PUT", body: payload }
      ),
    deleteCollectionCard: (userId, cardId) =>
      request(
        `/users/${encodeURIComponent(userId)}/collection/${encodeURIComponent(cardId)}`,
        { method: "DELETE" }
      ),
    getWishlist: (userId) => request(`/users/${encodeURIComponent(userId)}/wishlist`),
    addWishlistCard: (userId, payload) =>
      request(`/users/${encodeURIComponent(userId)}/wishlist`, {
        method: "POST",
        body: payload,
      }),
    updateWishlistCard: (userId, cardId, payload) =>
      request(
        `/users/${encodeURIComponent(userId)}/wishlist/${encodeURIComponent(cardId)}`,
        { method: "PUT", body: payload }
      ),
    deleteWishlistCard: (userId, cardId) =>
      request(
        `/users/${encodeURIComponent(userId)}/wishlist/${encodeURIComponent(cardId)}`,
        { method: "DELETE" }
      ),
  };
})();

window.PokemonApi = PokemonApi;
