/* ================================================
   cart.js  –  Shared cart logic (localStorage)
   Used by: cart.html, checkout.html, product pages
   ================================================ */

var SB_CART_KEY = 'sb_cart';

/* ── Product catalogue (single source of truth) ── */
var SB_PRODUCTS = (window.SB_PRODUCT_DATA && window.SB_PRODUCT_DATA.catalog) || {};

/* ── Promo codes ── */
var PROMO_CODES = {
    'BEAUTY20': 20,
    'SOURCE10': 10,
    'WELCOME15': 15
};

/* ════════════════════════════════════════════════
   CART CRUD
════════════════════════════════════════════════ */
function cartGet() {
    try {
        return JSON.parse(localStorage.getItem(SB_CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function cartSave(items) {
    localStorage.setItem(SB_CART_KEY, JSON.stringify(items));
    cartUpdateBadge();
}

function cartAdd(productId, qty) {
    qty = qty || 1;
    var items = cartGet();
    var existing = items.find(function (i) { return i.id === productId; });
    if (existing) {
        existing.qty += qty;
    } else {
        var product = SB_PRODUCTS[productId];
        if (!product) return;
        items.push({ id: productId, qty: qty });
    }
    cartSave(items);
}

function cartRemove(productId) {
    var items = cartGet().filter(function (i) { return i.id !== productId; });
    cartSave(items);
}

function cartUpdateQty(productId, qty) {
    var items = cartGet();
    var item = items.find(function (i) { return i.id === productId; });
    if (item) {
        item.qty = Math.max(1, qty);
        cartSave(items);
    }
}

function cartClear() {
    localStorage.removeItem(SB_CART_KEY);
    cartUpdateBadge();
}

function cartCount() {
    return cartGet().reduce(function (sum, i) { return sum + i.qty; }, 0);
}

function cartSubtotal(items) {
    return (items || cartGet()).reduce(function (sum, i) {
        var p = SB_PRODUCTS[i.id];
        return sum + (p ? p.price * i.qty : 0);
    }, 0);
}

/* ── Nav badge ── */
function cartUpdateBadge() {
    var count = cartCount();
    var badges = document.querySelectorAll('.cart-nav-badge');
    badges.forEach(function (b) {
        b.textContent = count;
        b.style.display = count > 0 ? 'flex' : 'none';
    });
}

/* ════════════════════════════════════════════════
   CART PAGE RENDER
════════════════════════════════════════════════ */
(function () {
    var listEl    = document.getElementById('cartItemsList');
    var emptyEl   = document.getElementById('cartEmpty');
    var layoutEl  = document.getElementById('cartLayout');
    if (!listEl) return;   // not on cart page

    var appliedPromo = null;

    function fmt(n) { return n.toLocaleString('en-EG') + ' EGP'; }

    function renderCart() {
        var items = cartGet();
        var count = items.reduce(function (s, i) { return s + i.qty; }, 0);

        // count label
        var countLabel = document.getElementById('cartCountLabel');
        if (countLabel) countLabel.textContent = '(' + count + ' item' + (count !== 1 ? 's' : '') + ')';

        if (items.length === 0) {
            emptyEl.style.display  = 'block';
            layoutEl.style.display = 'none';
            return;
        }

        emptyEl.style.display  = 'none';
        layoutEl.style.display = 'grid';

        listEl.innerHTML = '';
        items.forEach(function (item) {
            var p = SB_PRODUCTS[item.id];
            if (!p) return;
            var row = document.createElement('div');
            row.className = 'cart-item';
            row.dataset.id = item.id;
            row.innerHTML =
                '<div class="cart-item-product">' +
                    '<img class="cart-item-img" src="' + p.image + '" alt="' + p.name + '">' +
                    '<div class="cart-item-info">' +
                        '<div class="cart-item-name">' + p.name + '</div>' +
                        '<div class="cart-item-meta">' + p.category + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="cart-item-price">' + fmt(p.price) + '</div>' +
                '<div class="qty-stepper">' +
                    '<button class="qty-btn qty-minus" aria-label="Decrease">−</button>' +
                    '<input class="qty-val" type="number" value="' + item.qty + '" min="1" max="99" aria-label="Quantity">' +
                    '<button class="qty-btn qty-plus" aria-label="Increase">+</button>' +
                '</div>' +
                '<div class="cart-item-total">' + fmt(p.price * item.qty) + '</div>' +
                '<button class="remove-btn" aria-label="Remove item">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
                '</button>';

            // qty minus
            row.querySelector('.qty-minus').addEventListener('click', function () {
                var newQty = item.qty - 1;
                if (newQty < 1) { cartRemove(item.id); renderCart(); updateSummary(); return; }
                cartUpdateQty(item.id, newQty);
                renderCart();
                updateSummary();
            });

            // qty plus
            row.querySelector('.qty-plus').addEventListener('click', function () {
                cartUpdateQty(item.id, item.qty + 1);
                renderCart();
                updateSummary();
            });

            // qty input
            row.querySelector('.qty-val').addEventListener('change', function () {
                var v = parseInt(this.value) || 1;
                cartUpdateQty(item.id, v);
                renderCart();
                updateSummary();
            });

            // remove
            row.querySelector('.remove-btn').addEventListener('click', function () {
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                row.style.transition = 'opacity .25s, transform .25s';
                setTimeout(function () {
                    cartRemove(item.id);
                    renderCart();
                    updateSummary();
                }, 250);
            });

            listEl.appendChild(row);
        });

        updateSummary();
    }

    function updateSummary() {
        var items    = cartGet();
        var subtotal = cartSubtotal(items);
        var shipping = subtotal >= 1500 ? 0 : 80;
        var discount = 0;

        if (appliedPromo) {
            discount = Math.round(subtotal * appliedPromo / 100);
        }

        var total = subtotal + shipping - discount;

        document.getElementById('summarySubtotal').textContent = fmt(subtotal);
        document.getElementById('summaryShipping').textContent = shipping === 0 ? 'Free' : fmt(shipping);
        document.getElementById('summaryDiscount').textContent = discount > 0 ? '−' + fmt(discount) : '—';
        document.getElementById('summaryTotal').textContent    = fmt(total);
    }

    // Promo code
    var promoBtn = document.getElementById('promoBtn');
    var promoMsg = document.getElementById('promoMsg');
    if (promoBtn) {
        promoBtn.addEventListener('click', function () {
            var code = (document.getElementById('promoInput').value || '').trim().toUpperCase();
            if (PROMO_CODES[code]) {
                appliedPromo = PROMO_CODES[code];
                promoMsg.textContent = '✓ ' + appliedPromo + '% discount applied!';
                promoMsg.className = 'promo-msg success';
                updateSummary();
            } else {
                promoMsg.textContent = '✗ Invalid promo code.';
                promoMsg.className = 'promo-msg error';
            }
        });
    }

    renderCart();
})();

/* ── Wire "Add to Cart" buttons on any page ── */
document.addEventListener('DOMContentLoaded', function () {
    cartUpdateBadge();

    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var id = btn.dataset.addToCart;
            cartAdd(id, 1);

            // feedback
            var orig = btn.textContent;
            btn.textContent = '✓ Added!';
            btn.style.background = '#2e7d32';
            setTimeout(function () {
                btn.textContent = orig;
                btn.style.background = '';
            }, 1400);
        });
    });

    // product detail page "Add to Bag" button
    var addToBagBtn = document.querySelector('[data-action="add-to-bag"]');
    if (addToBagBtn) {
        var params    = new URLSearchParams(window.location.search);
        var productId = params.get('product') || 'lipstick';
        addToBagBtn.addEventListener('click', function () {
            cartAdd(productId, 1);
            addToBagBtn.textContent = '✓ Added to Cart!';
            addToBagBtn.style.background = '#2e7d32';
            setTimeout(function () {
                addToBagBtn.textContent = 'Add to Bag';
                addToBagBtn.style.background = '';
            }, 1600);
        });
    }
});
