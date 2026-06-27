document.addEventListener("DOMContentLoaded", function () {

    const categorii = document.querySelectorAll(".category");

    for (let i = 0; i < categorii.length; i++) {
        categorii[i].addEventListener("click", function () {
            const categorie = this.getAttribute("data-category");

            if (categorie) {
                window.location.href = "shop.html?category=" + encodeURIComponent(categorie);
            }
        });
    }

    const newsBtn = document.getElementById("newsletter-btn");

    if (newsBtn) {
        newsBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const emailInput = document.getElementById("newsletter-email");
            const email = emailInput.value.trim();

            if (email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
                showToast("Te-ai abonat cu succes!", "success");
                emailInput.value = "";
            } else {
                showToast("Te rog introdu un email valid!", "error");
            }
        });
    }

    const produseContainer = document.querySelector("section.products .products");

    if (produseContainer) {
        const toateProdusele = getProducts();

        const numarProduse = 4;

        if (toateProdusele && toateProdusele.length > 0) {
            produseContainer.innerHTML = "";

            for (let j = 0; j < numarProduse && j < toateProdusele.length; j++) {
                const card = createProductCard(toateProdusele[j]);

                if (card) {
                    produseContainer.appendChild(card);
                }
            }
        }
    }
});
