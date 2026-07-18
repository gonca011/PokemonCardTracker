const profileCurrencyFormatter = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
});

function setProfileField(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value || "";
    }
}

function setProfileText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function fillProfile(user) {
    setProfileField("profileName", user.username);
    setProfileField("profileEmail", user.email);
}

async function loadProfileStats() {
    const user = PokemonApi.getAuthenticatedUser();

    if (!user?.id) {
        return;
    }

    try {
        const stats = await PokemonApi.getStats(user.id);
        const topExpansion = stats.expansaoComMaisCartas
            ? `${stats.expansaoComMaisCartas.expansao} (${stats.expansaoComMaisCartas.quantidade})`
            : "Sem cartas";

        setProfileText("statTotalCards", stats.totalCartas);
        setProfileText("statUniqueCards", stats.cartasUnicas);
        setProfileText("statTotalInvested", profileCurrencyFormatter.format(stats.valorTotalInvestido));
        setProfileText("statAveragePrice", profileCurrencyFormatter.format(stats.precoMedioPorCarta));
        setProfileText("statWishlistCards", stats.cartasWishlist);
        setProfileText("statTopExpansion", topExpansion);
    } catch (error) {
        console.error("Erro ao carregar estatisticas:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const utilizadorAutenticado = PokemonApi.requireAuthenticatedUser();

    if (!utilizadorAutenticado) {
        return;
    }

    fillProfile(utilizadorAutenticado);

    try {
        const utilizador = await PokemonApi.getUser(utilizadorAutenticado.id);
        const normalizedUser = PokemonApi.setAuthenticatedUser(utilizador);

        fillProfile(normalizedUser);
    } catch (error) {
        alert(error.message || "Utilizador nao encontrado.");
        PokemonApi.clearAuthenticatedUser();
        window.location.href = "/html/login.html";
        return;
    }

    loadProfileStats();

    const saveProfileButton = document.getElementById("saveProfile");
    const logoutButton = document.getElementById("logoutButton");

    if (saveProfileButton) {
        saveProfileButton.addEventListener("click", async () => {
            const currentUser = PokemonApi.requireAuthenticatedUser();

            if (!currentUser) {
                return;
            }

            try {
                const updatedUser = await PokemonApi.updateUser(currentUser.id, {
                    username: document.getElementById("profileName").value.trim(),
                    email: document.getElementById("profileEmail").value.trim(),
                });

                const normalizedUser = PokemonApi.setAuthenticatedUser(updatedUser);
                fillProfile(normalizedUser);
                alert("Perfil atualizado com sucesso!");
            } catch (error) {
                alert(error.message || "Nao foi possivel atualizar o perfil.");
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            PokemonApi.clearAuthenticatedUser();
            window.location.href = "/html/login.html";
        });
    }
});

document.addEventListener("pokemon:user-data-updated", loadProfileStats);
