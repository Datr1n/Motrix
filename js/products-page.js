document.addEventListener("DOMContentLoaded", function () {

    const produsePerPagina = 12;
    let paginaCurenta = 1;

    const container = document.querySelector(".products-grid");
    const resultsText = document.getElementById("results-count");
    const sortSelect = document.querySelector(".sort-select");
    const clearBtn = document.getElementById("clear-filters");
    const applyBtn = document.getElementById("apply-filters");
    const priceRange = document.getElementById("price-range");
    const priceMinLabel = document.getElementById("price-min");
    const priceMaxLabel = document.getElementById("price-max");
    const categoryList = document.querySelector(".category-list");
    const paginationContainer = document.querySelector(".pagination");

    const toateProdusele = getProducts() || [];

    let filtruCategorie = "Toate";
    let filtruPretMax = priceRange ? parseInt(priceRange.value, 10) : 15000;
    let branduriActive = [];
    let disponibilitateActive = [];
    let sortareCurenta = "popularitate";

    const branduriVizibileInitial = 6;
    let arataToateBrandurile = false;

    const urlParams = new URLSearchParams(window.location.search);
    const categorieUrl = urlParams.get("category");
    if (categorieUrl) {
        filtruCategorie = categorieUrl;
    }

    function rendeazaProduse() {
        if (!container) return;

        let produseFiltrate = [];

        if (filtruCategorie === "Toate") {
            for (let i = 0; i < toateProdusele.length; i++) {
                produseFiltrate.push(toateProdusele[i]);
            }
        } else {
            for (let i = 0; i < toateProdusele.length; i++) {
                if (toateProdusele[i].category === filtruCategorie) {
                    produseFiltrate.push(toateProdusele[i]);
                }
            }
        }

        if (filtruPretMax > 0) {
            const produseDupaPret = [];
            for (let i = 0; i < produseFiltrate.length; i++) {
                if (produseFiltrate[i].price <= filtruPretMax) {
                    produseDupaPret.push(produseFiltrate[i]);
                }
            }
            produseFiltrate = produseDupaPret;
        }

        if (branduriActive.length > 0) {
            const produseDupaBrand = [];
            for (let i = 0; i < produseFiltrate.length; i++) {
                for (let j = 0; j < branduriActive.length; j++) {
                    if (produseFiltrate[i].brand === branduriActive[j]) {
                        produseDupaBrand.push(produseFiltrate[i]);
                        break;
                    }
                }
            }
            produseFiltrate = produseDupaBrand;
        }

        if (disponibilitateActive.length > 0) {
            const produseDupaDisponibilitate = [];
            for (let i = 0; i < produseFiltrate.length; i++) {
                for (let j = 0; j < disponibilitateActive.length; j++) {
                    if (disponibilitateActive[j] === "in-stock" && produseFiltrate[i].stock > 0) {
                        produseDupaDisponibilitate.push(produseFiltrate[i]);
                        break;
                    } else if (disponibilitateActive[j] === "out-of-stock" && produseFiltrate[i].stock === 0) {
                        produseDupaDisponibilitate.push(produseFiltrate[i]);
                        break;
                    }
                }
            }
            produseFiltrate = produseDupaDisponibilitate;
        }

        produseFiltrate = sorteazaProduse(produseFiltrate, sortareCurenta);

        const totalProduse = produseFiltrate.length;
        const totalPagini = Math.max(1, Math.ceil(totalProduse / produsePerPagina));

        if (paginaCurenta > totalPagini) {
            paginaCurenta = totalPagini;
        }

        let startIndex = (paginaCurenta - 1) * produsePerPagina;
        if (startIndex < 0) startIndex = 0;

        const produsePagina = [];
        for (let i = startIndex; i < startIndex + produsePerPagina && i < totalProduse; i++) {
            produsePagina.push(produseFiltrate[i]);
        }

        container.innerHTML = "";

        if (produsePagina.length === 0) {
            const noResults = document.createElement("p");
            noResults.className = "no-results no-results-msg";
            noResults.textContent = "Nu au fost găsite produse.";
            container.appendChild(noResults);
        } else {
            for (let i = 0; i < produsePagina.length; i++) {
                const card = createProductCard(produsePagina[i]);
                if (card) {
                    container.appendChild(card);
                }
            }
        }

        if (resultsText) {
            if (totalProduse === 0) {
                resultsText.textContent = "0 rezultate";
            } else {
                const sfarsit = startIndex + produsePagina.length;
                resultsText.textContent = "Se afișează " + (startIndex + 1) + "-" + sfarsit + " din " + totalProduse + " rezultate";
            }
        }

        rendeazaPaginare(totalPagini);
    }

    function sorteazaProduse(produse, criteriu) {
        const sorted = [];
        for (let i = 0; i < produse.length; i++) {
            sorted.push(produse[i]);
        }

        if (criteriu === "popularitate") {
            for (let i = 0; i < sorted.length - 1; i++) {
                for (let j = i + 1; j < sorted.length; j++) {
                    if (sorted[j].popularity > sorted[i].popularity) {
                        const temp = sorted[i];
                        sorted[i] = sorted[j];
                        sorted[j] = temp;
                    }
                }
            }
        } else if (criteriu === "nou") {
            for (let i = 0; i < sorted.length - 1; i++) {
                for (let j = i + 1; j < sorted.length; j++) {
                    if (sorted[j].id > sorted[i].id) {
                        const temp = sorted[i];
                        sorted[i] = sorted[j];
                        sorted[j] = temp;
                    }
                }
            }
        } else if (criteriu === "pret") {
            for (let i = 0; i < sorted.length - 1; i++) {
                for (let j = i + 1; j < sorted.length; j++) {
                    if (sorted[j].price < sorted[i].price) {
                        const temp = sorted[i];
                        sorted[i] = sorted[j];
                        sorted[j] = temp;
                    }
                }
            }
        }

        return sorted;
    }

    function rendeazaPaginare(totalPagini) {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = "";

        if (totalPagini <= 1) {
            return;
        }

        const prevBtn = document.createElement("button");
        prevBtn.className = "page-next";
        prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        prevBtn.setAttribute("aria-label", "Pagina anterioară");
        paginationContainer.appendChild(prevBtn);

        (function (p) {
            prevBtn.addEventListener("click", function () {
                if (paginaCurenta > 1) {
                    paginaCurenta--;
                    rendeazaProduse();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        })(paginaCurenta);

        const paginiDeAfișat = calculeazaPaginile(totalPagini, paginaCurenta);

        for (let i = 0; i < paginiDeAfișat.length; i++) {
            const item = paginiDeAfișat[i];

            if (item === "...") {
                const dots = document.createElement("div");
                dots.className = "page-dots";
                dots.textContent = "...";
                paginationContainer.appendChild(dots);
            } else {
                const pageDiv = document.createElement("div");
                pageDiv.className = "page-number";
                if (item === paginaCurenta) {
                    pageDiv.classList.add("active");
                }
                pageDiv.textContent = item;

                (function (p) {
                    pageDiv.addEventListener("click", function () {
                        if (p !== paginaCurenta) {
                            paginaCurenta = p;
                            rendeazaProduse();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    });
                })(item);

                paginationContainer.appendChild(pageDiv);
            }
        }

        const nextBtn = document.createElement("button");
        nextBtn.className = "page-next";
        nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        nextBtn.setAttribute("aria-label", "Pagina următoare");
        paginationContainer.appendChild(nextBtn);

        (function (p) {
            nextBtn.addEventListener("click", function () {
                if (paginaCurenta < totalPagini) {
                    paginaCurenta++;
                    rendeazaProduse();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        })(paginaCurenta);
    }

    function calculeazaPaginile(totalPagini, paginaCurenta) {
        const pagini = [];

        if (totalPagini <= 7) {
            for (let i = 1; i <= totalPagini; i++) {
                pagini.push(i);
            }
            return pagini;
        }

        pagini.push(1);

        if (paginaCurenta > 3) {
            pagini.push("...");
        }

        let start = Math.max(2, paginaCurenta - 1);
        let end = Math.min(totalPagini - 1, paginaCurenta + 1);

        if (paginaCurenta <= 3) {
            end = Math.min(4, totalPagini - 1);
        }
        if (paginaCurenta >= totalPagini - 2) {
            start = Math.max(totalPagini - 3, 2);
        }

        for (let i = start; i <= end; i++) {
            pagini.push(i);
        }

        if (paginaCurenta < totalPagini - 2) {
            pagini.push("...");
        }

        pagini.push(totalPagini);

        return pagini;
    }

    function actualizeazaNumereleReale() {
        if (categoryList) {
            const toateLi = categoryList.querySelectorAll("li");
            for (let i = 0; i < toateLi.length; i++) {
                const li = toateLi[i];
                const categorie = li.getAttribute("data-category");
                const span = li.querySelector("span");
                if (!span) continue;

                if (categorie === "Toate") {
                    span.textContent = "(" + toateProdusele.length + ")";
                } else {
                    let count = 0;
                    for (let j = 0; j < toateProdusele.length; j++) {
                        if (toateProdusele[j].category === categorie) {
                            count++;
                        }
                    }
                    span.textContent = "(" + count + ")";
                }
            }
        }

        genereazaBranduri();

        let produseInStoc = 0;
        let produseStocEpuizat = 0;
        for (let i = 0; i < toateProdusele.length; i++) {
            if (toateProdusele[i].stock > 0) {
                produseInStoc++;
            } else {
                produseStocEpuizat++;
            }
        }

        const availBlocks = document.querySelectorAll(".filter-block");
        for (let i = 0; i < availBlocks.length; i++) {
            const header = availBlocks[i].querySelector(".catrgory-name");
            if (header && header.textContent.indexOf("DISPONIBILITATE") !== -1) {
                const spans = availBlocks[i].querySelectorAll(".filter-content span");
                if (spans.length >= 2) {
                    spans[0].textContent = "(" + produseInStoc + ")";
                    spans[1].textContent = "(" + produseStocEpuizat + ")";
                }
            }
        }
    }

    function genereazaBranduri() {
        const brandContent = document.querySelector("#filter-brand .filter-content");
        if (!brandContent) return;

        const branduriUnice = [];
        for (let i = 0; i < toateProdusele.length; i++) {
            const brand = toateProdusele[i].brand;
            let exista = false;
            for (let j = 0; j < branduriUnice.length; j++) {
                if (branduriUnice[j].nume === brand) {
                    branduriUnice[j].count++;
                    exista = true;
                    break;
                }
            }
            if (!exista) {
                branduriUnice.push({ nume: brand, count: 1 });
            }
        }

        for (let i = 0; i < branduriUnice.length - 1; i++) {
            for (let j = i + 1; j < branduriUnice.length; j++) {
                if (branduriUnice[j].nume < branduriUnice[i].nume) {
                    const temp = branduriUnice[i];
                    branduriUnice[i] = branduriUnice[j];
                    branduriUnice[j] = temp;
                }
            }
        }

        brandContent.innerHTML = "";

        for (let i = 0; i < branduriUnice.length; i++) {
            const label = document.createElement("label");
            label.className = "checkbox";

            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("data-brand", branduriUnice[i].nume);

            const p = document.createElement("p");
            p.className = "filter-amount";
            p.innerHTML = branduriUnice[i].nume + ' <span>(' + branduriUnice[i].count + ')</span>';

            label.appendChild(input);
            label.appendChild(p);

            if (i >= branduriVizibileInitial) {
                label.style.display = "none";
                label.classList.add("brand-ascuns");
            }

            brandContent.appendChild(label);
        }

        actualizeazaArataBrand();
    }

    function actualizeazaArataBrand() {
        const showMoreWrapper = document.querySelector("#filter-brand .show-more-wrapper");
        if (!showMoreWrapper) return;

        const showTitle = showMoreWrapper.querySelector(".show-title");
        if (!showTitle) return;

        const branduriAscunse = document.querySelectorAll("#filter-brand .brand-ascuns");
        if (branduriAscunse.length === 0) {
            showMoreWrapper.style.display = "none";
            return;
        }

        showMoreWrapper.style.display = "";
        showMoreWrapper.onclick = function () {
            arataToateBrandurile = !arataToateBrandurile;

            const toateBrandLabels = document.querySelectorAll("#filter-brand .checkbox");
            for (let i = branduriVizibileInitial; i < toateBrandLabels.length; i++) {
                if (arataToateBrandurile) {
                    toateBrandLabels[i].style.display = "";
                } else {
                    toateBrandLabels[i].style.display = "none";
                }
            }

            if (arataToateBrandurile) {
                showTitle.textContent = "Arată mai puțin";
                showMoreWrapper.classList.add("expanded");
            } else {
                showTitle.textContent = "Arată mai mult";
                showMoreWrapper.classList.remove("expanded");
            }
        };
    }

    if (categoryList) {
        categoryList.addEventListener("click", function (e) {
            const li = e.target.closest("li");
            if (!li) return;

            const categorie = li.getAttribute("data-category");
            if (!categorie) return;

            filtruCategorie = categorie;
            paginaCurenta = 1;

            const toateLi = categoryList.querySelectorAll("li");
            for (let i = 0; i < toateLi.length; i++) {
                toateLi[i].classList.remove("active");
            }
            li.classList.add("active");
        });
    }

    if (priceRange) {
        priceRange.addEventListener("input", function () {
            if (priceMaxLabel) {
                priceMaxLabel.textContent = "$" + parseInt(this.value, 10);
            }
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            const val = this.value.toLowerCase();
            if (val.indexOf("popularitate") !== -1) {
                sortareCurenta = "popularitate";
            } else if (val.indexOf("noi") !== -1) {
                sortareCurenta = "nou";
            } else if (val.indexOf("preț") !== -1 || val.indexOf("pret") !== -1) {
                sortareCurenta = "pret";
            }
            paginaCurenta = 1;
            rendeazaProduse();
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener("click", function (e) {
            e.preventDefault();
            aplicaFiltrele();
        });
    }

    function aplicaFiltrele() {
        branduriActive = [];
        const brandCheckboxes = document.querySelectorAll("#filter-brand input[type='checkbox']:checked");
        for (let i = 0; i < brandCheckboxes.length; i++) {
            const brand = brandCheckboxes[i].getAttribute("data-brand");
            if (brand) {
                branduriActive.push(brand);
            }
        }

        disponibilitateActive = [];
        const availCheckboxes = document.querySelectorAll("input[data-type='availability']:checked");
        for (let i = 0; i < availCheckboxes.length; i++) {
            const val = availCheckboxes[i].getAttribute("data-value");
            if (val) {
                disponibilitateActive.push(val);
            }
        }

        if (priceRange) {
            filtruPretMax = parseInt(priceRange.value, 10);
        }

        paginaCurenta = 1;
        rendeazaProduse();
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            filtruCategorie = "Toate";
            const toateLi = categoryList ? categoryList.querySelectorAll("li") : [];
            for (let i = 0; i < toateLi.length; i++) {
                toateLi[i].classList.remove("active");
                if (toateLi[i].getAttribute("data-category") === "Toate") {
                    toateLi[i].classList.add("active");
                }
            }

            if (priceRange) {
                priceRange.value = priceRange.max;
                filtruPretMax = parseInt(priceRange.max, 10);
                if (priceMaxLabel) {
                    priceMaxLabel.textContent = "$" + priceRange.max;
                }
            }

            const brandCheckboxes = document.querySelectorAll("#filter-brand input[type='checkbox']");
            for (let i = 0; i < brandCheckboxes.length; i++) {
                brandCheckboxes[i].checked = false;
            }
            branduriActive = [];

            if (arataToateBrandurile) {
                arataToateBrandurile = false;
                const toateBrandLabels = document.querySelectorAll("#filter-brand .checkbox");
                for (let i = branduriVizibileInitial; i < toateBrandLabels.length; i++) {
                    toateBrandLabels[i].style.display = "none";
                }
                const showTitle = document.querySelector("#filter-brand .show-title");
                if (showTitle) showTitle.textContent = "Arată mai mult";
                const showWrapper = document.querySelector("#filter-brand .show-more-wrapper");
                if (showWrapper) showWrapper.classList.remove("expanded");
            }

            const availCheckboxes = document.querySelectorAll("input[data-type='availability']");
            for (let i = 0; i < availCheckboxes.length; i++) {
                availCheckboxes[i].checked = false;
            }
            disponibilitateActive = [];

            if (sortSelect) {
                sortSelect.selectedIndex = 0;
                sortareCurenta = "popularitate";
            }

            paginaCurenta = 1;
            rendeazaProduse();
        });
    }

    document.addEventListener("click", function (e) {
        const quickViewBtn = e.target.closest(".action-quick-view");
        if (quickViewBtn) {
            e.preventDefault();
            const card = quickViewBtn.closest(".product-card");
            if (card) {
                const id = card.getAttribute("data-id");
                if (id) {
                    window.location.href = "product.html?id=" + id;
                }
            }
        }
    });

    document.addEventListener("click", function (e) {
        const compareBtn = e.target.closest(".action-compare");
        if (compareBtn) {
            e.preventDefault();
            showToast("Funcția va fi disponibilă în curând", "info");
        }
    });

    actualizeazaNumereleReale();

    if (priceRange) {
        priceRange.value = priceRange.max;
        filtruPretMax = parseInt(priceRange.max, 10);
        if (priceMaxLabel) {
            priceMaxLabel.textContent = "$" + priceRange.max;
        }
    }

    if (categorieUrl && categoryList) {
        const toateLi = categoryList.querySelectorAll("li");
        for (let i = 0; i < toateLi.length; i++) {
            toateLi[i].classList.remove("active");
            if (toateLi[i].getAttribute("data-category") === categorieUrl) {
                toateLi[i].classList.add("active");
            }
        }
        aplicaFiltrele();
    } else {
        rendeazaProduse();
    }

    /* ============================================
       FILTER BUTTON — desktop scroll / drawer toggle
       ============================================ */
    const filterToggle = document.querySelector(".filter-toggle-btn");
    const shopSidebar = document.querySelector(".shop-sidebar");
    const shopOverlay = document.querySelector(".shop-overlay");

    function openFilterDrawer() {
        if (shopSidebar) shopSidebar.classList.add("open");
        if (shopOverlay) shopOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeFilterDrawer() {
        if (shopSidebar) shopSidebar.classList.remove("open");
        if (shopOverlay) shopOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    if (filterToggle) {
        filterToggle.addEventListener("click", openFilterDrawer);
    }

    if (shopOverlay) {
        shopOverlay.addEventListener("click", closeFilterDrawer);
    }

    if (applyBtn) {
        applyBtn.addEventListener("click", closeFilterDrawer);
    }

    // Add close button inside sidebar drawer
    if (shopSidebar) {
        const closeBtn = document.createElement("button");
        closeBtn.className = "sidebar-close-btn";
        closeBtn.setAttribute("aria-label", "Inchide filtre");
        closeBtn.innerHTML = "✕";
        closeBtn.addEventListener("click", closeFilterDrawer);
        shopSidebar.insertBefore(closeBtn, shopSidebar.firstChild);
    }

});

