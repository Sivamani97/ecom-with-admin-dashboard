# 🏆 Aruna Radios & Furniture – Official Website Project

> **"Quality Products. Best Prices. Trusted Since 1949."**  
> Serving Jayankondam and surrounding regions in Tamil Nadu for over **75 years**.

---

## 📌 Project Overview

**Aruna Radios & Furniture** is a modern, high-performance e-commerce and store front web application built for Jayankondam's premier home electronics, appliances, and luxury furniture showroom.

The website provides a premium digital showcase of over 75+ years of customer trust, featuring rich product catalogs, authorized brand partnerships, customer reviews, seasonal offer popups, direct WhatsApp ordering, and complete SEO optimization.

---

## ✨ Key Features & Enhancements Completed

### 🛒 1. Product Catalog & Category Showcase
- **Comprehensive Product Index**: Displays Smart TVs, Inverter Refrigerators, Front & Top Load Washing Machines, Air Conditioners, Bedroom & Living Sets, Orthopedic Mattresses, Kitchen Appliances, and Water Heaters.
- **Dynamic Category Filtering**: Instant filtering by category (Televisions, Refrigerators, Washing Machines, Air Conditioning, Home Furniture, Kitchen & Appliances).
- **Search & Price Range Filter**: Real-time product search bar with dynamic min/max price sliders.
- **Quick Product Details Modal**: Detailed specification views with image viewer, key features, warranty info, and direct WhatsApp inquiry integration.

### 🌟 2. Authorized Brand Partners Marquee
- **Real Circular SVG Brand Logos**: Integrated official rounded circular vector logo badges for all 20 authorized brand partners matching official brand identity:
  - *Whirlpool, LG, Samsung, Voltas, Blue Star, Daikin, Godrej, Duroflex, Crompton, Usha, Preethi, Butterfly, Prestige, V-Guard, Venus, Havells, Panasonic, TCL, Intex, Milton.*
- **Seamless 60fps Infinite Marquee**: Pause-on-hover dual-track animation with retina crisp rendering.

### 📱 3. Direct Contact & Multi-Channel Ordering
- **One-Click WhatsApp Orders**: Instant WhatsApp inquiry buttons on every product card pre-filled with product name, price, and showroom details.
- **Click-to-Call**: Direct phone links for showroom sales desks (`+91 94432 54321`).
- **Google Maps Integration**: Interactive map embed and one-click turn-by-turn directions to the Jayankondam showroom (Opposite Taluk Office).
- **Social Media Connectivity**: Direct link to official Instagram profile (`@aruna_radios_furnitures`).

### 🎉 4. Festival Offer Popup & Promotional Banners
- **Configurable Seasonal Popup**: High-converting promo modal featuring festival discounts (Up to 35% OFF, Zero-cost EMI, and Free Local Delivery).
- **Control Toggle**: Easily enabled/disabled via `SHOW_OFFER_POPUP` flag in `src/config/siteConfig.js`.

### 🌓 5. Theme System (Dark / Light Mode)
- **Glassmorphism Design System**: Modern dark & light mode switcher stored in `localStorage` for user preference persistence.
- **Fluid Micro-Animations**: Smooth theme transitions, elevated card hover states, and gold gradient accents.

### 🔍 6. Comprehensive Technical SEO & Performance
- **Dynamic SEO Component**: Per-page custom Meta Title, Meta Description, Canonical URLs, and Open Graph tags.
- **Structured Data (JSON-LD)**: Schema.org `LocalBusiness` and `Store` markup for Google Rich Results.
- **Robots.txt & Sitemap.xml**: Full sitemap generated for search engine indexing.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS3 (Custom Design System with CSS Variables)
- **Icons**: Lucide React
- **Asset Processing**: Optimized Vector SVGs & PNG assets

---

## 📁 Directory & File Structure

```
Aruna Electronics/
├── public/
│   ├── brands/                # Official rounded circular SVG logos (20 brands)
│   ├── logo.png               # High-res official business logo
│   ├── favicon.svg            # Site favicon
│   ├── robots.txt             # Search engine crawling rules
│   └── sitemap.xml            # XML sitemap for SEO
├── src/
│   ├── components/            # Reusable UI Components
│   │   ├── Navbar.jsx         # Header & navigation with theme toggle
│   │   ├── Footer.jsx         # Footer with address, hours & social links
│   │   ├── BrandMarquee.jsx   # Infinite brand logo marquee
│   │   ├── OfferPopup.jsx     # Seasonal promo modal
│   │   ├── ProductCard.jsx    # Product item card with WhatsApp order CTA
│   │   ├── ProductModal.jsx   # Expanded product details dialog
│   │   ├── SplashScreen.jsx   # Welcome brand splash animation
│   │   ├── SocialIcons.jsx    # SVG Social Media Icons (Instagram, WhatsApp, etc.)
│   │   ├── ThemeToggle.jsx    # Dark/Light theme switch button
│   │   ├── BackButton.jsx     # Page navigation utility
│   │   └── SEO.jsx            # Dynamic document head & metadata manager
│   ├── config/
│   │   └── siteConfig.js      # Central business metadata, contact details & switches
│   ├── context/
│   │   └── ThemeContext.jsx   # Global dark/light theme context provider
│   ├── data/
│   │   ├── brands.js          # Authorized brand definitions & tags
│   │   ├── products.js        # Showcase product items & categories
│   │   └── reviews.js         # Verified customer testimonials
│   ├── pages/
│   │   ├── HomePage.jsx       # Main landing page
│   │   ├── ProductsPage.jsx   # Filterable product catalog
│   │   ├── AboutPage.jsx      # 75+ year store history & brand story
│   │   ├── OffersPage.jsx     # Dedicated festival offers & deals page
│   │   └── ContactPage.jsx    # Map, address, hours & inquiry form
│   ├── styles/
│   │   └── index.css          # Main stylesheet & CSS variable tokens
│   ├── App.jsx                # Application root with routing & layout wrappers
│   └── main.jsx               # Entry point
├── index.html                 # Main HTML template with Google Fonts & JSON-LD
├── vite.config.js             # Vite bundler configuration
├── vercel.json                # Vercel deployment routes config
└── package.json               # Project dependencies and scripts
```

---

## 🚀 How to Run the Project Locally

### 1. Prerequisite
Ensure you have **Node.js** (v18 or higher) installed on your system.

### 2. Navigate to Directory
```bash
cd "c:\Users\tamil\OneDrive\Desktop\Aruna Electronics"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📞 Business Info & Configuration

All business metadata, contact numbers, address details, and Instagram handles can be managed centrally in [`src/config/siteConfig.js`](file:///c:/Users/tamil/OneDrive/Desktop/Aruna%20Electronics/src/config/siteConfig.js):

- **Store Name**: Aruna Radios & Furniture
- **Phone**: +91 94432 54321
- **WhatsApp**: 919443254321
- **Instagram**: `@aruna_radios_furnitures`
- **Location**: Kachirayanpalayam Road Junction, Near Bus Stand, Jayankondam, Tamil Nadu - 621802.
