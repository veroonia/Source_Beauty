// Auto-scroll featured strip; pauses on hover/focus
(function(){
    const productCatalog = {
        lipstick: {
            name: 'Luxury Lipstick',
            price: 25,
            image: 'images/lipstick.jpg',
            alt: 'Lipstick',
            category: 'Beauty',
            description: 'Rich color with a smooth, comfortable finish. Perfect for everyday wear or a night out.',
            highlights: 'Long-wearing formula, creamy application, and a soft satin finish designed for a polished look.',
            shades: ['#d4a5a5', '#c84a52', '#b3004a', '#8b1538', '#5a0f2b', '#f4a0aa']
        },
        foundation: {
            name: 'Silk Foundation',
            price: 40,
            image: 'images/foundation.jpg',
            alt: 'Foundation',
            category: 'Complexion',
            description: 'Lightweight coverage with a natural satin finish that blends seamlessly.',
            highlights: 'Buildable coverage, breathable texture, and long-lasting comfort throughout the day.',
            shades: ['#f1d3c5', '#e8c1ae', '#d7a68e', '#c9866a', '#b66a53', '#9c503f']
        },
        palette: {
            name: 'Eyeshadow Palette',
            price: 35,
            image: 'images/eyeshadow.jpg',
            alt: 'Eyeshadow Palette',
            category: 'Eyes',
            description: 'A versatile palette with soft mattes and luminous metallic shades.',
            highlights: 'Blendable pigments, smooth payoff, and a curated range for day-to-night looks.',
            shades: ['#f6d6d1', '#d8b3c4', '#aa7d9a', '#7d5b73', '#5c4d6b', '#342b48']
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
                addToBagButton.textContent = 'Added to bag';
            });
        }
    }

    const shadeCirclesContainer = document.querySelector('.shade-circles');
    if (shadeCirclesContainer) {
        const shadesData = shadeCirclesContainer.dataset.shades;
        if (shadesData) {
            const shades = shadesData.split(',');
            shadeCirclesContainer.innerHTML = '';
            shades.forEach(function(shadeColor) {
                const randomNumber = Math.floor(Math.random() * 900) + 100;
                const circle = document.createElement('div');
                circle.className = 'shade-circle';
                circle.style.backgroundColor = shadeColor;
                circle.textContent = randomNumber;
                circle.title = `Shade #${randomNumber}`;
                shadeCirclesContainer.appendChild(circle);
            });
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
