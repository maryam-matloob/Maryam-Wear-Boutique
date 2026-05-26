# 🌸 Maryam Wear Boutique
### Web Technologies SP26 — Capstone Project
**Student:** [Maryam Matloob]  
**Roll No:** [F24BDOCS1M01054]  
**Section:** [2M]

---

## 📌 Project Description

Maryam Wear Boutique is a women's fashion e-commerce web application built for the Web Technologies capstone. Customers can browse the clothing collection, filter by category, add items to a cart, and place orders. The admin panel provides full product and order management with live statistics.

---

## 🛠️ Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Markup     | HTML5 (semantic tags)             |
| Styling    | Bootstrap 5.3 + Custom CSS        |
| JavaScript | Plain JS (ES6+, no frameworks)    |
| Backend    | JSON Server (mock REST API)       |
| Data       | JSON (via fetch + async/await)    |

---

## 📁 Project Structure

```
MaryamWearBoutique/
├── index.html     → Customer storefront (browse, filter, cart, order)
├── admin.html     → Admin panel (CRUD products, manage orders, stats)
├── style.css      → Bootstrap overrides + boutique theme
├── app.js         → Customer panel JavaScript
├── admin.js       → Admin panel JavaScript
├── db.json        → JSON Server database (products + orders)
└── README.md      → This file
```

---

## ⚙️ How to Install & Run

### Prerequisites
- Node.js installed → [https://nodejs.org](https://nodejs.org)

### Step 1 — Install JSON Server (once only)
```bash
npm install -g json-server
```

### Step 2 — Navigate to project folder
```bash
cd Desktop\ MaryamWearBoutique
```

### Step 3 — Start JSON Server
```bash
dir then Press enter
then 
npx json-server  db.json
```
JSON Server will start at: `http://localhost:3000`

### Step 4 — Open the app
Open `index.html` in your browser (double-click or use Live Server in VS Code).

> ⚠️ JSON Server **must** be running before you open the browser. Otherwise products won't load.

---

## ✅ Features List

### 👗 User Panel (`index.html`)
- [x] Browse product collection with images, prices, stock levels
- [x] Filter products by category (Lawn, Chiffon, Kurti, Bridal, Winter)
- [x] Add to Cart — cart badge updates live, items stored in localStorage
- [x] View cart in modal — remove items, clear cart, checkout
- [x] Place order via form (7 input fields)
- [x] Inline form validation — Pakistani phone format, email, required fields
- [x] Loading spinner while fetching from JSON Server
- [x] Error state if JSON Server is unreachable
- [x] Price preview updates live as product/quantity changes

### 🔐 Admin Panel (`admin.html`)
- [x] Dashboard stats: Total Products, Total Orders, Revenue, Pending Orders
- [x] View all products in a table with edit/delete buttons
- [x] Add new product via form (name, category, price, stock, description, image, featured)
- [x] Edit product — loads data into form, saves with PUT
- [x] Delete product — confirmation modal before deleting
- [x] View all customer orders
- [x] Update order status (pending → confirmed → delivered → cancelled) via PATCH
- [x] Visually distinct dark navy navbar with gold accent (rubric requirement)

### 🎁 Bonus
- [x] **Bootstrap 5** used consistently across both panels (+5 marks)

---

## 🌐 API Endpoints Used

| Method | Endpoint        | Purpose                     |
|--------|-----------------|-----------------------------|
| GET    | /products       | Fetch all products           |
| GET    | /orders         | Fetch all orders             |
| POST   | /products       | Add new product              |
| POST   | /orders         | Place customer order         |
| PUT    | /products/:id   | Update (replace) product     |
| PATCH  | /orders/:id     | Update order status          |
| DELETE | /products/:id   | Delete a product             |

---

## 📸 Screenshots

### Home Page
![](<Screenshot (12).png>)

### Shop Panel
![](<Screenshot (13).png>)

### Place Order
![](<Screenshot (14).png>)

### Admin Panel
![](<Screenshot (16).png>)

---


