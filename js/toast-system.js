function showToast(mesaj, tip, titlu) {
    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    const icon = toast.querySelector(".toast-icon");
    const title = toast.querySelector(".toast-title");
    const message = toast.querySelector(".toast-message");

    message.textContent = mesaj;

    if (tip === "success") {
        toast.classList.add("toast-success");
        toast.classList.remove("toast-error");
        icon.textContent = "✓";
        title.textContent = titlu || "Succes";
    } else if (tip === "error") {
        toast.classList.remove("toast-success");
        toast.classList.add("toast-error");
        icon.textContent = "✕";
        title.textContent = titlu || "Eroare";
    } else if (tip === "info") {
        toast.classList.remove("toast-success");
        toast.classList.remove("toast-error");
        icon.textContent = "ℹ";
        title.textContent = titlu || "Info";
    }

    toast.classList.remove("hidden");

    setTimeout(function () {
        toast.classList.add("hidden");
    }, 3000);
}
