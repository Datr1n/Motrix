document.addEventListener("DOMContentLoaded", function () {

    updateCartBadge();

    verificaUtilizator();

    mobileMenuInit();

    document.addEventListener("click", function (e) {
        const target = e.target;

        const addCartBtn = target.closest(".action-add-cart");
        if (addCartBtn) {
            e.preventDefault();
            handleAddToCart(addCartBtn);
            return;
        }

        const addToCartBtn = target.closest(".add-to-cart-btn");
        if (addToCartBtn) {
            e.preventDefault();
            handleAddToCart(addToCartBtn);
            return;
        }

        const quickViewBtn = target.closest(".action-quick-view");
        if (quickViewBtn) {
            e.preventDefault();
            handleQuickView(quickViewBtn);
            return;
        }

        const compareBtn = target.closest(".action-compare");
        if (compareBtn) {
            e.preventDefault();
            handleCompare();
            return;
        }
    });
});

function getProductIdFromButton(buton) {
    const card = buton.closest(".product-card");

    if (card) {
        const id = parseInt(card.getAttribute("data-id"), 10);
        return id;
    }

    return null;
}

function handleAddToCart(buton) {
    const productId = getProductIdFromButton(buton);

    if (!productId) {
        return;
    }

    const produs = getProductById(productId);
    if (!produs) {
        return;
    }

    if (produs.stock === 0) {
        showToast("Acest produs este momentan indisponibil!", "error", produs.name);
        return;
    }

    addToCart(productId, 1);

    showToast("Produsul a fost adăugat în coș!", "success", produs.name);
}

function handleQuickView(buton) {
    const productId = getProductIdFromButton(buton);

    if (!productId) {
        return;
    }

    window.location.href = "product.html?id=" + productId;
}

function handleCompare() {
    showToast("Funcția va fi disponibilă în curând!", "info");
}

function verificaUtilizator() {
    const loggedIn = localStorage.getItem("motrix_logged_in");
    const userData = localStorage.getItem("motrix_user");

    if (loggedIn === "true" && userData) {
        const user = JSON.parse(userData);

        const iconWrappers = document.querySelectorAll(".icon-wrapper a[href='./login.html'], .icon-wrapper a[href='login.html']");

        for (let i = 0; i < iconWrappers.length; i++) {
            iconWrappers[i].setAttribute("href", "#");
            iconWrappers[i].setAttribute("title", "Bun venit, " + user.name + "!");
        }

        creeazaModalUtilizator(user);
    }
}

function creeazaModalUtilizator(user) {
    if (document.querySelector(".user-modal-overlay")) {
        return;
    }

    const initiala = user.name ? user.name.charAt(0).toUpperCase() : "U";

    const overlay = document.createElement("div");
    overlay.className = "user-modal-overlay";

    overlay.innerHTML =
        '<div class="user-modal">' +
            '<div class="user-modal-header">' +
                '<h3>Contul Meu</h3>' +
                '<button class="user-modal-close">&times;</button>' +
            '</div>' +
            '<div class="user-modal-body">' +
                '<div class="user-modal-avatar">' + initiala + '</div>' +
                '<p class="user-modal-name">' + user.name + '</p>' +
                '<p class="user-modal-email">' + user.email + '</p>' +
            '</div>' +
            '<div class="user-modal-footer">' +
                '<button class="user-modal-logout">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none">' +
                        '<path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '<path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '<path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>' +
                    'Deconectare' +
                '</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    const modal = overlay.querySelector(".user-modal");
    const closeBtn = overlay.querySelector(".user-modal-close");
    const logoutBtn = overlay.querySelector(".user-modal-logout");

    document.addEventListener("click", function (e) {
        const userIcon = e.target.closest(".icon-wrapper a[href='#']");

        if (userIcon) {
            e.preventDefault();
            overlay.classList.add("open");
        }
    });

    closeBtn.addEventListener("click", function () {
        overlay.classList.remove("open");
    });

    overlay.addEventListener("click", function (e) {
        if (!e.target.closest(".user-modal")) {
            overlay.classList.remove("open");
        }
    });

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("motrix_logged_in");
        overlay.classList.remove("open");

        showToast("Te-ai deconectat cu succes!", "info");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    });
}

/* ============================================
   MOBILE MENU INIT
   ============================================ */
function mobileMenuInit() {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (!navbar || !hamburger || !menu) {
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    navbar.appendChild(overlay);

    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        menu.classList.toggle("open");
        overlay.classList.toggle("open");
        document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
    });

    overlay.addEventListener("click", function () {
        hamburger.classList.remove("active");
        menu.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            hamburger.classList.remove("active");
            menu.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = "";
        });
    });
}
