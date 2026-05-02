// Auto-scroll featured strip; pauses on hover/focus
(function(){
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
    const addToBagButton = document.querySelector('[data-action="add-to-bag"]');

    if (productName && productPrice && productDescription && productImage) {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || 'Luxury Lipstick';
        const price = params.get('price') || '25';
        const image = params.get('image') || 'images/lipstick.jpg';
        const alt = params.get('alt') || name;
        const description = params.get('description') || 'Rich color with a smooth, comfortable finish.';

        productName.textContent = name;
        productPrice.textContent = `$${price}`;
        productDescription.textContent = description;
        productImage.src = image;
        productImage.alt = alt;

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
