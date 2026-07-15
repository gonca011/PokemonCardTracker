function showErrorPopup(message) {
    const popup = document.createElement("div");
    popup.className = "alert alert-danger popup fade-in";
    popup.textContent = message;
    popup.style.display = "block";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("fade-out");
    }, 3000);

    setTimeout(() => {
        popup.remove();
    }, 5000);
}