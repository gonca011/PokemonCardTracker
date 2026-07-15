function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const banco = obterBanco();
    const utilizador = banco.utilizadores.find(u => u.login === email);
    
    if (!utilizador) {
        showErrorPopup("Email não encontrado. Por favor, registe-se.");
        return;
    }

    if (utilizador.password !== password) {
        showErrorPopup("Palavra-passe incorreta. Por favor, tente novamente.");
        return;
    }

    // Save authenticated session
    localStorage.setItem("utilizador_autenticado", JSON.stringify(utilizador));

    showPopup("Login efetuado com sucesso!");

    setTimeout(() => {
        if (utilizador.tipo === "utilizador") {
            window.location.href = "mainpage.html";
        } else if (utilizador.tipo === "gestor") {
            window.location.href = "mainpage.html";
        } else {
            showErrorPopup("Tipo de utilizador desconhecido.");
        }
    }, 3000);
}

// Attach the login function to the form submission
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    initializeGoogleSignIn();
});

function initializeGoogleSignIn() {
    console.log("Initializing Google Sign-In...");
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
        console.error("Google API not loaded properly. Will retry in 1 second.");
        setTimeout(initializeGoogleSignIn, 1000);
        return;
    }
    
    try {
        google.accounts.id.initialize({
            client_id: "390778896354-sumgs1b2nccflfd2dldtbk3qbnbos8pj.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });
        
        const buttonContainer = document.getElementById("googleSignInDiv");
        if (buttonContainer) {
            google.accounts.id.renderButton(
                buttonContainer,
                { theme: "outline", size: "large", width: 400 }  // Custom styling
            );
            console.log("Google Sign-In button rendered successfully");
        } else {
            console.error("Google Sign-In container not found");
        }
    } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
    }
}

function handleCredentialResponse(response) {
    const decodedToken = parseJwt(response.credential);
    const email = decodedToken.email;

    if (!email) {
        showErrorPopup("Não foi possível obter o email da conta Google.");
        return;
    }

    const banco = obterBanco();
    const utilizador = banco.utilizadores.find(u => u.login === email);

    if (!utilizador) {
        showErrorPopup("Este email Google não está registado como utilizador. Faça o registo primeiro.");
        return;
    }

    // Save authenticated session
    localStorage.setItem("utilizador_autenticado", JSON.stringify(utilizador));

    showPopup("Login efetuado com sucesso!");

    setTimeout(() => {
        if (utilizador.tipo === "utilizador") {
            window.location.href = "mainpage.html";
        } else if (utilizador.tipo === "gestor") {
            window.location.href = "mainpage.html";
        } else {
            showErrorPopup("Tipo de utilizador desconhecido.");
        }
    }, 3000);
}

// Helper Functions
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

function obterBanco() {
    return JSON.parse(localStorage.getItem("banco")) || { utilizadores: [] };
}