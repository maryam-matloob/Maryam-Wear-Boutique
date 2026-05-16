# MaryamWear Boutique
### Web Technology Semester Project — 4th Semester

A fully functional Pakistani fashion e-commerce web application built with
**HTML5, CSS3, Vanilla JavaScript (ES6 Modules)** and **Bootstrap 5**.
Data is persisted using the browser's **localStorage** API — no backend required.

---

## How to Run

> **Important:** This project uses ES Modules (`type="module"`).
> You **must** open it through a local server — not by double-clicking the HTML file.

### Option 1 — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://127.0.0.1:5500`

### Option 2 — Python (no install needed on most machines)
```bash
cd maryam-wear-boutique
python -m http.server 5500
# then open http://localhost:5500
```

---

## Project Structure

```
maryam-wear-boutique/
├── index.html              ← Homepage (entry point)
├── 404.html                ← Custom 404 page
├── css/
│   ├── style.css           ← Global design system & components
│   ├── responsive.css      ← Mobile breakpoints
│   └── admin.css           ← Admin panel layout
├── js/
│   ├── db.js               ← localStorage CRUD engine  ★ MAIN CRUD FILE
│   ├── ui.js               ← Shared navbar, footer, toast helpers
│   ├── admin.js            ← Admin panel logic (unused — logic in admin.html)
│   ├── products.js         ← (placeholder)
│   ├── cart.js             ← (placeholder)
│   ├── auth.js             ← (placeholder)
│   └── checkout.js         ← (placeholder)
├── images/
│   └── products/           ← Add product images here
└── pages/
    ├── products.html       ← Shop catalog with filters & search
    ├── cart.html           ← Shopping cart with coupon support
    ├── checkout.html       ← Order form with multiple payment methods
    ├── login.html          ← Customer login, register & dashboard
    └── admin.html          ← Admin panel (password: admin123)
```

---

## CRUD Operations (db.js)

The `js/db.js` file is the core database layer. It exposes four pure CRUD functions:

| Function | Operation | Description |
|---|---|---|
| `create(collection, data)` | **C**reate | Adds a new record with auto-generated ID |
| `getAll(collection)` | **R**ead | Returns all records from a collection |
| `getById(collection, id)` | **R**ead | Finds a single record by ID |
| `update(collection, id, data)` | **U**pdate | Merges new data into an existing record |
| `remove(collection, id)` | **D**elete | Removes a record by ID |

These functions are used across all pages as imported ES modules.

---

## Features

### Store (Customer Side)
- **Homepage** — hero banner, category cards, featured products, sale section
- **Product Catalog** — search, category filters, price slider, size filter, sort, grid/list view
- **Product Detail Modal** — full info, sizes, colours, stock count
- **Shopping Cart** — qty controls, item removal, coupon codes, free delivery threshold
- **Checkout** — delivery form with Pakistani cities, 4 payment methods (COD, JazzCash, EasyPaisa, Card)
- **Customer Account** — register, login, password strength meter, order history dashboard
- **Wishlist** — save items, move to cart from wishlist section

### Admin Panel (password: `admin123`)
- Dashboard stats (total products, in-stock, on-sale, orders)
- **Add product** — full form with validation
- **Edit product** — pre-filled form
- **Delete product** — confirmation modal
- **Table search** — filter products by name or category
- **Orders tab** — view all placed orders

### UX & Design
- Mobile-first responsive layout (Bootstrap 5)
- Sticky navbar with live cart badge counter
- Toast notification system
- WhatsApp float button
- Scroll-to-top button
- Announcement bar with free delivery info
- Custom 404 page

---

## Coupon Codes (for testing)

| Code | Discount |
|---|---|
| `SAVE10` | 10% off |
| `SAVE20` | 20% off |
| `FLAT500` | Rs. 500 off |
| `MARYAM` | 15% off |

Free delivery on orders above **Rs. 2,999**.

---

## Testing Checklist

- [ ] Homepage loads with 12 products
- [ ] Shop page filters work (category, price, size, search)
- [ ] Add to cart → cart badge updates
- [ ] Cart page shows items, qty controls work
- [ ] Coupon code applies correctly
- [ ] Checkout form validates and saves order
- [ ] Admin login with `admin123`
- [ ] Admin: Add a new product → appears in shop
- [ ] Admin: Edit a product → changes saved
- [ ] Admin: Delete a product → removed from table
- [ ] Register new customer → login → see order history
- [ ] 404 page: visit `404.html`

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure & semantics |
| CSS3 | Custom design system, animations |
| Bootstrap 5 | Grid, responsive layout, modals |
| Vanilla JavaScript (ES6) | DOM manipulation, events, modules |
| localStorage API | Persistent data storage (database) |
| Google Fonts | Playfair Display + Nunito typography |

---

## Student Information

- **Project:** MaryamWear Boutique  
- **Course:** Web Technology  
- **Semester:** 4th Semester  
- **Technology Stack:** HTML + CSS + Vanilla JS + Bootstrap 5  
- **Database:** Browser localStorage (no backend required)