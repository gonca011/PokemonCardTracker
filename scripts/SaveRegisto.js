console.log("SaveRegisto.js loaded");

async function saveFormData() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const repeatPassword = document.getElementById("repeat-password").value.trim();

    if (password !== repeatPassword) {
        const passwordWarning = document.getElementById("password-warning");

        passwordWarning.classList.remove("d-none");
        passwordWarning.textContent = "As passwords nao coincidem. Por favor, tente novamente.";
        return;
    }

    try {
        await PokemonApi.register({
            username: nome,
            email,
            password,
            tipo: "utilizador",
        });

        showPopup("Registo efetuado com sucesso!");

        setTimeout(() => {
            window.location.href = "/html/login.html";
        }, 1000);
    } catch (error) {
        showErrorPopup(error.message || "Nao foi possivel efetuar o registo.");
    }
}
