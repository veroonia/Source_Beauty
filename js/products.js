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
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const filterCheckboxes = Array.from(document.querySelectorAll('.filter-checkbox input'));
    const filterTagContainer = document.querySelector('.filter-tags');
    const defaultPriceMax = 3000;

    const catalogMeta = {
        'Luxury Lipstick': { category: 'makeup', skintype: ['normal', 'combination'], promotions: ['sale', 'bestseller'], rating: 4.9 },
        'Silk Foundation': { category: 'makeup', skintype: ['normal', 'dry', 'combination'], promotions: ['sale', 'bestseller'], rating: 4.8 },
        'Eyeshadow Palette': { category: 'makeup', skintype: ['normal', 'oily', 'combination'], promotions: ['sale', 'new'], rating: 5.0 },
        'Hydrating Moisturizer': { category: 'skincare', skintype: ['dry', 'sensitive', 'normal'], promotions: ['sale', 'new'], rating: 5.0 },
        'Glow Serum': { category: 'skincare', skintype: ['dry', 'sensitive'], promotions: ['sale'], rating: 4.8 },
        'Smooth Body Cream': { category: 'bodycare', skintype: ['dry', 'sensitive', 'normal'], promotions: ['sale'], rating: 5.0 },
        'Essence Body Gel': { category: 'bodycare', skintype: ['oily', 'normal'], promotions: ['sale'], rating: 4.8 },
        'Luxe Lipgloss': { category: 'makeup', skintype: ['normal', 'combination'], promotions: ['sale', 'bestseller'], rating: 4.9 },
        'Precision Brow Pencil': { category: 'makeup', skintype: ['normal', 'oily'], promotions: ['sale', 'bestseller'], rating: 5.0 },
        'Silk Hair Serum': { category: 'haircare', skintype: ['normal', 'dry'], promotions: ['sale'], rating: 4.9 },
        'Nourishing Lip Balm': { category: 'makeup', skintype: ['dry', 'sensitive', 'normal'], promotions: ['sale', 'new'], rating: 4.7 },
        'Refreshing Face Mist': { category: 'skincare', skintype: ['oily', 'sensitive', 'normal'], promotions: ['sale', 'new'], rating: 4.8 }
    };

    function getCardMeta(card) {
        const name = card.querySelector('.product-name')?.textContent.trim() || '';
        const priceText = card.querySelector('.sale-price')?.textContent || '';
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
        const ratingText = card.querySelector('.rating-number')?.textContent || '';
        const rating = parseFloat(ratingText) || (catalogMeta[name]?.rating ?? 0);
        const base = catalogMeta[name] || {};

        return {
            name,
            price,
            rating,
            category: base.category || (card.querySelector('.product-category')?.textContent.trim().toLowerCase().replace(/\s+/g, '') || ''),
            skintype: base.skintype || ['normal'],
            promotions: base.promotions || (card.querySelector('.discount-badge') ? ['sale'] : [])
        };
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

            const isVisible = matchesPrice && matchesCategory && matchesSkinType && matchesPromotion;
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

    // Wishlist Button
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.textContent = this.textContent === '♡' ? '♥' : '♡';
            this.classList.toggle('active');
        });
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
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

    syncPriceInput();
    applyFilters();
})();
