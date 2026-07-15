console.log("SaveRegisto.js loaded");

function saveFormData() {
    console.log("Botão Registar clicado");
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const repeatPassword = document.getElementById("repeat-password").value.trim();

    if (password !== repeatPassword) {
        const passwordWarning = document.getElementById("password-warning");
        passwordWarning.classList.remove("d-none");
        passwordWarning.textContent = "As passwords não coincidem. Por favor, tente novamente.";
        return;
    }

    // Retrieve the existing database using obterBanco()
    const database = obterBanco();
    console.log("Existing database before registration:", database);

    // Check if the email is already registered
    const existingUser = database.utilizadores.find(utilizador => utilizador.login === email);
    if (existingUser) {
        showErrorPopup("Este email já está registado. Por favor, utilize outro.");
        return;
    }

    // Add the new user
    adicionarUtilizador(email, password, nome, "utilizador");

    console.log("Updated database after registration:", obterBanco());

    showPopup("Registo efetuado com sucesso!");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 3000);
}