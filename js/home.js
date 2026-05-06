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
    const productCatalog = {
        lipstick: {
            name: 'Luxury Lipstick',
            price: 25,
            originalPrice: 1500,
            salePrice: 750,
            discount: '50%',
            image: '../images/lipstick.jpg',
            alt: 'Lipstick',
            category: 'Beauty',
            description: 'Rich color with a smooth, comfortable finish. Perfect for everyday wear or a night out.',
            highlights: 'Long-wearing formula, creamy application, and a soft satin finish designed for a polished look.',
            shades: ['#d4a5a5', '#c84a52', '#b3004a', '#8b1538', '#5a0f2b', '#f4a0aa']
        },
        foundation: {
            name: 'Silk Foundation',
            price: 40,
            image: '../images/foundation.jpg',
            alt: 'Foundation',
            category: 'Complexion',
            description: 'Lightweight coverage with a natural satin finish that blends seamlessly.',
            highlights: 'Buildable coverage, breathable texture, and long-lasting comfort throughout the day.',
            shades: ['#f1d3c5', '#e8c1ae', '#d7a68e', '#c9866a', '#b66a53', '#9c503f']
        },
        palette: {
            name: 'Eyeshadow Palette',
            price: 35,
            originalPrice: 2700,
            salePrice: 1890,
            discount: '30%',
            image: '../images/eyeshadow.jpg',
            alt: 'Eyeshadow Palette',
            category: 'Eyes',
            description: 'A versatile palette with soft mattes and luminous metallic shades.',
            highlights: 'Blendable pigments, smooth payoff, and a curated range for day-to-night looks.',
            shades: ['#f6d6d1', '#d8b3c4', '#aa7d9a', '#7d5b73', '#5c4d6b', '#342b48']
        },
        moisturizer: {
            name: 'Hydrating Moisturizer',
            price: 1350,
            originalPrice: 1500,
            salePrice: 1350,
            discount: '10%',
            image: '../images/foundation.jpg',
            alt: 'Hydrating Moisturizer',
            category: 'Skincare',
            description: 'Daily moisturizer that helps keep skin soft, calm, and hydrated.',
            highlights: 'Comforting texture, long-lasting hydration, and skin-barrier friendly care.',
            shades: ['#f5f0e6', '#e8dcc8', '#d8c3a5', '#c2a07f', '#a8835f', '#8d6a47']
        },
        serum: {
            name: 'Glow Serum',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/lipstick.jpg',
            alt: 'Glow Serum',
            category: 'Skincare',
            description: 'Lightweight serum that boosts radiance and smooths dull texture.',
            highlights: 'Fast-absorbing formula, brightening support, and a healthy glow finish.',
            shades: ['#ffe0bd', '#ffd1a6', '#f7b989', '#e8a06f', '#d18856', '#b46a3f']
        },
        'smooth-body-cream': {
            name: 'Smooth Body Cream',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/eyeshadow.jpg',
            alt: 'Smooth Body Cream',
            category: 'Body Care',
            description: 'Rich body cream that helps relieve dryness and improve skin texture.',
            highlights: 'Deep nourishment, non-sticky feel, and all-day softness for body care.',
            shades: ['#f3dfcf', '#e8c7b2', '#d4a889', '#be896a', '#9f6b4f', '#7e4f3a']
        },
        'essence-body-gel': {
            name: 'Essence Body Gel',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/foundation.jpg',
            alt: 'Essence Body Gel',
            category: 'Body Care',
            description: 'Cooling body gel with a fresh finish for lightweight daily hydration.',
            highlights: 'Refreshing texture, quick absorption, and comfortable moisture support.',
            shades: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#2d6a4f']
        },
        lipgloss: {
            name: 'Luxe Lipgloss',
            price: 600,
            originalPrice: 1200,
            salePrice: 600,
            discount: '50%',
            image: '../images/lipstick.jpg',
            alt: 'Luxe Lipgloss',
            category: 'Makeup',
            description: 'High-shine lip gloss with a smooth, non-sticky feel.',
            highlights: 'Glass-like shine, comfortable wear, and soft color payoff.',
            shades: ['#ffd6e0', '#ffb3c6', '#ff8fab', '#fb6f92', '#d6336c', '#8f204d']
        },
        'precision-brow-pencil': {
            name: 'Precision Brow Pencil',
            price: 300,
            originalPrice: 600,
            salePrice: 300,
            discount: '50%',
            image: '../images/eyeshadow.jpg',
            alt: 'Precision Brow Pencil',
            category: 'Makeup',
            description: 'Ultra-fine brow pencil for natural definition and shape.',
            highlights: 'Precise tip, smooth glide, and long-wear brow definition.',
            shades: ['#f2e9e4', '#c9ada7', '#9a8c98', '#4a4e69', '#22223b', '#5b4636']
        },
        'silk-hair-serum': {
            name: 'Silk Hair Serum',
            price: 630,
            originalPrice: 1050,
            salePrice: 630,
            discount: '40%',
            image: '../images/foundation.jpg',
            alt: 'Silk Hair Serum',
            category: 'Hair Care',
            description: 'Smoothing serum that helps reduce frizz and boost shine.',
            highlights: 'Silky finish, lightweight protection, and frizz control for daily styling.',
            shades: ['#fefae0', '#faedcd', '#d4a373', '#bc8a5f', '#7f5539', '#5e412f']
        },
        'nourishing-lip-balm': {
            name: 'Nourishing Lip Balm',
            price: 360,
            originalPrice: 480,
            salePrice: 360,
            discount: '25%',
            image: '../images/lipstick.jpg',
            alt: 'Nourishing Lip Balm',
            category: 'Makeup',
            description: 'Softening lip balm that protects and hydrates dry lips.',
            highlights: 'Nourishing ingredients, smooth comfort, and everyday lip care.',
            shades: ['#ffe8d6', '#fcd5ce', '#fae1dd', '#f8edeb', '#e8e8e4', '#d8e2dc']
        },
        'refreshing-face-mist': {
            name: 'Refreshing Face Mist',
            price: 429,
            originalPrice: 660,
            salePrice: 429,
            discount: '35%',
            image: '../images/eyeshadow.jpg',
            alt: 'Refreshing Face Mist',
            category: 'Skincare',
            description: 'Hydrating facial mist for instant refresh and comfort.',
            highlights: 'Fine spray, quick hydration boost, and easy on-the-go refresh.',
            shades: ['#caf0f8', '#ade8f4', '#90e0ef', '#48cae4', '#00b4d8', '#0077b6']
        }
    };

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
