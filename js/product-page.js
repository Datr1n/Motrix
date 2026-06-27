document.addEventListener("DOMContentLoaded", function () {


    const urlParams = new URLSearchParams(window.location.search);
    const produsId = parseInt(urlParams.get("id"), 10);

    if (!produsId) {
        showToast("Produsul nu a fost găsit!", "error");
        return;
    }

    const produs = getProductById(produsId);
    if (!produs) {
        showToast("Produsul nu a fost găsit!", "error");
        return;
    }

    const titleEl = document.getElementById("pd-title");
    if (titleEl) titleEl.textContent = produs.name;

    const subtitleEl = document.getElementById("pd-subtitle");
    if (subtitleEl) subtitleEl.textContent = produs.shortDescription;

    const priceEl = document.getElementById("pd-price");
    if (priceEl) priceEl.textContent = "$" + produs.price.toFixed(2);

    const oldPriceEl = document.getElementById("pd-old-price");
    if (oldPriceEl) {
        if (produs.oldPrice) {
            oldPriceEl.textContent = "$" + produs.oldPrice.toFixed(2);
            oldPriceEl.style.display = "";
        } else {
            oldPriceEl.style.display = "none";
        }
    }

    const discountEl = document.getElementById("pd-discount");
    if (discountEl) {
        if (produs.discount) {
            discountEl.textContent = "-" + produs.discount + "%";
            discountEl.style.display = "";
        } else {
            discountEl.style.display = "none";
        }
    }

    const descEl = document.getElementById("pd-desc");
    if (descEl) descEl.textContent = produs.fullDescription;

    const skuEl = document.getElementById("pd-sku");
    if (skuEl) skuEl.textContent = produs.sku;

    const catEl = document.getElementById("pd-category");
    if (catEl) {
        catEl.textContent = produs.category;
        catEl.setAttribute("href", "./shop.html?category=" + encodeURIComponent(produs.category));
    }

    const badgesContainer = document.getElementById("pd-badges");
    if (badgesContainer) {
        badgesContainer.innerHTML = "";

        if (produs.isSale) {
            const badgeSale = document.createElement("span");
            badgeSale.className = "badge badge-sale";
            badgeSale.textContent = "Sale";
            badgesContainer.appendChild(badgeSale);
        }

        if (produs.isNew) {
            const badgeNew = document.createElement("span");
            badgeNew.className = "badge badge-new";
            badgeNew.textContent = "New";
            badgesContainer.appendChild(badgeNew);
        }

        if (produs.isHot) {
            const badgeHot = document.createElement("span");
            badgeHot.className = "badge badge-hot";
            badgeHot.textContent = "Hot";
            badgesContainer.appendChild(badgeHot);
        }
    }

    const stockDot = document.getElementById("pd-stock-dot");
    const stockText = document.getElementById("pd-stock-text");

    if (stockDot && stockText) {
        if (produs.stock === 0) {
            stockDot.className = "dot out-of-stock";
            stockText.className = "out-of-stock-text";
            stockText.textContent = "Stoc epuizat";
        } else if (produs.stock <= 15) {
            stockDot.className = "dot low-stock";
            stockText.className = "low-stock-text";
            stockText.textContent = "Stoc limitat — Mai sunt doar " + produs.stock + " buc.";
        } else {
            stockDot.className = "dot in-stock";
            stockText.className = "in-stock-text";
            stockText.textContent = "În stoc — Expediere în 24h";
        }
    }

    const starsContainer = document.getElementById("pd-stars");
    if (starsContainer) {
        const stele = starsContainer.querySelectorAll("svg");
        const ratingRotunjit = Math.round(produs.rating);

        for (let i = 0; i < stele.length; i++) {
            if (i < ratingRotunjit) {
                stele[i].classList.remove("empty");
            } else {
                stele[i].classList.add("empty");
            }
        }
    }

    const ratingTextEl = document.getElementById("pd-rating-text");
    if (ratingTextEl) {
        ratingTextEl.textContent = produs.rating + " (" + produs.reviews + " recenzii)";
    }

    const mainImg = document.getElementById("gallery-main-img");
    const thumbs = document.querySelectorAll(".gallery-thumb");

    if (mainImg && produs.image) {
        mainImg.setAttribute("src", produs.image);
    }

    if (produs.gallery && produs.gallery.length > 0) {
        const thumbContainer = document.querySelector(".gallery-thumbs");
        if (thumbContainer) {
            thumbContainer.innerHTML = "";

            for (let i = 0; i < produs.gallery.length; i++) {
                const thumb = document.createElement("img");
                thumb.className = "gallery-thumb";
                if (i === 0) thumb.classList.add("active");
                thumb.setAttribute("src", produs.gallery[i]);
                thumb.setAttribute("data-src", produs.gallery[i]);
                thumb.setAttribute("alt", "Vedere " + (i + 1));

                thumbContainer.appendChild(thumb);

                (function (imgSrc) {
                    thumb.addEventListener("click", function () {
                        if (mainImg) {
                            mainImg.setAttribute("src", imgSrc);
                        }

                        const toateThumbs = thumbContainer.querySelectorAll(".gallery-thumb");
                        for (let j = 0; j < toateThumbs.length; j++) {
                            toateThumbs[j].classList.remove("active");
                        }
                        this.classList.add("active");
                    });
                })(produs.gallery[i]);
            }
        }
    }

    const specsBody = document.getElementById("pd-specs-body");
    if (specsBody && produs.specifications) {
        specsBody.innerHTML = "";

        const chei = Object.keys(produs.specifications);
        for (let i = 0; i < chei.length; i++) {
            const tr = document.createElement("tr");
            const tdLabel = document.createElement("td");
            tdLabel.textContent = chei[i];
            const tdValue = document.createElement("td");
            tdValue.textContent = produs.specifications[chei[i]];
            tr.appendChild(tdLabel);
            tr.appendChild(tdValue);
            specsBody.appendChild(tr);
        }
    }

    const qtyInput = document.getElementById("pd-qty");

    document.addEventListener("click", function (e) {
        const minusBtn = e.target.closest(".qty-minus");
        if (minusBtn && qtyInput) {
            const val = parseInt(qtyInput.value, 10) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        }
    });

    document.addEventListener("click", function (e) {
        const plusBtn = e.target.closest(".qty-plus");
        if (plusBtn && qtyInput) {
            const val = parseInt(qtyInput.value, 10) || 1;
            if (val < 99) {
                qtyInput.value = val + 1;
            }
        }
    });

    const addCartBtn = document.getElementById("pd-add-cart");
    if (addCartBtn) {
        addCartBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (produs.stock === 0) {
                showToast("Acest produs este momentan indisponibil!", "error", produs.name);
                return;
            }

            const cantitate = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
            addToCart(produs.id, cantitate);
            showToast("Produsul a fost adăugat în coș!", "success", produs.name);
        });
    }

    const relatedGrid = document.getElementById("pd-related-grid");
    if (relatedGrid) {
        const produseSimilare = getRelatedProducts(produs.id, 4);

        relatedGrid.innerHTML = "";

        if (produseSimilare && produseSimilare.length > 0) {
            for (let i = 0; i < produseSimilare.length; i++) {
                const card = createProductCard(produseSimilare[i]);
                if (card) {
                    relatedGrid.appendChild(card);
                }
            }
        }
    }

});
