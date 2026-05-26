/* ═══════════════════════════════════════════════
   MARYAM WEAR BOUTIQUE — admin.js
   Admin Panel: Full CRUD + Stats
   HTTP Methods used: GET, POST, PUT, DELETE, PATCH
═══════════════════════════════════════════════ */

const API = 'http://localhost:3000';

let allProducts = [];
let deleteTargetId = null;

/* ────────────────────────────────
   1. STATS  —  GET /products + GET /orders
──────────────────────────────── */
async function loadStats() {
  try {
    const [prodRes, orderRes] = await Promise.all([
      fetch(`${API}/products`),
      fetch(`${API}/orders`)
    ]);
    if (!prodRes.ok || !orderRes.ok) throw new Error('Server error');

    const products = await prodRes.json();
    const orders   = await orderRes.json();

    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-orders').textContent   = orders.length;

    const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    document.getElementById('stat-revenue').textContent  = 'Rs. ' + revenue.toLocaleString();

    const pending = orders.filter(o => o.status === 'pending').length;
    document.getElementById('stat-pending').textContent  = pending;

  } catch (err) {
    console.error('Stats error:', err);
  }
}

/* ────────────────────────────────
   2. LOAD PRODUCTS  —  GET /products
──────────────────────────────── */
async function loadProducts() {
  showTableLoading('products', true);
  try {
    const response = await fetch(`${API}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    allProducts = await response.json();
    renderProductsTable(allProducts);
    showTableLoading('products', false);

  } catch (err) {
    showTableLoading('products', false);
    document.getElementById('productsErrorState').classList.remove('d-none');
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No products found.</td></tr>`;
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${p.image}" width="40" height="50"
               style="object-fit:cover;border-radius:6px;" alt="${p.name}"/>
          <span class="fw-semibold small">${p.name}</span>
        </div>
      </td>
      <td><span class="badge bg-light text-dark border">${p.category}</span></td>
      <td class="fw-semibold" style="color:var(--primary)">Rs. ${p.price.toLocaleString()}</td>
      <td><span class="badge ${p.stock > 5 ? 'bg-success' : 'bg-danger'}">${p.stock}</span></td>
      <td>${p.featured ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-star text-muted"></i>'}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-primary" onclick="loadProductForEdit('${p.id}')" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${p.id}', '${p.name.replace(/'/g, "\\'")}')" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ────────────────────────────────
   3. LOAD ORDERS  —  GET /orders
──────────────────────────────── */
async function loadOrders() {
  showTableLoading('orders', true);
  try {
    const response = await fetch(`${API}/orders`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const orders = await response.json();
    renderOrdersTable(orders);
    showTableLoading('orders', false);

  } catch (err) {
    showTableLoading('orders', false);
  }
}

function renderOrdersTable(orders) {
  const wrapper = document.getElementById('ordersTableWrapper');
  const tbody   = document.getElementById('ordersTableBody');
  wrapper.classList.remove('d-none');

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No orders yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td class="text-muted small">#${o.id}</td>
      <td>
        <div class="fw-semibold small">${o.customerName}</div>
        <div class="text-muted" style="font-size:0.75rem">${o.phone}</div>
      </td>
      <td class="small">${o.productName}</td>
      <td class="text-center">${o.quantity}</td>
      <td class="fw-semibold small" style="color:var(--primary)">Rs. ${o.totalPrice.toLocaleString()}</td>
      <td class="text-muted small">${o.date}</td>
      <td><span class="badge status-${o.status} text-capitalize">${o.status}</span></td>
      <td>
        <select class="form-select form-select-sm" style="min-width:110px;"
                onchange="updateOrderStatus('${o.id}', this.value)">
          <option ${o.status==='pending'   ? 'selected' : ''}>pending</option>
          <option ${o.status==='confirmed' ? 'selected' : ''}>confirmed</option>
          <option ${o.status==='delivered' ? 'selected' : ''}>delivered</option>
          <option ${o.status==='cancelled' ? 'selected' : ''}>cancelled</option>
        </select>
      </td>
    </tr>
  `).join('');
}

/* ────────────────────────────────
   4. UPDATE ORDER STATUS  —  PATCH /orders/:id
──────────────────────────────── */
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) throw new Error('Failed to update');
    loadStats();
  } catch (err) {
    showFormAlert('productFormAlert', 'danger', 'Failed to update order status.');
  }
}

/* ────────────────────────────────
   5. LOAD PRODUCT INTO EDIT FORM
   — finds by string OR number id
──────────────────────────────── */
function loadProductForEdit(productId) {
  // Use == (not ===) so "1" == 1 both match — fixes the string/number ID bug
  const product = allProducts.find(p => p.id == productId);

  if (!product) {
    showFormAlert('productFormAlert', 'danger', 'Could not load product. Try refreshing.');
    return;
  }

  // Fill every form field
  document.getElementById('editProductId').value = product.id;
  document.getElementById('pName').value         = product.name;
  document.getElementById('pCategory').value     = product.category;
  document.getElementById('pPrice').value        = product.price;
  document.getElementById('pStock').value        = product.stock;
  document.getElementById('pDescription').value  = product.description;
  document.getElementById('pImage').value        = product.image || '';
  document.getElementById('pFeatured').checked   = product.featured;

  // Switch form to "Edit" mode
  document.getElementById('formTitle').textContent      = 'Edit Product';
  document.getElementById('productSubmitBtn').innerHTML = '<i class="bi bi-save me-1"></i>Update Product';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';

  // Scroll up to the form so user sees it
  document.getElementById('productForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ────────────────────────────────
   6. ADD NEW PRODUCT  —  POST /products
──────────────────────────────── */
async function addProduct(productData) {
  const btn = document.getElementById('productSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Saving...';

  try {
    const response = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    showFormAlert('productFormAlert', 'success', 'Product added successfully!');
    cancelEdit();
    loadProducts();
    loadStats();

  } catch (err) {
    showFormAlert('productFormAlert', 'danger', `Failed to add product: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Add Product';
  }
}

/* ────────────────────────────────
   7. UPDATE PRODUCT  —  PUT /products/:id
──────────────────────────────── */
async function updateProduct(productId, productData) {
  const btn = document.getElementById('productSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Updating...';

  try {
    const response = await fetch(`${API}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, ...productData })
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    showFormAlert('productFormAlert', 'success', 'Product updated successfully!');
    cancelEdit();
    loadProducts();
    loadStats();

  } catch (err) {
    showFormAlert('productFormAlert', 'danger', `Failed to update: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-save me-1"></i>Update Product';
  }
}

/* ────────────────────────────────
   8. DELETE PRODUCT  —  DELETE /products/:id
──────────────────────────────── */
function confirmDelete(productId, productName) {
  deleteTargetId = productId;
  document.getElementById('deleteProductName').textContent = `"${productName}"`;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

async function deleteProduct() {
  if (!deleteTargetId) return;
  try {
    const response = await fetch(`${API}/products/${deleteTargetId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    deleteTargetId = null;
    loadProducts();
    loadStats();
    showFormAlert('productFormAlert', 'success', 'Product deleted successfully.');

  } catch (err) {
    showFormAlert('productFormAlert', 'danger', `Delete failed: ${err.message}`);
  }
}

/* ────────────────────────────────
   FORM SUBMIT HANDLER
──────────────────────────────── */
function handleProductFormSubmit(e) {
  e.preventDefault();
  if (!validateProductForm()) return;

  const editId = document.getElementById('editProductId').value;

  const productData = {
    name:        document.getElementById('pName').value.trim(),
    category:    document.getElementById('pCategory').value,
    price:       parseInt(document.getElementById('pPrice').value),
    stock:       parseInt(document.getElementById('pStock').value),
    description: document.getElementById('pDescription').value.trim(),
    image:       document.getElementById('pImage').value.trim() ||
                 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=500&fit=crop',
    featured:    document.getElementById('pFeatured').checked,
    sizes:       ['S', 'M', 'L', 'XL']
  };

  if (editId) {
    updateProduct(editId, productData);   // editId passed as-is (string or number both work)
  } else {
    addProduct(productData);
  }
}

/* ────────────────────────────────
   VALIDATION
──────────────────────────────── */
function validateProductForm() {
  let valid = true;
  ['pName','pCategory','pPrice','pStock','pDescription'].forEach(id => {
    document.getElementById(id).classList.remove('is-invalid', 'is-valid');
  });

  const name = document.getElementById('pName').value.trim();
  if (!name || name.length < 3) {
    setAdminFieldError('pName', 'Product name must be at least 3 characters.'); valid = false;
  } else { setAdminFieldValid('pName'); }

  const cat = document.getElementById('pCategory').value;
  if (!cat) {
    setAdminFieldError('pCategory', 'Please select a category.'); valid = false;
  } else { setAdminFieldValid('pCategory'); }

  const price = parseInt(document.getElementById('pPrice').value);
  if (!price || price < 1) {
    setAdminFieldError('pPrice', 'Price must be at least Rs. 1.'); valid = false;
  } else { setAdminFieldValid('pPrice'); }

  const stock = document.getElementById('pStock').value;
  if (stock === '' || parseInt(stock) < 0) {
    setAdminFieldError('pStock', 'Stock cannot be negative.'); valid = false;
  } else { setAdminFieldValid('pStock'); }

  const desc = document.getElementById('pDescription').value.trim();
  if (!desc || desc.length < 10) {
    setAdminFieldError('pDescription', 'Description must be at least 10 characters.'); valid = false;
  } else { setAdminFieldValid('pDescription'); }

  return valid;
}

function setAdminFieldError(id, msg) {
  const el = document.getElementById(id);
  el.classList.add('is-invalid');
  const errEl = document.getElementById(`err-${id}`);
  if (errEl) errEl.textContent = msg;
}

function setAdminFieldValid(id) {
  document.getElementById(id).classList.add('is-valid');
}

/* ────────────────────────────────
   CANCEL EDIT — reset to Add mode
──────────────────────────────── */
function cancelEdit() {
  document.getElementById('productForm').reset();
  document.getElementById('editProductId').value = '';
  ['pName','pCategory','pPrice','pStock','pDescription'].forEach(id => {
    document.getElementById(id).classList.remove('is-valid', 'is-invalid');
  });
  document.getElementById('formTitle').textContent       = 'Add New Product';
  document.getElementById('productSubmitBtn').innerHTML  = '<i class="bi bi-plus-circle me-1"></i>Add Product';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

/* ────────────────────────────────
   HELPERS
──────────────────────────────── */
function showFormAlert(containerId, type, message) {
  const el = document.getElementById(containerId);
  el.className = `alert alert-${type}`;
  el.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>${message}`;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 4000);
}

function showTableLoading(section, show) {
  const loadEl    = document.getElementById(`${section}LoadingState`);
  const wrapperEl = document.getElementById(`${section}TableWrapper`);
  if (loadEl)    loadEl.classList.toggle('d-none', !show);
  if (wrapperEl) wrapperEl.classList.toggle('d-none', show);
}

/* ────────────────────────────────
   INIT
──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadProducts();
  loadOrders();
  document.getElementById('productForm').addEventListener('submit', handleProductFormSubmit);
  document.getElementById('confirmDeleteBtn').addEventListener('click', deleteProduct);
});
