function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "alert alert-success popup fade-in";
    popup.textContent = message;
    popup.style.display = "block";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("fade-out");
    }, 1000);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}