(function (global) {
    function slugify(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    var catalog = {
        lipstick: {
            id: 'lipstick',
            name: 'Nars Lipstick',
            price: 750,
            originalPrice: 1500,
            salePrice: 750,
            discount: '50%',
            image: '../images/p_lipstick.jpg',
            alt: 'Lipstick',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'combination'],
            promotions: ['sale', 'bestseller'],
            rating: 4.9,
            description: 'Rich color with a smooth, comfortable finish. Perfect for everyday wear or a night out.',
            highlights: 'Long-wearing formula, creamy application, and a soft satin finish designed for a polished look.',
            shades: ['#d4a5a5', '#c84a52', '#b3004a', '#8b1538', '#5a0f2b', '#f4a0aa']
        },
        foundation: {
            id: 'foundation',
            name: 'YSL Foundation',
            price: 1200,
            originalPrice: 1800,
            salePrice: 1200,
            discount: '33%',
            image: '../images/p_foundation.jpg',
            alt: 'Foundation',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'dry', 'combination'],
            promotions: ['bestseller'],
            rating: 4.8,
            description: 'Lightweight coverage with a natural satin finish that blends seamlessly.',
            highlights: 'Buildable coverage, breathable texture, and long-lasting comfort throughout the day.',
            shades: ['#f1d3c5', '#e8c1ae', '#d7a68e', '#c9866a', '#b66a53', '#9c503f']
        },
        brushes: {
            id: 'brushes',
            name: 'Sephora Brushes Set',
            price: 540,
            originalPrice: 720,
            salePrice: 540,
            discount: '25%',
            image: '../images/sephora brushes.jpg',
            alt: 'Brushes Set',
            category: 'Tools',
            categoryKey: 'tools',
            skintype: ['normal'],
            promotions: ['sale'],
            rating: 4.7,
            description: 'A versatile brush set for smooth application and blending.',
            highlights: 'Soft bristles, balanced handles, and a complete toolkit for makeup application.',
            shades: ['#e8d6c1', '#c8b19c', '#a58c77', '#7f6553', '#5a4639', '#2f261f']
        },

         'kiko-stick-blush': {
            id: 'kiko-stick-blush',
            name: 'KIKO Stick Blush',
            price: 650,
            originalPrice: 950,
            salePrice: 650,
            discount: '32%',
            image: '../images/kiko blush.jpg',
            alt: 'KIKO Stick Blush',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'dry', 'combination'],
            promotions: ['sale', 'bestseller'],
            rating: 4.8,
            description: 'Creamy stick blush that blends effortlessly for a natural flush of color.',
            highlights: 'Smooth texture, buildable pigment, and easy blending for everyday makeup looks.',
            shades: ['#f8c8c8', '#f4a6a6', '#e76f7a', '#d1495b', '#b23a48', '#872341']
        },

        'kiko-lipgloss': {
            id: 'kiko-lipgloss',
            name: 'KIKO Lipgloss',
            price: 600,
            originalPrice: 1200,
            salePrice: 600,
            discount: '50%',
            image: '../images/kiko lipgloss.jpg',
            alt: 'KIKO Lipgloss',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'combination'],
            promotions: ['sale', 'bestseller'],
            rating: 4.9,
            description: 'High-shine lip gloss with a smooth, non-sticky finish.',
            highlights: 'Glass-like shine, lightweight feel, and comfortable long-lasting wear.',
            shades: ['#ffd6e0', '#ffb3c6', '#ff8fab', '#fb6f92', '#d6336c', '#8f204d']
        },

        'kiko-powder-blush': {
            id: 'kiko-powder-blush',
            name: 'KIKO Powder Blush',
            price: 700,
            originalPrice: 1000,
            salePrice: 700,
            discount: '30%',
            image: '../images/kiko powder blush.jpg',
            alt: 'KIKO Powder Blush',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'oily', 'combination'],
            promotions: ['new'],
            rating: 4.7,
            description: 'Soft powder blush that delivers a smooth and radiant pop of color.',
            highlights: 'Blendable formula, silky texture, and natural-looking matte finish.',
            shades: ['#f7cad0', '#f4acb7', '#ff8fab', '#e5989b', '#b56576', '#6d6875']
        },
        skincare: {
            id: 'skincare',
            name: 'Skincare Kit',
            price: 900,
            originalPrice: 1200,
            salePrice: 900,
            discount: '25%',
            image: '../images/kit.jpg',
            alt: 'Skincare Kit',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['new'],
            rating: 4.8,
            description: 'A curated skincare set for a simple, everyday routine.',
            highlights: 'Balanced essentials, easy layering, and a practical routine-friendly collection.'
        },
        moisturizer: {
            id: 'moisturizer',
            name: 'Hydrating Moisturizer',
            price: 1350,
            originalPrice: 1500,
            salePrice: 1350,
            discount: '10%',
            image: '../images/cerave.jpg',
            alt: 'Hydrating Moisturizer',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['sale', 'new'],
            rating: 5.0,
            description: 'Daily moisturizer that helps keep skin soft, calm, and hydrated.',
            highlights: 'Comforting texture, long-lasting hydration, and skin-barrier friendly care.'
        },
        serum: {
            id: 'serum',
            name: 'Ordinary Serum',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/ordinary.jpg',
            alt: 'Ordinary Serum',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive'],
            promotions: ['sale'],
            rating: 4.8,
            description: 'Lightweight serum that boosts radiance and smooths dull texture.',
            highlights: 'Fast-absorbing formula, brightening support, and a healthy glow finish.'
        },
        'homecourt-body-cream': {
            id: 'homecourt-body-cream',
            name: 'Homecourt Body Cream',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/body_cream.jpg',
            alt: 'Homecourt Body Cream',
            category: 'Body Care',
            categoryKey: 'bodycare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['sale'],
            rating: 5.0,
            description: 'Rich body cream that helps relieve dryness and improve skin texture.',
            highlights: 'Deep nourishment, non-sticky feel, and all-day softness for body care.',
            shades: ['#f3dfcf', '#e8c7b2', '#d4a889', '#be896a', '#9f6b4f', '#7e4f3a']
        },
        'essence-shower-gel': {
            id: 'essence-shower-gel',
            name: 'Essence Shower Gel',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/essence_shower.jpg',
            alt: 'Essence Shower Gel',
            category: 'Body Care',
            categoryKey: 'bodycare',
            skintype: ['oily', 'normal'],
            promotions: ['sale'],
            rating: 4.8,
            description: 'Cooling body gel with a fresh finish for lightweight daily hydration.',
            highlights: 'Refreshing texture, quick absorption, and comfortable moisture support.'
        },
        'precision-brow-pencil': {
            id: 'precision-brow-pencil',
            name: 'Rare Beauty Precision Brow Pencil',
            price: 300,
            originalPrice: 600,
            salePrice: 300,
            discount: '50%',
            image: '../images/rare_brow.jpg',
            alt: 'Rare Beauty Precision Brow Pencil',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'oily'],
            promotions: ['sale', 'bestseller'],
            rating: 5.0,
            description: 'Ultra-fine brow pencil for natural definition and shape.',
            highlights: 'Precise tip, smooth glide, and long-wear brow definition.',
            shades: ['#f2e9e4', '#c9ada7', '#9a8c98', '#4a4e69', '#22223b', '#5b4636']
        }
    };

    var nameToId = {};
    Object.keys(catalog).forEach(function (id) {
        nameToId[catalog[id].name] = id;
    });

    var aliases = {
        'Luxury Lipstick': 'lipstick',
        'Luxe Lipgloss': 'lipgloss',
        'Precision Brow Pencil': 'precision-brow-pencil',
        'Maybelline contour palette': 'precision-brow-pencil'
    };

    function getProduct(productId) {
        return catalog[productId] || catalog.lipstick;
    }

    function getProductIdByName(name) {
        return nameToId[name] || aliases[name] || slugify(name);
    }

    function getProductByName(name) {
        return catalog[getProductIdByName(name)] || null;
    }

    global.SB_PRODUCT_DATA = {
        catalog: catalog,
        getProduct: getProduct,
        getProductIdByName: getProductIdByName,
        getProductByName: getProductByName,
        slugify: slugify
    };

    global.SB_PRODUCTS = catalog;
})(window);
