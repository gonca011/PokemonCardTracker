async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const utilizador = await PokemonApi.login({ email, password });

        PokemonApi.setAuthenticatedUser(utilizador);
        showPopup("Login efetuado com sucesso!");

        setTimeout(() => {
            window.location.href = "mainpage.html";
        }, 1000);
    } catch (error) {
        showErrorPopup(error.message || "Nao foi possivel efetuar login.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }

    initializeGoogleSignIn();
});

function initializeGoogleSignIn() {
    console.log("Initializing Google Sign-In...");

    if (typeof google === "undefined" || !google.accounts || !google.accounts.id) {
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
                { theme: "outline", size: "large", width: 400 }
            );
            console.log("Google Sign-In button rendered successfully");
        } else {
            console.error("Google Sign-In container not found");
        }
    } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
    }
}

async function handleCredentialResponse(response) {
    const decodedToken = parseJwt(response.credential);
    const email = decodedToken?.email;

    if (!email) {
        showErrorPopup("Nao foi possivel obter o email da conta Google.");
        return;
    }

    try {
        const utilizador = await PokemonApi.googleLogin(email);

        PokemonApi.setAuthenticatedUser(utilizador);
        showPopup("Login efetuado com sucesso!");

        setTimeout(() => {
            window.location.href = "mainpage.html";
        }, 1000);
    } catch (error) {
        showErrorPopup(error.message || "Este email Google nao esta registado.");
    }
}

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        return null;
    }
}
