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

// ── Products Catalog Functionality ─────────────────
(function () {
    const priceSlider = document.getElementById('priceSlider');
    const priceValue = document.getElementById('priceValue');
    const sortSelect = document.querySelector('.sort-select');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    const clearAllLink = document.querySelector('.clear-all-link');
    const resultsCount = document.getElementById('resultsCount');
    const activeFilterStatus = document.getElementById('activeFilterStatus');
    const productsGrid = document.querySelector('.products-grid');
    let productCards = [];
    const filterCheckboxes = Array.from(document.querySelectorAll('.filter-checkbox input'));
    const filterTagContainer = document.querySelector('.filter-tags');
    const defaultPriceMax = 3000;
    let forcedProductId = null;

    const productData = window.SB_PRODUCT_DATA || {
        catalog: {},
        getProductIdByName: function (name) {
            return String(name || '')
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },
        getProductByName: function () {
            return null;
        }
    };
    const productCatalog = productData.catalog || {};

    function formatPrice(value) {
        return Number(value || 0).toLocaleString('en-EG') + ' EGP';
    }

    function getStars(rating) {
        return rating >= 4.95 ? '★★★★★' : '★★★★☆';
    }

    function renderProductCards() {
        if (!productsGrid) return;

        var products = Object.keys(productCatalog).map(function (id) {
            return productCatalog[id];
        });

        productsGrid.innerHTML = '';

        products.forEach(function (product) {
            var card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;
            card.innerHTML =
                '<div class="product-image-wrapper">' +
                    '<img src="' + product.image + '" alt="' + product.alt + '" class="product-image">' +
                    (product.discount ? '<span class="discount-badge">' + product.discount + ' off</span>' : '') +
                    '<button class="wishlist-btn">♡</button>' +
                '</div>' +
                '<div class="product-info">' +
                    '<span class="product-category">' + product.category + '</span>' +
                    '<h3 class="product-name">' + product.name + '</h3>' +
                    '<div class="product-rating">' +
                        '<span class="stars">' + getStars(product.rating) + '</span>' +
                        '<span class="rating-number">' + Number(product.rating || 0).toFixed(1) + '</span>' +
                    '</div>' +
                    '<div class="product-price">' +
                        (product.originalPrice ? '<span class="original-price">' + formatPrice(product.originalPrice) + '</span>' : '') +
                        '<span class="sale-price">' + formatPrice(product.salePrice || product.price) + '</span>' +
                    '</div>' +
                '</div>';
            productsGrid.appendChild(card);
        });

        productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
        if (resultsCount) {
            resultsCount.textContent = String(productCards.length);
        }
    }

    renderProductCards();

    function getCardMeta(card) {
        const priceText = card.querySelector('.sale-price')?.textContent || '';
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
        const ratingText = card.querySelector('.rating-number')?.textContent || '';
        const productId = card.dataset.productId || '';
        const product = productCatalog[productId] || (productData.getProductByName ? productData.getProductByName(card.querySelector('.product-name')?.textContent.trim() || '') : null);
        const rating = (product && product.rating) || parseFloat(ratingText) || 0;

        return {
            name: product ? product.name : (card.querySelector('.product-name')?.textContent.trim() || ''),
            price: product ? (product.salePrice || product.price || price) : price,
            rating,
            category: (product && (product.categoryKey || product.category.toLowerCase().replace(/\s+/g, ''))) || (card.querySelector('.product-category')?.textContent.trim().toLowerCase().replace(/\s+/g, '') || ''),
            skintype: (product && product.skintype) || ['normal'],
            promotions: (product && product.promotions) || (card.querySelector('.discount-badge') ? ['sale'] : [])
        };
    }

    function toProductId(name) {
        if (!name) return 'lipstick';
        return productData.getProductIdByName ? productData.getProductIdByName(name) : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    function syncPriceInput() {
        if (!priceSlider) return;

        if (priceValue) {
            priceValue.textContent = priceSlider.value + ' EGP';
        }
    }

    function getSelectedValues(name) {
        return filterCheckboxes
            .filter(function (checkbox) { return checkbox.name === name && checkbox.checked; })
            .map(function (checkbox) { return checkbox.value; });
    }

    function clearActiveFilterTags() {
        if (!filterTagContainer) return;
        filterTagContainer.querySelectorAll('.dynamic-filter-tag').forEach(function (tag) {
            tag.remove();
        });
    }

    function renderActiveFilterTags(activeFilters) {
        if (!filterTagContainer) return;

        clearActiveFilterTags();

        const addTag = function (label, key, value) {
            const tag = document.createElement('span');
            tag.className = 'filter-tag dynamic-filter-tag';
            tag.dataset.key = key;
            tag.dataset.value = value;
            tag.innerHTML = label + ' <button type="button" aria-label="Remove filter">×</button>';
            tag.querySelector('button').addEventListener('click', function () {
                if (key === 'price') {
                    if (priceSlider) priceSlider.value = String(defaultPriceMax);
                    syncPriceInput();
                } else {
                    filterCheckboxes
                        .filter(function (checkbox) { return checkbox.name === key && checkbox.value === value; })
                        .forEach(function (checkbox) { checkbox.checked = false; });
                }
                applyFilters();
            });
            filterTagContainer.insertBefore(tag, clearAllLink || null);
        };

        if (activeFilters.priceMax !== defaultPriceMax) {
            addTag('Price: up to ' + activeFilters.priceMax + ' EGP', 'price', 'range');
        }

        activeFilters.categories.forEach(function (value) { addTag('Category: ' + value, 'category', value); });
        activeFilters.skinTypes.forEach(function (value) { addTag('Skin: ' + value, 'skintype', value); });
        activeFilters.promotions.forEach(function (value) { addTag('Promotion: ' + value, 'promotion', value); });

        if (activeFilterStatus) {
            const hasFilters = activeFilters.priceMax !== defaultPriceMax || activeFilters.categories.length > 0 || activeFilters.skinTypes.length > 0 || activeFilters.promotions.length > 0;
            activeFilterStatus.textContent = hasFilters ? 'Applied' : 'None';
        }
    }

    function applySorting(cards) {
        if (!sortSelect) return cards;

        const sorted = cards.slice();
        switch (sortSelect.value) {
            case 'Price: Low to High':
                sorted.sort(function (a, b) { return a.meta.price - b.meta.price; });
                break;
            case 'Price: High to Low':
                sorted.sort(function (a, b) { return b.meta.price - a.meta.price; });
                break;
            case 'Highest Rated':
                sorted.sort(function (a, b) { return b.meta.rating - a.meta.rating; });
                break;
            case 'Best Seller':
                sorted.sort(function (a, b) {
                    const aScore = a.meta.promotions.includes('bestseller') ? 1 : 0;
                    const bScore = b.meta.promotions.includes('bestseller') ? 1 : 0;
                    return bScore - aScore || b.meta.rating - a.meta.rating;
                });
                break;
            case 'Newest':
                sorted.sort(function (a, b) {
                    const aScore = a.meta.promotions.includes('new') ? 1 : 0;
                    const bScore = b.meta.promotions.includes('new') ? 1 : 0;
                    return bScore - aScore;
                });
                break;
            default:
                break;
        }
        return sorted;
    }

    function applyFilters() {
        if (!productsGrid) return;

        syncPriceInput();

        const activeFilters = {
            priceMax: priceSlider ? parseInt(priceSlider.value, 10) : defaultPriceMax,
            categories: getSelectedValues('category'),
            skinTypes: getSelectedValues('skintype'),
            promotions: getSelectedValues('promotion')
        };

        const visibleCards = [];
        productCards.forEach(function (card) {
            const meta = getCardMeta(card);
            const matchesPrice = meta.price <= activeFilters.priceMax;
            const matchesCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(meta.category);
            const matchesSkinType = activeFilters.skinTypes.length === 0 || activeFilters.skinTypes.some(function (skinType) { return meta.skintype.includes(skinType); });
            const matchesPromotion = activeFilters.promotions.length === 0 || activeFilters.promotions.every(function (promotion) { return meta.promotions.includes(promotion); });
            const matchesForcedProduct = !forcedProductId || card.dataset.productId === forcedProductId;

            const isVisible = matchesPrice && matchesCategory && matchesSkinType && matchesPromotion && matchesForcedProduct;
            card.classList.toggle('is-hidden', !isVisible);
            if (isVisible) {
                visibleCards.push({ card, meta });
            }
        });

        const sortedVisibleCards = applySorting(visibleCards);
        sortedVisibleCards.forEach(function (entry) {
            productsGrid.appendChild(entry.card);
        });

        if (resultsCount) {
            resultsCount.textContent = String(sortedVisibleCards.length);
        }

        renderActiveFilterTags(activeFilters);

        let emptyState = productsGrid.querySelector('.no-results');
        if (sortedVisibleCards.length === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'no-results';
                emptyState.textContent = 'No products match the selected filters.';
                productsGrid.appendChild(emptyState);
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    }

    if (priceSlider) {
        priceSlider.addEventListener('input', function () {
            syncPriceInput();
        });
    }

    filterCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            // Keep the control responsive without committing the filter until Apply is pressed.
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (productsGrid) {
        productsGrid.addEventListener('click', function (e) {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            if (wishlistBtn && productsGrid.contains(wishlistBtn)) {
                e.preventDefault();
                e.stopPropagation();
                wishlistBtn.textContent = wishlistBtn.textContent === '♡' ? '♥' : '♡';
                wishlistBtn.classList.toggle('active');
                return;
            }

            const card = e.target.closest('.product-card');
            if (!card || !productsGrid.contains(card)) return;

            const productId = card.dataset.productId || toProductId(card.querySelector('.product-name')?.textContent.trim() || '');
            window.location.href = 'product.html?product=' + encodeURIComponent(productId);
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            forcedProductId = null;
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (priceSlider) priceSlider.value = String(defaultPriceMax);
            syncPriceInput();
            if (sortSelect) sortSelect.value = 'Default Sorting';
            applyFilters();
            if (activeFilterStatus) activeFilterStatus.textContent = 'None';
        });
    }

    if (clearAllLink) {
        clearAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (clearFiltersBtn) clearFiltersBtn.click();
        });
    }

    // Remove Individual Filter Tags
    const filterTagButtons = document.querySelectorAll('.filter-tag button');
    filterTagButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.remove();
        });
    });

    // Pagination
    const paginationLinks = document.querySelectorAll('.pagination-item');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.pagination-item').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ─── Handle URL parameters for product name & category filtering ───
    (function() {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        
        if (categoryParam) {
            if (productCatalog[categoryParam]) {
                forcedProductId = categoryParam;
            } else {
                // Filter by general category - use checkbox filtering
                const categoryCheckbox = filterCheckboxes.find(function(checkbox) {
                    return checkbox.name === 'category' && checkbox.value === categoryParam;
                });
                
                if (categoryCheckbox) {
                    categoryCheckbox.checked = true;
                }
            }
        }
        
        // Handle promotion parameter for offers/discounts
        const promotionParam = params.get('promotion');
        if (promotionParam) {
            const promotionCheckbox = filterCheckboxes.find(function(checkbox) {
                return checkbox.name === 'promotion' && checkbox.value === promotionParam;
            });
            
            if (promotionCheckbox) {
                promotionCheckbox.checked = true;
            }
        }
        
        // Re-apply filters after setting URL parameters
        syncPriceInput();
        applyFilters();
    })();
})();
