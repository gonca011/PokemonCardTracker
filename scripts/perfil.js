document.addEventListener("DOMContentLoaded", () => {
    const utilizadorAutenticado = JSON.parse(
        localStorage.getItem("utilizador_autenticado")
    );

    if (!utilizadorAutenticado) {
        alert("Nenhum utilizador autenticado encontrado.");
        window.location.href = "login.html";
        return;
    }

    // Preenche os campos do perfil
    document.getElementById("profileName").value =
        utilizadorAutenticado.nome;

    document.getElementById("profileEmail").value =
        utilizadorAutenticado.login;
});

document.getElementById("saveProfile").addEventListener("click", () => {
    const banco = obterBanco();

    const utilizadorAutenticado = JSON.parse(
        localStorage.getItem("utilizador_autenticado")
    );

    const utilizador = banco.utilizadores.find(
        u => u.login === utilizadorAutenticado.login
    );

    if (!utilizador) {
        alert("Utilizador não encontrado.");
        return;
    }

    utilizador.nome = document.getElementById("profileName").value;
    utilizador.login = document.getElementById("profileEmail").value;

    localStorage.setItem("banco", JSON.stringify(banco));

    // Atualiza também a sessão atual
    localStorage.setItem(
        "utilizador_autenticado",
        JSON.stringify(utilizador)
    );

    alert("Perfil atualizado com sucesso!");
});

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("utilizador_autenticado");

    window.location.href = "login.html";
});