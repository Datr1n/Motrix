function getProducts() {
    const data = localStorage.getItem("motrix_products");

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

function getProductById(id) {
    const produse = getProducts();

    for (let i = 0; i < produse.length; i++) {
        if (produse[i].id === id) {
            return produse[i];
        }
    }

    return null;
}

function getProductsByCategory(categorie) {
    const produse = getProducts();
    const rezultate = [];

    for (let i = 0; i < produse.length; i++) {
        if (produse[i].category.toLowerCase() === categorie.toLowerCase()) {
            rezultate.push(produse[i]);
        }
    }

    return rezultate;
}

function getRelatedProducts(id, count) {
    const produsCurent = getProductById(id);

    if (!produsCurent) {
        return [];
    }

    const produse = getProducts();
    let related = [];

    for (let i = 0; i < produse.length; i++) {
        if (produse[i].id !== id &&
            produse[i].category.toLowerCase() === produsCurent.category.toLowerCase()) {
            related.push(produse[i]);
        }
    }

    if (related.length > count) {
        related = related.slice(0, count);
    }

    return related;
}

function searchProducts(term) {
    const produse = getProducts();
    const rezultate = [];

    const termenCautare = term.toLowerCase();

    for (let i = 0; i < produse.length; i++) {
        const produs = produse[i];

        if (produs.name.toLowerCase().indexOf(termenCautare) !== -1 ||
            produs.shortDescription.toLowerCase().indexOf(termenCautare) !== -1 ||
            produs.fullDescription.toLowerCase().indexOf(termenCautare) !== -1) {

            rezultate.push(produs);
        }
    }

    return rezultate;
}
