/* ================================================
   checkout.js  –  Checkout page logic
   ================================================ */

(function () {

    /* ── Render order items from cart ── */
    function fmt(n) { return n.toLocaleString('en-EG') + ' EGP'; }

    function renderCheckoutItems() {
        var listEl = document.getElementById('checkoutItemsList');
        if (!listEl) return;

        var items = cartGet();

        if (items.length === 0) {
            // redirect back to cart if empty
            window.location.href = 'cart.html';
            return;
        }

        listEl.innerHTML = '';
        items.forEach(function (item) {
            var p = SB_PRODUCTS[item.id];
            if (!p) return;

            var row = document.createElement('div');
            row.className = 'checkout-item';
            row.innerHTML =
                '<div class="checkout-item-img-wrap">' +
                    '<img class="checkout-item-img" src="' + p.image + '" alt="' + p.name + '">' +
                    '<span class="checkout-item-qty-badge">' + item.qty + '</span>' +
                '</div>' +
                '<div class="checkout-item-info">' +
                    '<div class="checkout-item-name">' + p.name + '</div>' +
                    '<div class="checkout-item-meta">' + p.category + ' · ' + fmt(p.price) + ' each</div>' +
                '</div>' +
                '<div class="checkout-item-price">' + fmt(p.price * item.qty) + '</div>';

            listEl.appendChild(row);
        });

        updateCheckoutSummary();
    }

    function updateCheckoutSummary() {
        var items    = cartGet();
        var subtotal = cartSubtotal(items);
        var shipping = subtotal >= 1500 ? 0 : 80;

        // carry over promo from sessionStorage if any
        var promoDiscount = parseInt(sessionStorage.getItem('sb_promo_discount') || '0');
        var discount = promoDiscount > 0 ? Math.round(subtotal * promoDiscount / 100) : 0;
        var total    = subtotal + shipping - discount;

        document.getElementById('coSubtotal').textContent = fmt(subtotal);
        document.getElementById('coShipping').textContent = shipping === 0 ? 'Free' : fmt(shipping);
        document.getElementById('coTotal').textContent    = fmt(total);

        var discRow = document.getElementById('coDiscountRow');
        if (discount > 0 && discRow) {
            discRow.style.display = 'flex';
            document.getElementById('coDiscount').textContent = '−' + fmt(discount);
        }
    }

    /* ── Payment option toggle ── */
    var paymentOptions = document.querySelectorAll('.payment-option');
    var cardFields     = document.getElementById('cardFields');

    paymentOptions.forEach(function (opt) {
        opt.addEventListener('click', function () {
            paymentOptions.forEach(function (o) { o.classList.remove('active'); });
            opt.classList.add('active');
            opt.querySelector('input[type="radio"]').checked = true;

            if (cardFields) {
                cardFields.style.display = opt.querySelector('input').value === 'card' ? 'block' : 'none';
            }
        });
    });

    /* ── Card number formatting ── */
    var cardNumInput = document.getElementById('cardNumber');
    if (cardNumInput) {
        cardNumInput.addEventListener('input', function () {
            var v = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    var cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function () {
            var v = this.value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
            this.value = v;
        });
    }

    /* ── Validation helpers ── */
    function setErr(inputId, errId, msg) {
        var input = document.getElementById(inputId);
        var err   = document.getElementById(errId);
        if (input) input.classList.toggle('invalid', !!msg);
        if (err)   err.textContent = msg || '';
        return !!msg;
    }

    function clearErrs() {
        document.querySelectorAll('.field-group input, .field-group select, .field-group textarea')
            .forEach(function (el) { el.classList.remove('invalid'); });
        document.querySelectorAll('.field-err')
            .forEach(function (el) { el.textContent = ''; });
    }

    /* ── Place order ── */
    var placeBtn = document.getElementById('placeOrderBtn');
    if (placeBtn) {
        placeBtn.addEventListener('click', function () {
            clearErrs();
            var hasError = false;

            var firstName   = (document.getElementById('firstName').value   || '').trim();
            var lastName    = (document.getElementById('lastName').value    || '').trim();
            var email       = (document.getElementById('email').value       || '').trim();
            var phone       = (document.getElementById('phone').value       || '').trim();
            var address     = (document.getElementById('address').value     || '').trim();
            var city        = (document.getElementById('city').value        || '').trim();
            var governorate = (document.getElementById('governorate').value || '').trim();

            if (!firstName)  hasError = setErr('firstName',   'firstNameErr',   'Required.') || hasError;
            if (!lastName)   hasError = setErr('lastName',    'lastNameErr',    'Required.') || hasError;
            if (!email)      hasError = setErr('email',       'emailErr',       'Required.') || hasError;
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                             hasError = setErr('email',       'emailErr',       'Enter a valid email.') || hasError;
            if (!phone)      hasError = setErr('phone',       'phoneErr',       'Required.') || hasError;
            if (!address)    hasError = setErr('address',     'addressErr',     'Required.') || hasError;
            if (!city)       hasError = setErr('city',        'cityErr',        'Required.') || hasError;
            if (!governorate) hasError = setErr('governorate','governorateErr', 'Please select a governorate.') || hasError;

            // card validation
            var paymentVal = document.querySelector('.payment-option.active input').value;
            if (paymentVal === 'card') {
                var cardName   = (document.getElementById('cardName').value   || '').trim();
                var cardNumber = (document.getElementById('cardNumber').value || '').replace(/\s/g, '');
                var cardExpiry = (document.getElementById('cardExpiry').value || '').trim();
                var cardCVV    = (document.getElementById('cardCVV').value    || '').trim();

                if (!cardName)              { document.getElementById('cardName').classList.add('invalid');   hasError = true; }
                if (cardNumber.length < 16) { document.getElementById('cardNumber').classList.add('invalid'); hasError = true; }
                if (cardExpiry.length < 4)  { document.getElementById('cardExpiry').classList.add('invalid'); hasError = true; }
                if (cardCVV.length < 3)     { document.getElementById('cardCVV').classList.add('invalid');    hasError = true; }
            }

            if (hasError) {
                // scroll to first error
                var firstInvalid = document.querySelector('.invalid, .field-err:not(:empty)');
                if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // ── Success ──
            placeBtn.textContent = 'Placing order…';
            placeBtn.disabled    = true;

            setTimeout(function () {
                var ref = 'SB-' + Date.now().toString(36).toUpperCase();
                var refEl = document.getElementById('orderRef');
                if (refEl) refEl.textContent = 'Order reference: ' + ref;

                var overlay = document.getElementById('orderSuccess');
                if (overlay) overlay.style.display = 'flex';

                cartClear();
            }, 1000);
        });
    }

    /* ── Init ── */
    renderCheckoutItems();

})();
