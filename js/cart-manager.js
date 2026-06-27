function getCart() {
    const data = localStorage.getItem("motrix_cart");

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

function saveCart(cart) {
    localStorage.setItem("motrix_cart", JSON.stringify(cart));

    updateCartBadge();
}

function addToCart(productId, quantity) {
    if (quantity === undefined) {
        quantity = 1;
    }

    const cart = getCart();

    let gasit = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].quantity = cart[i].quantity + quantity;
            gasit = true;
            break;
        }
    }

    if (!gasit) {
        cart.push({
            productId: productId,
            quantity: quantity
        });
    }

    saveCart(cart);
}

function removeFromCart(productId) {
    const cart = getCart();
    const cartNou = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId !== productId) {
            cartNou.push(cart[i]);
        }
    }

    saveCart(cartNou);
}

function increaseQuantity(productId) {
    const cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].quantity = cart[i].quantity + 1;
            break;
        }
    }

    saveCart(cart);
}

function decreaseQuantity(productId) {
    const cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].quantity = cart[i].quantity - 1;

            if (cart[i].quantity <= 0) {
                removeFromCart(productId);
                return;
            }

            break;
        }
    }

    saveCart(cart);
}

function clearCart() {
    saveCart([]);
}

function getCartCount() {
    const cart = getCart();
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].quantity;
    }

    return total;
}

function getSubtotal() {
    const cart = getCart();
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        const produs = getProductById(cart[i].productId);

        if (produs) {
            subtotal = subtotal + (produs.price * cart[i].quantity);
        }
    }

    return subtotal;
}

function isProductInCart(productId) {
    const cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            return true;
        }
    }

    return false;
}

function getCartItem(productId) {
    const cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            return cart[i];
        }
    }

    return null;
}

function getTax() {
    return getSubtotal() * 0.19;
}

function getShipping() {
    const subtotal = getSubtotal();

    if (subtotal >= 200) {
        return 0;
    }

    return 25;
}

function getTotalPrice() {
    return getSubtotal() + getTax() + getShipping();
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");

    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
    }
}

function updateCartSummary() {
    const subtotalEl = document.getElementById("checkout-subtotal");
    const taxEl = document.getElementById("checkout-tax");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");

    if (!subtotalEl || !totalEl) {
        return;
    }

    const subtotal = getSubtotal();
    const tax = getTax();
    const shipping = getShipping();
    const total = getTotalPrice();

    subtotalEl.textContent = "$" + subtotal.toFixed(2);
    taxEl.textContent = "$" + tax.toFixed(2);

    if (shipping === 0) {
        shippingEl.textContent = "Gratuit";
    } else {
        shippingEl.textContent = "$" + shipping.toFixed(2);
    }

    totalEl.textContent = "$" + total.toFixed(2);
}
