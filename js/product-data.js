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
        lipgloss: {
            id: 'lipgloss',
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
            description: 'High-shine lip gloss with a smooth, non-sticky feel.',
            highlights: 'Glass-like shine, comfortable wear, and soft color payoff.',
            shades: ['#ffd6e0', '#ffb3c6', '#ff8fab', '#fb6f92', '#d6336c', '#8f204d']
        },
        skincare: {
            id: 'skincare',
            name: 'Skincare Kit',
            price: 900,
            originalPrice: 1200,
            salePrice: 900,
            discount: '25%',
            image: '../images/skincare.jpg',
            alt: 'Skincare Kit',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['new'],
            rating: 4.8,
            description: 'A curated skincare set for a simple, everyday routine.',
            highlights: 'Balanced essentials, easy layering, and a practical routine-friendly collection.',
            shades: ['#f8efe5', '#eddcc7', '#d9c0a2', '#c29f7c', '#9f7a58', '#7a5a3f']
        },
        moisturizer: {
            id: 'moisturizer',
            name: 'Hydrating Moisturizer',
            price: 1350,
            originalPrice: 1500,
            salePrice: 1350,
            discount: '10%',
            image: '../images/skincare.jpg',
            alt: 'Hydrating Moisturizer',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['sale', 'new'],
            rating: 5.0,
            description: 'Daily moisturizer that helps keep skin soft, calm, and hydrated.',
            highlights: 'Comforting texture, long-lasting hydration, and skin-barrier friendly care.',
            shades: ['#f5f0e6', '#e8dcc8', '#d8c3a5', '#c2a07f', '#a8835f', '#8d6a47']
        },
        serum: {
            id: 'serum',
            name: 'Glow Serum',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/skincare.jpg',
            alt: 'Glow Serum',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['dry', 'sensitive'],
            promotions: ['sale'],
            rating: 4.8,
            description: 'Lightweight serum that boosts radiance and smooths dull texture.',
            highlights: 'Fast-absorbing formula, brightening support, and a healthy glow finish.',
            shades: ['#ffe0bd', '#ffd1a6', '#f7b989', '#e8a06f', '#d18856', '#b46a3f']
        },
        'smooth-body-cream': {
            id: 'smooth-body-cream',
            name: 'Smooth Body Cream',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/skincare.jpg',
            alt: 'Smooth Body Cream',
            category: 'Body Care',
            categoryKey: 'bodycare',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['sale'],
            rating: 5.0,
            description: 'Rich body cream that helps relieve dryness and improve skin texture.',
            highlights: 'Deep nourishment, non-sticky feel, and all-day softness for body care.',
            shades: ['#f3dfcf', '#e8c7b2', '#d4a889', '#be896a', '#9f6b4f', '#7e4f3a']
        },
        'essence-body-gel': {
            id: 'essence-body-gel',
            name: 'Essence Body Gel',
            price: 900,
            originalPrice: 1800,
            salePrice: 900,
            discount: '50%',
            image: '../images/skincare.jpg',
            alt: 'Essence Body Gel',
            category: 'Body Care',
            categoryKey: 'bodycare',
            skintype: ['oily', 'normal'],
            promotions: ['sale'],
            rating: 4.8,
            description: 'Cooling body gel with a fresh finish for lightweight daily hydration.',
            highlights: 'Refreshing texture, quick absorption, and comfortable moisture support.',
            shades: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#2d6a4f']
        },
        'precision-brow-pencil': {
            id: 'precision-brow-pencil',
            name: 'Maybelline Contour Palette',
            price: 300,
            originalPrice: 600,
            salePrice: 300,
            discount: '50%',
            image: '../images/eyeshadow.jpg',
            alt: 'Maybelline Contour Palette',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['normal', 'oily'],
            promotions: ['sale', 'bestseller'],
            rating: 5.0,
            description: 'Ultra-fine brow pencil for natural definition and shape.',
            highlights: 'Precise tip, smooth glide, and long-wear brow definition.',
            shades: ['#f2e9e4', '#c9ada7', '#9a8c98', '#4a4e69', '#22223b', '#5b4636']
        },
        'silk-hair-serum': {
            id: 'silk-hair-serum',
            name: 'Silk Hair Serum',
            price: 630,
            originalPrice: 1050,
            salePrice: 630,
            discount: '40%',
            image: '../images/skincare.jpg',
            alt: 'Silk Hair Serum',
            category: 'Hair Care',
            categoryKey: 'haircare',
            skintype: ['normal', 'dry'],
            promotions: ['sale'],
            rating: 4.9,
            description: 'Smoothing serum that helps reduce frizz and boost shine.',
            highlights: 'Silky finish, lightweight protection, and frizz control for daily styling.',
            shades: ['#fefae0', '#faedcd', '#d4a373', '#bc8a5f', '#7f5539', '#5e412f']
        },
        'nourishing-lip-balm': {
            id: 'nourishing-lip-balm',
            name: 'Nourishing Lip Balm',
            price: 360,
            originalPrice: 480,
            salePrice: 360,
            discount: '25%',
            image: '../images/p_lipstick.jpg',
            alt: 'Nourishing Lip Balm',
            category: 'Makeup',
            categoryKey: 'makeup',
            skintype: ['dry', 'sensitive', 'normal'],
            promotions: ['sale', 'new'],
            rating: 4.7,
            description: 'Softening lip balm that protects and hydrates dry lips.',
            highlights: 'Nourishing ingredients, smooth comfort, and everyday lip care.',
            shades: ['#ffe8d6', '#fcd5ce', '#fae1dd', '#f8edeb', '#e8e8e4', '#d8e2dc']
        },
        'refreshing-face-mist': {
            id: 'refreshing-face-mist',
            name: 'Refreshing Face Mist',
            price: 429,
            originalPrice: 660,
            salePrice: 429,
            discount: '35%',
            image: '../images/skincare.jpg',
            alt: 'Refreshing Face Mist',
            category: 'Skincare',
            categoryKey: 'skincare',
            skintype: ['oily', 'sensitive', 'normal'],
            promotions: ['sale', 'new'],
            rating: 4.8,
            description: 'Hydrating facial mist for instant refresh and comfort.',
            highlights: 'Fine spray, quick hydration boost, and easy on-the-go refresh.',
            shades: ['#caf0f8', '#ade8f4', '#90e0ef', '#48cae4', '#00b4d8', '#0077b6']
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
