# Source Beauty

Source Beauty is a static beauty e-commerce website built with HTML, CSS, and JavaScript. It includes a customer shopping experience, product catalog, cart and checkout pages, authentication screens, an admin dashboard, and quality-analysis flowcharts.

## Features

- Home page with hero section, featured products, sale banner, and navigation
- Product catalog with beauty, skincare, and makeup items
- Individual product detail pages
- Shopping cart with quantity updates, totals, promo code area, and checkout link
- Checkout page
- Login and signup pages
- Admin dashboard interface for products, orders, users, and analytics
- Reusable navigation and footer HTML files
- Product data managed in JavaScript
- Flowchart pages for:
  - Histogram defect frequency analysis
  - Pareto quality analysis

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Chart.js CDN for chart visualizations

## Project Structure

```text
Source_Beauty/
├── css/
│   ├── admin.css
│   ├── auth.css
│   ├── cart.css
│   ├── home.css
│   └── products-catalog.css
├── flowcharts/
│   ├── histogram-frequency.html
│   └── pareto-quality.html
├── images/
│   └── product and banner images
├── js/
│   ├── admin.js
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── home.js
│   ├── product-data.js
│   ├── product-page.js
│   └── products.js
└── views/
    ├── admin.html
    ├── cart.html
    ├── checkout.html
    ├── footer.html
    ├── home.html
    ├── login.html
    ├── nav.html
    ├── product.html
    ├── products.html
    └── signup.html

How to Run
This project does not require a backend server or build step.

Download or clone the repository.
Open the project folder.
Open views/home.html in your browser.
You can also navigate directly to other pages such as:

views/products.html
views/cart.html
views/checkout.html
views/admin.html
flowcharts/histogram-frequency.html
flowcharts/pareto-quality.html
Main Pages
Page	Description
views/home.html	Main landing page for Source Beauty
views/products.html	Product catalog page
views/product.html	Single product details page
views/cart.html	Shopping cart page
views/checkout.html	Checkout page
views/login.html	Login page
views/signup.html	Signup page
views/admin.html	Admin dashboard
flowcharts/histogram-frequency.html	Histogram chart for defect frequency
flowcharts/pareto-quality.html	Pareto chart for quality analysis
Product Data
Product information is stored in:

js/product-data.js
This file contains product names, prices, discounts, categories, images, descriptions, ratings, promotions, and shade options.

Notes
The project is currently frontend-only.
Cart and page interactions are handled with JavaScript.
Product images are stored locally in the images/ folder.
Chart pages use Chart.js through a CDN.
Future Improvements
Add backend support for real orders and users
Connect authentication to a database
Add payment gateway integration
Add product search and advanced filters
Improve admin dashboard with live data
Add responsive testing across more screen sizes
