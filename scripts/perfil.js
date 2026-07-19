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

    await loadProfileStats();
    await renderCollectionEvolutionChart();

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

async function loadCollectionEvolution(userId) {
    return PokemonApi.getCollectionEvolution(userId);
}

async function renderCollectionEvolutionChart() {
    const user = PokemonApi.getAuthenticatedUser();

    if (!user?.id) return;

    try {
        const cards = await loadCollectionEvolution(user.id);

        cards.sort((a, b) =>
            new Date(a.data_registo) - new Date(b.data_registo)
        );

        const labels = [];
        const values = [];

        let total = 0;

        for (const card of cards) {
            total += Number(card.preco_compra) * Number(card.quantidade);

            labels.push(
                new Date(card.data_registo).toLocaleDateString("pt-PT")
            );

            values.push(total);
        }

        const canvas = document.getElementById("collectionEvolutionChart");

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (window.collectionChart) {
            window.collectionChart.destroy();
        }

        window.collectionChart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Valor investido (€)",
                    data: values,
                    borderColor: "#0d6efd",
                    backgroundColor: "rgba(13,110,253,0.15)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });

    } catch (err) {
        console.error("Erro ao carregar evolução:", err);
    }
}


document.addEventListener("pokemon:user-data-updated", loadProfileStats);
