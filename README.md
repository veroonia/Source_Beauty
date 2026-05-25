<div align="center">

# 💄 Source Beauty

**A modern, fully static beauty e-commerce experience built with vanilla HTML, CSS & JavaScript.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![No Build Step](https://img.shields.io/badge/No%20Build%20Step-✓-brightgreen?style=flat-square)

</div>

---
## 🌟 Overview

Source Beauty is a frontend e-commerce website developed as part of a **Project Management course** project.

The core problem it solves is one many shoppers face: **finding the right makeup shade to match their skin tone**. To tackle this, the app integrates an **AI-powered shade-matching feature** — when a user selects their skin shade, an API intelligently suggests the most suitable product shades, making makeup shopping more personalized, accurate, and effortless for women.

Beyond the shade-matching engine, the site delivers a complete shopping experience — from browsing a beauty catalog to checkout — alongside an admin dashboard and quality-analysis flowcharts, all built with zero backend dependencies.
---

## ✨ Features

| Area | Details |
|------|---------|
| 🏠 **Home** | Hero section, featured products, sale banner, and navigation |
| 🛍️ **Product Catalog** | Beauty, skincare, and makeup items with filtering by category |
| 📄 **Product Detail** | Individual product pages with descriptions, ratings, and shade options |
| 🛒 **Shopping Cart** | Quantity updates, order totals, promo code area, and checkout link |
| 💳 **Checkout** | Full checkout flow page |
| 🔐 **Authentication** | Login and signup screens |
| 🖥️ **Admin Dashboard** | Manage products, orders, users, and analytics |
| 📊 **Quality Charts** | Histogram defect frequency and Pareto quality analysis via Chart.js |

---

## 🗂️ Project Structure

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

```
---

## 🚀 Getting Started

No server, no build step, no dependencies.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/source-beauty.git

# 2. Open the project folder
cd source-beauty

# 3. Open the homepage in your browser
open views/home.html
```

> **Tip:** You can also double-click `views/home.html` in your file explorer to open it directly.

---

## 📄 Pages

| Page | Path | Description |
|------|------|-------------|
| 🏠 Home | `views/home.html` | Main landing page |
| 🛍️ Products | `views/products.html` | Full product catalog |
| 📦 Product Detail | `views/product.html` | Single product view |
| 🛒 Cart | `views/cart.html` | Shopping cart |
| 💳 Checkout | `views/checkout.html` | Checkout flow |
| 🔑 Login | `views/login.html` | Login screen |
| 📝 Sign Up | `views/signup.html` | Registration screen |
| 🖥️ Admin | `views/admin.html` | Admin dashboard |
| 📊 Histogram | `flowcharts/histogram-frequency.html` | Defect frequency chart |
| 📈 Pareto | `flowcharts/pareto-quality.html` | Quality analysis chart |

---

## 🗃️ Product Data

All product information is centralized in a single file:
This includes: names, prices, discounts, categories, images, descriptions, ratings, promotions, and shade options. To add or modify products, edit this file only.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup and page structure
- **CSS3** — Custom styling per section/page
- **JavaScript (ES6)** — Cart logic, product rendering, UI interactions
- **[Chart.js](https://www.chartjs.org/)** (via CDN) — Quality analysis visualizations

---

## 🔮 Roadmap

- [ ] Backend integration for real orders and user accounts
- [ ] Database-connected authentication
- [ ] Payment gateway (Stripe / PayPal)
- [ ] Product search and advanced filtering
- [ ] Live data in admin dashboard
- [ ] Responsive design testing across more screen sizes
- [ ] Wishlist / favorites functionality

