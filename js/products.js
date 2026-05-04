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
    // Price Slider
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');

    if (minPriceSlider && maxPriceSlider) {
        function updatePriceSliders() {
            if (parseInt(minPriceSlider.value) > parseInt(maxPriceSlider.value)) {
                minPriceSlider.value = maxPriceSlider.value;
            }
            if (parseInt(maxPriceSlider.value) < parseInt(minPriceSlider.value)) {
                maxPriceSlider.value = minPriceSlider.value;
            }
            minPriceInput.value = minPriceSlider.value;
            maxPriceInput.value = maxPriceSlider.value;
        }

        minPriceSlider.addEventListener('input', updatePriceSliders);
        maxPriceSlider.addEventListener('input', updatePriceSliders);
        minPriceInput.addEventListener('input', function() {
            minPriceSlider.value = this.value;
            updatePriceSliders();
        });
        maxPriceInput.addEventListener('input', function() {
            maxPriceSlider.value = this.value;
            updatePriceSliders();
        });
    }

    // Filter Checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Here you would typically filter products
            console.log('Filter changed:', this.name, this.value, this.checked);
        });
    });

    // Sort Select
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort changed to:', this.value);
            // Sorting logic would go here
        });
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

    // Clear Filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            minPriceSlider.value = 10;
            maxPriceSlider.value = 200;
            minPriceInput.value = 10;
            maxPriceInput.value = 200;
        });
    }

    // Clear All Link
    const clearAllLink = document.querySelector('.clear-all-link');
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
})();
