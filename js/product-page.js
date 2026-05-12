document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function getUserSkintone() {
        return localStorage.getItem('userSkintone') || null;
    }

    function findShadeIndexForSkintone(product, skintone) {
        if (!product || !product.shades || !product.shades.length) return -1;
        var n = product.shades.length;
        var bucketSize = Math.ceil(n / 3);
        var start = { light: 0, medium: bucketSize, dark: 2 * bucketSize };
        var idx = start[skintone] || 0;
        if (idx >= n) idx = n - 1;
        return idx;
    }

    var productId = getQueryParam('product');
    if (!productId || !window.SB_PRODUCT_DATA) return;
    var product = window.SB_PRODUCT_DATA.getProduct(productId) || null;
    if (!product) return;

    var shadesContainer = document.querySelector('[data-shades]');
    if (!shadesContainer) return;

    // render shades
    shadesContainer.innerHTML = '';
    product.shades = product.shades || [];
    product.shades.forEach(function (shade, i) {
        var btn = document.createElement('button');
        btn.className = 'shade-dot';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Shade ' + (i + 1));
        btn.style.background = shade;
        btn.style.width = '32px';
        btn.style.height = '32px';
        btn.style.borderRadius = '50%';
        btn.style.border = '1px solid #ccc';
        btn.style.marginRight = '8px';
        btn.dataset.index = String(i);
        shadesContainer.appendChild(btn);
    });

    // highlight recommended shade
    var user = getUserSkintone();
    if (user) {
        var recIdx = findShadeIndexForSkintone(product, user);
        var recBtn = shadesContainer.querySelector('button[data-index="' + recIdx + '"]');
        if (recBtn) {
            recBtn.classList.add('recommended');
            recBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,.12)';
            recBtn.style.outline = '2px solid rgba(255,200,120,.6)';
            // add quick CTA
            var cta = document.createElement('div');
            cta.style.marginTop = '8px';
            cta.innerHTML = '<button class="btn-outline" type="button" id="useRecommended">Use my recommended shade</button>';
            shadesContainer.parentElement.appendChild(cta);
            var useBtn = document.getElementById('useRecommended');
            if (useBtn) {
                useBtn.addEventListener('click', function () {
                    // simulate selecting the shade
                    recBtn.click();
                    recBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }
        }
    }
});
