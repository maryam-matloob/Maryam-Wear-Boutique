/* ═══════════════════════════════════════════════
   MARYAM WEAR BOUTIQUE — app.js
   Customer Panel: Browse, Filter, Cart, Order
═══════════════════════════════════════════════ */

const API = 'http://localhost:3000';

/* ────────────────────────────────
   CART  (stored in localStorage)
──────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('mwb_cart')) || [];

function saveCart() {
  localStorage.setItem('mwb_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = total;
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
  showToast(`"${product.name}" added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartModal();
}

function openCartModal() {
  renderCartModal();
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  modal.show();
}

function renderCartModal() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag-x fs-1 text-muted d-block mb-3"></i>
        <p class="text-muted">Your cart is empty.</p>
        <a href="#products" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Start Shopping</a>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="flex-grow-1">
        <div class="fw-bold">${item.name}</div>
        <div class="text-muted small">${item.category}</div>
        <div class="text-primary fw-semibold">Rs. ${item.price.toLocaleString()} × ${item.quantity}</div>
      </div>
      <div class="text-end">
        <div class="fw-bold">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
        <button class="btn btn-sm btn-outline-danger mt-1" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="d-flex justify-content-between align-items-center w-100">
      <span class="fw-bold fs-5">Total: <span class="text-primary">Rs. ${grandTotal.toLocaleString()}</span></span>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-danger btn-sm" onclick="clearCart()">Clear Cart</button>
        <a href="#order-section" class="btn btn-primary btn-sm" data-bs-dismiss="modal"
           onclick="prefillOrderFromCart()">
          <i class="bi bi-bag-check me-1"></i>Checkout
        </a>
      </div>
    </div>`;
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartModal();
}

// Pre-fill the order form with the first cart item for convenience
function prefillOrderFromCart() {
  if (cart.length === 0) return;
  const first = cart[0];
  const productSelect = document.getElementById('productSelect');
  // Wait for dropdown to be in DOM then set value
  setTimeout(() => {
    if (productSelect) productSelect.value = first.id;
    updatePricePreview();
  }, 300);
}

/* ────────────────────────────────
   TOAST NOTIFICATION
──────────────────────────────── */
function showToast(message) {
  // Remove existing toast if any
  const old = document.getElementById('liveToast');
  if (old) old.remove();

  const toastEl = document.createElement('div');
  toastEl.id = 'liveToast';
  toastEl.innerHTML = `
    <div style="
      position:fixed; bottom:24px; right:24px; z-index:9999;
      background:var(--primary); color:white;
      padding:12px 20px; border-radius:50px;
      box-shadow:0 6px 25px rgba(181,70,122,0.4);
      font-size:0.9rem; font-weight:600;
      animation: slideUp 0.3s ease;
    ">
      <i class="bi bi-check-circle me-2"></i>${message}
    </div>`;
  document.body.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 2500);
}

/* ────────────────────────────────
   FETCH ALL PRODUCTS
──────────────────────────────── */
let allProducts = []; // cache for filtering

async function fetchProducts() {
  showLoading(true);

  try {
    const response = await fetch(`${API}/products`);

    // Always check response.ok before parsing JSON
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    allProducts = await response.json();
    showLoading(false);
    renderProducts(allProducts);
    populateProductDropdown(allProducts);

  } catch (error) {
    showLoading(false);
    showError(true);
    console.error('Fetch error:', error);
  }
}

/* ────────────────────────────────
   RENDER PRODUCT CARDS
──────────────────────────────── */
function renderProducts(products) {
  const grid = document.getElementById('productGrid');

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted d-block mb-3"></i>
        <p class="text-muted">No products found in this category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="col-sm-6 col-lg-3">
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy"/>
          ${product.featured ? '<span class="badge-featured">⭐ Featured</span>' : ''}
          <span class="badge-category">${product.category}</span>
        </div>
        <div class="product-body">
          <h5 class="product-name">${product.name}</h5>
          <p class="text-muted small mb-2">${product.description.substring(0, 60)}...</p>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="product-price">Rs. ${product.price.toLocaleString()}</span>
            <span class="product-stock">
              <i class="bi bi-box-seam me-1"></i>${product.stock} left
            </span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn-add-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
              <i class="bi bi-bag-plus me-1"></i>Add to Cart
            </button>
            <a href="#order-section" class="btn-order-now text-decoration-none text-center"
               onclick="selectProductInForm(${product.id})">
              Order
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ────────────────────────────────
   FILTER BY CATEGORY
──────────────────────────────── */
function setupFilters() {
  const buttons = document.querySelectorAll('.btn-filter');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        renderProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => p.category === filter);
        renderProducts(filtered);
      }
    });
  });
}

