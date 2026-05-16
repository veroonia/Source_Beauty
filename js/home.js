// ── Inject shared nav & footer ─────────────────
(function () {
    function loadFragment(url, targetId) {
        var el = document.getElementById(targetId);
        if (!el) return;
        fetch(url)
            .then(function (r) { return r.text(); })
            .then(function (html) { el.innerHTML = html; })
            .catch(function () { /* silently ignore if file not found */ });
    }
    loadFragment('nav.html',    'site-nav');
    loadFragment('footer.html', 'site-footer');
})();

// Auto-scroll featured strip; pauses on hover/focus
(function(){
    const productCatalog = (window.SB_PRODUCT_DATA && window.SB_PRODUCT_DATA.catalog) || {};
    const productData = window.SB_PRODUCT_DATA || {
        getProductByName: function () { return null; },
        getProductIdByName: function (value) {
            return String(value || '')
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
    };

    function formatPrice(value) {
        return Number(value || 0).toLocaleString('en-EG') + ' EGP';
    }

    function syncProductCard(card) {
        if (!card) return;

        const existingName = card.querySelector('.product-name')?.textContent.trim()
            || card.querySelector('h3')?.textContent.trim()
            || '';
        const productId = card.dataset.productId
            || productData.getProductIdByName(existingName);
        const product = productCatalog[productId] || productData.getProductByName(existingName);

        if (!product) return;

        const image = card.querySelector('img');
        if (image) {
            image.src = product.image;
            image.alt = product.alt;
        }

        const title = card.querySelector('.product-name') || card.querySelector('h3');
        if (title) {
            title.textContent = product.name;
        }

        const price = card.querySelector('.product-body p')
            || card.querySelector('.sale-price')
            || card.querySelector('.price');
        if (price) {
            price.textContent = formatPrice(product.salePrice || product.price);
        }

        const originalPrice = card.querySelector('.original-price');
        if (originalPrice && product.originalPrice) {
            originalPrice.textContent = formatPrice(product.originalPrice);
        }

        const category = card.querySelector('.product-category');
        if (category) {
            category.textContent = product.category;
        }

        const rating = card.querySelector('.rating-number');
        if (rating && typeof product.rating === 'number') {
            rating.textContent = product.rating.toFixed(1);
        }

        const discountBadge = card.querySelector('.discount-badge');
        if (discountBadge && product.discount) {
            discountBadge.textContent = product.discount + ' off';
        }
    }

    function syncAllProductCards() {
        document.querySelectorAll('[data-product-id]').forEach(syncProductCard);
        document.querySelectorAll('.products-grid .product-card').forEach(syncProductCard);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncAllProductCards, { once: true });
    } else {
        syncAllProductCards();
    }

    const productLinks = document.querySelectorAll('[data-product-id]');
    productLinks.forEach(function(link) {
        const productId = link.dataset.productId;
        if (productCatalog[productId]) {
            link.dataset.productName = productCatalog[productId].name;
        }
    });

    const strip = document.querySelector('.featured-strip');

    if (strip) {
        let speed = 0.5; // pixels per frame
        let rafId = null;
        let pos = 0;

        function step(){
            pos += speed;
            if (pos >= strip.scrollWidth - strip.clientWidth){
                pos = 0;
            }
            strip.scrollLeft = pos;
            rafId = requestAnimationFrame(step);
        }

        function start(){
            if (!rafId) rafId = requestAnimationFrame(step);
        }

        function stop(){
            if (rafId){
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        strip.addEventListener('mouseenter', stop);
        strip.addEventListener('mouseleave', start);
        strip.addEventListener('focusin', stop);
        strip.addEventListener('focusout', start);
        
        // Prevent auto-scroll when user manually scrolls
        let isUserScrolling = false;
        strip.addEventListener('scroll', function() {
            if (!isUserScrolling) {
                isUserScrolling = true;
                stop();
                setTimeout(function() {
                    isUserScrolling = false;
                }, 500);
            }
        });

        start();
    }

    const productName = document.querySelector('[data-product-name]');
    const productPrice = document.querySelector('[data-product-price]');
    const productDescription = document.querySelector('[data-product-description]');
    const productImage = document.querySelector('[data-product-image]');
    const productCategory = document.querySelector('[data-product-category]');
    const productHighlights = document.querySelector('[data-product-highlights]');
    const addToBagButton = document.querySelector('[data-action="add-to-bag"]');
    const relatedProductsContainer = document.querySelector('[data-related-products]');

    function formatEgp(value) {
        return Number(value || 0).toLocaleString('en-EG') + ' EGP';
    }

    function renderRelatedProducts(activeId, activeProduct) {
        if (!relatedProductsContainer) return;

        const allProducts = Object.entries(productCatalog);
        const sameCategory = allProducts.filter(function(entry) {
            const id = entry[0];
            const product = entry[1];
            return id !== activeId && product.category === activeProduct.category;
        });

        const fallback = allProducts.filter(function(entry) {
            return entry[0] !== activeId;
        });

        const picks = (sameCategory.length >= 3 ? sameCategory : sameCategory.concat(fallback))
            .slice(0, 3);

        relatedProductsContainer.innerHTML = '';
        picks.forEach(function(entry) {
            const id = entry[0];
            const product = entry[1];
            const card = document.createElement('a');
            card.className = 'related-product-card';
            card.href = 'product.html?product=' + encodeURIComponent(id);
            card.innerHTML =
                '<img src="' + product.image + '" alt="' + product.alt + '">' +
                '<div class="related-product-copy">' +
                    '<h4>' + product.name + '</h4>' +
                    '<p>' + product.category + '</p>' +
                    '<span class="related-price">' + formatEgp(product.salePrice || product.price) + '</span>' +
                '</div>';
            relatedProductsContainer.appendChild(card);
        });
    }

    if (productName && productPrice && productDescription && productImage) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product') || 'lipstick';
        const product = productCatalog[productId] || productCatalog.lipstick;

        productName.textContent = product.name;
        productPrice.textContent = `$${product.price}`;
        productDescription.textContent = product.description;
        productImage.src = product.image;
        productImage.alt = product.alt;

        if (productCategory) {
            productCategory.textContent = product.category;
        }

        if (productHighlights) {
            productHighlights.textContent = product.highlights;
        }

        const shadeCirclesContainer = document.querySelector('.shade-circles');
        if (shadeCirclesContainer && product.shades) {
            shadeCirclesContainer.innerHTML = '';
            shadeCirclesContainer.dataset.shades = product.shades.join(',');
        }

        if (addToBagButton) {
            addToBagButton.addEventListener('click', function(){
                const shadeCirclesContainer = document.querySelector('.shade-circles');
                const selectedShade = shadeCirclesContainer?.dataset.selectedShade;
                const originalText = addToBagButton.textContent;
                addToBagButton.textContent = selectedShade ? `Added to bag (Shade #${selectedShade})` : 'Added to bag';
                setTimeout(function() {
                    addToBagButton.textContent = originalText;
                }, 2000);
            });
        }

        renderRelatedProducts(productId, product);
    }

    const shadeCirclesContainer = document.querySelector('.shade-circles');
    if (shadeCirclesContainer) {
        const shadesData = shadeCirclesContainer.dataset.shades;
        if (shadesData) {
            const shades = shadesData.split(',');
            shadeCirclesContainer.innerHTML = '';
            let selectedShade = null;
            
            shades.forEach(function(shadeColor, index) {
                const randomNumber = Math.floor(Math.random() * 900) + 100;
                const circle = document.createElement('div');
                circle.className = 'shade-circle';
                circle.style.backgroundColor = shadeColor;
                circle.textContent = randomNumber;
                circle.title = `Shade #${randomNumber}`;
                circle.dataset.shadeNumber = randomNumber;
                circle.dataset.shadeColor = shadeColor;
                
                // Select first shade by default
                if (index === 0) {
                    circle.classList.add('selected');
                    selectedShade = randomNumber;
                }
                
                // Add click handler for shade selection
                circle.addEventListener('click', function() {
                    // Remove selected class from all shades
                    shadeCirclesContainer.querySelectorAll('.shade-circle').forEach(function(s) {
                        s.classList.remove('selected');
                    });
                    // Add selected class to clicked shade
                    circle.classList.add('selected');
                    selectedShade = randomNumber;
                    
                    // Store selected shade in data attribute
                    shadeCirclesContainer.dataset.selectedShade = randomNumber;
                    shadeCirclesContainer.dataset.selectedColor = shadeColor;
                });
                
                shadeCirclesContainer.appendChild(circle);
            });
            
            // Store initial selection
            shadeCirclesContainer.dataset.selectedShade = selectedShade;
        }
    }

    const footerMount = document.querySelector('#site-footer');
    if (footerMount) {
        fetch('footer.html')
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                footerMount.outerHTML = html;
            })
            .catch(function() {
                footerMount.remove();
            });
    }

    const navMount = document.querySelector('#site-nav');
    if (navMount) {
        fetch('nav.html')
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                navMount.outerHTML = html;
            })
            .catch(function() {
                navMount.remove();
            });
    }
})();
