document.addEventListener("DOMContentLoaded", function () {

    const cartItemsContainer = document.getElementById("checkout-cart-items");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const shippingEl = document.getElementById("checkout-shipping");
    const taxEl = document.getElementById("checkout-tax");
    const totalEl = document.getElementById("checkout-total");
    const placeOrderBtn = document.getElementById("checkout-place-order");

    function rendeazaCosCheckout() {
        if (!cartItemsContainer) return;

        const cos = getCart();
        cartItemsContainer.innerHTML = "";

        if (!cos || cos.length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.className = "checkout-empty";

            const emptyImg = document.createElement("img");
            emptyImg.setAttribute("src", "./Assets/Icons/cart.png");
            emptyImg.setAttribute("alt", "");
            emptyDiv.appendChild(emptyImg);

            const emptyP = document.createElement("p");
            emptyP.textContent = "Coșul tău este gol.";
            emptyDiv.appendChild(emptyP);

            const shopLink = document.createElement("a");
            shopLink.setAttribute("href", "./shop.html");
            shopLink.textContent = "Continuă cumpărăturile";
            emptyDiv.appendChild(shopLink);

            cartItemsContainer.appendChild(emptyDiv);

            actualizeazaTotaluri();
            return;
        }

        for (let i = 0; i < cos.length; i++) {
            const item = cos[i];
            const produs = getProductById(item.productId);

            if (!produs) continue;

            const fillDiv = document.createElement("div");
            fillDiv.className = "checkout-fill";

            const img = document.createElement("img");
            img.setAttribute("src", produs.image);
            img.setAttribute("alt", produs.name);
            fillDiv.appendChild(img);

            const wrapper = document.createElement("div");
            wrapper.className = "wrapper";

            const nameWrapper = document.createElement("div");
            nameWrapper.className = "name-wrapper";

            const nameP = document.createElement("p");
            nameP.className = "name";
            nameP.textContent = produs.name;
            nameWrapper.appendChild(nameP);

            const categoryP = document.createElement("p");
            categoryP.className = "category";
            categoryP.textContent = produs.category;
            nameWrapper.appendChild(categoryP);

            const priceWrapper = document.createElement("div");
            priceWrapper.className = "price-wrapper";

            const qtyP = document.createElement("p");
            qtyP.className = "quantity";
            qtyP.textContent = "Qty: " + item.quantity;
            priceWrapper.appendChild(qtyP);

            const priceP = document.createElement("p");
            priceP.className = "price";
            priceP.textContent = "$" + (produs.price * item.quantity).toFixed(2);
            priceWrapper.appendChild(priceP);

            nameWrapper.appendChild(priceWrapper);
            wrapper.appendChild(nameWrapper);

            const closeP = document.createElement("p");
            closeP.className = "close";
            closeP.textContent = "X";
            closeP.setAttribute("data-product-id", item.productId);
            wrapper.appendChild(closeP);

            fillDiv.appendChild(wrapper);
            cartItemsContainer.appendChild(fillDiv);
        }

        actualizeazaTotaluri();
    }

    function actualizeazaTotaluri() {
        const subtotal = getSubtotal();
        const tax = getTax();
        const shipping = getShipping();
        const total = getTotalPrice();

        if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(2);

        if (shippingEl) {
            if (shipping === 0) {
                shippingEl.textContent = "Free";
            } else {
                shippingEl.textContent = "$" + shipping.toFixed(2);
            }
        }

        if (taxEl) taxEl.textContent = "$" + tax.toFixed(2);
        if (totalEl) totalEl.textContent = "$" + total.toFixed(2);
    }

    document.addEventListener("click", function (e) {
        const closeBtn = e.target.closest(".close");
        if (!closeBtn) return;

        const productId = parseInt(closeBtn.getAttribute("data-product-id"), 10);
        if (productId) {
            removeFromCart(productId);
            rendeazaCosCheckout();
            updateCartBadge();
        }
    });

    function valideazaFormular() {
        const requiredFields = document.querySelectorAll("#checkout-form [data-required='true'], #payment-form [data-required='true']");

        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            const valoare = field.value.trim();

            if (valoare === "") {
                showToast("Toate câmpurile obligatorii trebuie completate!", "error");
                field.focus();
                return false;
            }

            const tip = field.getAttribute("data-type");

            if (tip === "email" && (valoare.indexOf("@") === -1 || valoare.indexOf(".") === -1)) {
                showToast("Adresa de email nu este validă!", "error");
                field.focus();
                return false;
            }

            if (tip === "zip" && (valoare.length < 4 || isNaN(parseInt(valoare, 10)))) {
                showToast("Codul poștal nu este valid!", "error");
                field.focus();
                return false;
            }

            if (tip === "card") {
                const numarCard = valoare.replace(/ /g, "");
                if (numarCard.length < 13 || numarCard.length > 19 || isNaN(parseInt(numarCard, 10))) {
                    showToast("Numărul cardului nu este valid!", "error");
                    field.focus();
                    return false;
                }
            }

            if (tip === "expiry") {
                if (valoare.length < 4 || valoare.indexOf("/") === -1) {
                    showToast("Data expirării nu este validă (folosește MM/YY)!", "error");
                    field.focus();
                    return false;
                }
            }

            if (tip === "cvc" && (valoare.length < 3 || isNaN(parseInt(valoare, 10)))) {
                showToast("Codul CVC nu este valid!", "error");
                field.focus();
                return false;
            }
        }

        return true;
    }

    const cardNumberInput = document.getElementById("checkout-card-number");
    const cardTypeIcon = document.getElementById("card-type-icon");

    if (cardNumberInput && cardTypeIcon) {
        cardNumberInput.addEventListener("input", function () {
            const numar = this.value.replace(/ /g, "");

            let formatat = "";
            for (let i = 0; i < numar.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatat += " ";
                }
                formatat += numar[i];
            }
            this.value = formatat;

            if (numar.indexOf("4") === 0) {
                cardTypeIcon.textContent = "Visa";
            } else if (numar.indexOf("51") === 0 || numar.indexOf("52") === 0 || numar.indexOf("53") === 0 || numar.indexOf("54") === 0 || numar.indexOf("55") === 0) {
                cardTypeIcon.textContent = "MC";
            } else if (numar.indexOf("34") === 0 || numar.indexOf("37") === 0) {
                cardTypeIcon.textContent = "AmEx";
            } else if (numar.indexOf("6011") === 0) {
                cardTypeIcon.textContent = "Disc";
            } else {
                cardTypeIcon.textContent = "???";
            }
        });
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const cos = getCart();
            if (!cos || cos.length === 0) {
                showToast("Coșul tău este gol! Adaugă produse înainte de a plasa comanda.", "error");
                return;
            }

            const loggedIn = localStorage.getItem("motrix_logged_in");
            if (loggedIn !== "true") {
                showToast("Trebuie să fii autentificat pentru a plasa o comandă!", "error");
                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);
                return;
            }

            if (!valideazaFormular()) {
                return;
            }

            const formData = {
                firstName: document.getElementById("checkout-first") ? document.getElementById("checkout-first").value.trim() : "",
                lastName: document.getElementById("checkout-last") ? document.getElementById("checkout-last").value.trim() : "",
                email: document.getElementById("checkout-email") ? document.getElementById("checkout-email").value.trim() : "",
                phone: document.getElementById("checkout-phone") ? document.getElementById("checkout-phone").value.trim() : "",
                address: document.getElementById("checkout-address") ? document.getElementById("checkout-address").value.trim() : "",
                city: document.getElementById("checkout-city") ? document.getElementById("checkout-city").value.trim() : "",
                state: document.getElementById("checkout-state") ? document.getElementById("checkout-state").value : "",
                zip: document.getElementById("checkout-zip") ? document.getElementById("checkout-zip").value.trim() : ""
            };

            const comanda = {
                id: "MTR-" + Date.now(),
                data: new Date().toISOString(),
                produse: cos,
                subtotal: getSubtotal(),
                tax: getTax(),
                shipping: getShipping(),
                total: getTotalPrice(),
                livrare: formData,
                status: "confirmată"
            };

            const comenziExistente = localStorage.getItem("motrix_orders");
            const comenzi = comenziExistente ? JSON.parse(comenziExistente) : [];
            comenzi.push(comanda);
            localStorage.setItem("motrix_orders", JSON.stringify(comenzi));

            saveCart([]);
            updateCartBadge();

            showToast("Comanda a fost plasată cu succes! ID: " + comanda.id, "success");

            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);
        });
    }

    const expiryInput = document.getElementById("checkout-expiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", function () {
            const val = this.value.replace(/[^0-9]/g, "");
            if (val.length >= 2) {
                this.value = val.substring(0, 2) + "/" + val.substring(2, 4);
            }
        });
    }

    rendeazaCosCheckout();

});