/* ────────────────────────────────
   POPULATE ORDER FORM DROPDOWN
──────────────────────────────── */
function populateProductDropdown(products) {
  const select = document.getElementById('productSelect');
  select.innerHTML = '<option value="">-- Choose a product --</option>';
  products.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} — Rs. ${p.price.toLocaleString()}`;
    select.appendChild(option);
  });
}

// Called when user clicks "Order" on a product card
function selectProductInForm(productId) {
  const select = document.getElementById('productSelect');
  if (select) {
    select.value = productId;
    updatePricePreview();
  }
}

/* ────────────────────────────────
   PRICE PREVIEW (live update)
──────────────────────────────── */
function updatePricePreview() {
  const productId = parseInt(document.getElementById('productSelect').value);
  const quantity  = parseInt(document.getElementById('quantity').value) || 1;
  const preview   = document.getElementById('pricePreview');
  const display   = document.getElementById('totalDisplay');

  if (productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      display.textContent = `Rs. ${(product.price * quantity).toLocaleString()}`;
      preview.classList.remove('d-none');
    }
  } else {
    preview.classList.add('d-none');
  }
}

document.getElementById('productSelect')?.addEventListener('change', updatePricePreview);
document.getElementById('quantity')?.addEventListener('input', updatePricePreview);

/* ────────────────────────────────
   INLINE FORM VALIDATION
   (No alert() boxes — rubric requirement)
──────────────────────────────── */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(`err-${fieldId}`);
  field.classList.add('is-invalid');
  if (err) err.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
}

function validateOrderForm() {
  let isValid = true;

  const name    = document.getElementById('customerName').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const product = document.getElementById('productSelect').value;
  const size    = document.getElementById('size').value;
  const qty     = parseInt(document.getElementById('quantity').value);

  // Reset previous errors
  ['customerName','phone','email','address','productSelect','size','quantity'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('is-invalid', 'is-valid');
  });

  // Name: required, at least 3 chars
  if (!name || name.length < 3) {
    showFieldError('customerName', 'Please enter your full name (min 3 characters).');
    isValid = false;
  } else { clearFieldError('customerName'); }

  // Phone: Pakistani format 03XXXXXXXXX
  const phoneRegex = /^03[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    showFieldError('phone', 'Enter a valid Pakistani number (03XXXXXXXXX).');
    isValid = false;
  } else { clearFieldError('phone'); }

  // Email: valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  } else { clearFieldError('email'); }

  // Address: required
  if (!address || address.length < 10) {
    showFieldError('address', 'Please enter your full delivery address (min 10 characters).');
    isValid = false;
  } else { clearFieldError('address'); }

  // Product: required
  if (!product) {
    showFieldError('productSelect', 'Please select a product.');
    isValid = false;
  } else { clearFieldError('productSelect'); }

  // Size: required
  if (!size) {
    showFieldError('size', 'Please select a size.');
    isValid = false;
  } else { clearFieldError('size'); }

  // Quantity: 1-10
  if (!qty || qty < 1 || qty > 10) {
    showFieldError('quantity', 'Quantity must be between 1 and 10.');
    isValid = false;
  } else { clearFieldError('quantity'); }

  return isValid;
}

/* ────────────────────────────────
   SUBMIT ORDER (POST to JSON Server)
──────────────────────────────── */
async function submitOrder(e) {
  e.preventDefault(); // VIVA: stops default form page-reload behaviour

  if (!validateOrderForm()) return;

  const productId  = parseInt(document.getElementById('productSelect').value);
  const product    = allProducts.find(p => p.id === productId);
  const quantity   = parseInt(document.getElementById('quantity').value);

  const newOrder = {
    customerName: document.getElementById('customerName').value.trim(),
    phone:        document.getElementById('phone').value.trim(),
    email:        document.getElementById('email').value.trim(),
    address:      document.getElementById('address').value.trim(),
    productId,
    productName:  product.name,
    size:         document.getElementById('size').value,
    quantity,
    totalPrice:   product.price * quantity,
    status:       'pending',
    date:         new Date().toISOString().split('T')[0]
  };

  const btn = document.getElementById('submitOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Placing order...';

  try {
    const response = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // VIVA: required for POST
      body: JSON.stringify(newOrder)                    // VIVA: JSON.stringify converts object → string
    });

    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.status}`);
    }

    // Success
    document.getElementById('orderForm').reset();
    ['customerName','phone','email','address','productSelect','size','quantity'].forEach(id => {
      document.getElementById(id).classList.remove('is-valid');
    });
    document.getElementById('pricePreview').classList.add('d-none');
    document.getElementById('orderSuccess').classList.remove('d-none');

    // Auto-hide success message after 5s
    setTimeout(() => {
      document.getElementById('orderSuccess').classList.add('d-none');
    }, 5000);

  } catch (error) {
    showFieldError('customerName', `Order failed: ${error.message}. Is JSON Server running?`);
  } finally {
    // Always re-enable button
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-bag-check me-2"></i>Place Order';
  }
}

/* ────────────────────────────────
   LOADING / ERROR HELPERS
──────────────────────────────── */
function showLoading(visible) {
  document.getElementById('loadingState').classList.toggle('d-none', !visible);
  document.getElementById('productGrid').classList.toggle('d-none', visible);
}

function showError(visible) {
  document.getElementById('errorState').classList.toggle('d-none', !visible);
}

/* ────────────────────────────────
   INIT — runs when page loads
──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  setupFilters();
  updateCartBadge();
  document.getElementById('orderForm').addEventListener('submit', submitOrder);
});
