// ============================================================
// Admin Dashboard Logic – Hela Bojun
// ============================================================

// ---- Auth Guard ----
if (!isAdminLoggedIn()) {
    window.location.href = 'login.html';
}

// ---- Section Navigation ----
const sidebar = document.getElementById('sidebar');
const adminMain = document.getElementById('admin-main');
const sidebarToggle = document.getElementById('sidebar-toggle');
const topbarMenuBtn = document.getElementById('topbar-menu-btn');
const pageTitle = document.getElementById('page-title');
const sidebarItems = document.querySelectorAll('.sidebar-item[data-section]');

function setActiveSection(sectionName) {
    // Update sidebar active state
    sidebarItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionName);
    });

    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    const target = document.getElementById(`section-${sectionName}`);
    if (target) target.classList.remove('hidden');

    // Update page title
    const titles = { dashboard: 'Dashboard Overview', products: 'Products' };
    if (pageTitle) pageTitle.textContent = titles[sectionName] || sectionName;
}

sidebarItems.forEach(item => {
    item.querySelector('.sidebar-link').addEventListener('click', () => {
        setActiveSection(item.dataset.section);
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });
});

// Sidebar collapse toggle (desktop) / open toggle (mobile)
function handleSidebarToggle() {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
        adminMain.classList.toggle('sidebar-collapsed');
    }
}

sidebarToggle.addEventListener('click', handleSidebarToggle);
topbarMenuBtn.addEventListener('click', handleSidebarToggle);

// Dashboard "View All" button
const dashGoProducts = document.getElementById('dash-go-products');
if (dashGoProducts) {
    dashGoProducts.addEventListener('click', () => setActiveSection('products'));
}

// ---- Logout ----
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', adminLogout);
}

// ---- Data Initialization ----
seedMenuItems();

// ---- Stats ----
function updateStats() {
    const items = getMenuItems() || [];
    const categories = new Set(items.map(i => i.category)).size;
    const available = items.filter(i => i.status === 'available').length;
    const oos = items.filter(i => i.status === 'out-of-stock').length;

    document.getElementById('stat-total').textContent = items.length;
    document.getElementById('stat-categories').textContent = categories;
    document.getElementById('stat-available').textContent = available;
    document.getElementById('stat-oos').textContent = oos;
}

// ---- Render Recent Items (Dashboard) ----
function renderRecentItems() {
    const tbody = document.getElementById('recent-items-tbody');
    if (!tbody) return;

    const items = (getMenuItems() || []).slice(-5).reverse();
    tbody.innerHTML = items.map(item => `
        <tr>
            <td><img src="${item.image || 'assets/images/item-1.png'}" alt="${item.name}" class="table-item-img"></td>
            <td class="table-item-name">${item.name}</td>
            <td><span class="table-item-category">${item.category}</span></td>
            <td>Rs. ${Number(item.price).toLocaleString()}</td>
            <td><span class="badge ${item.status === 'available' ? 'badge-available' : 'badge-oos'}">${item.status === 'available' ? 'Available' : 'Out of Stock'}</span></td>
        </tr>
    `).join('');
}

// ---- Category Filter Population ----
function populateCategoryFilter() {
    const sel = document.getElementById('category-filter');
    if (!sel) return;
    const items = getMenuItems() || [];
    const categories = [...new Set(items.map(i => i.category))].sort();
    const existing = [...sel.options].map(o => o.value);
    categories.forEach(cat => {
        if (!existing.includes(cat)) {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            sel.appendChild(opt);
        }
    });
}

// ---- Render Products Table ----
function renderProductsTable(filterSearch = '', filterCategory = '', filterStatus = '') {
    const tbody = document.getElementById('products-tbody');
    const emptyState = document.getElementById('empty-state');
    if (!tbody) return;

    let items = getMenuItems() || [];

    if (filterSearch) {
        const q = filterSearch.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    if (filterCategory) {
        items = items.filter(i => i.category === filterCategory);
    }
    if (filterStatus) {
        items = items.filter(i => i.status === filterStatus);
    }

    if (items.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td><img src="${item.image || 'assets/images/item-1.png'}" alt="${item.name}" class="table-item-img"></td>
            <td>
                <div class="table-item-name">${item.name}</div>
            </td>
            <td><span class="table-item-category">${item.category}</span></td>
            <td>Rs. ${Number(item.price).toLocaleString()}</td>
            <td><span class="badge ${item.status === 'available' ? 'badge-available' : 'badge-oos'}">${item.status === 'available' ? 'Available' : 'Out of Stock'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-icon-edit" data-id="${item.id}" aria-label="Edit ${item.name}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-icon-delete" data-id="${item.id}" aria-label="Delete ${item.name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Attach edit/delete listeners
    tbody.querySelectorAll('.btn-icon-edit').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
    });
    tbody.querySelectorAll('.btn-icon-delete').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
    });
}

// ---- Filters ----
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');

function applyFilters() {
    renderProductsTable(
        searchInput ? searchInput.value : '',
        categoryFilter ? categoryFilter.value : '',
        statusFilter ? statusFilter.value : ''
    );
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
if (statusFilter) statusFilter.addEventListener('change', applyFilters);

// ---- Add / Edit Modal ----
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const productForm = document.getElementById('product-form');
const formItemId = document.getElementById('form-item-id');
const formName = document.getElementById('form-name');
const formCategory = document.getElementById('form-category');
const formDescription = document.getElementById('form-description');
const formPrice = document.getElementById('form-price');
const formStatus = document.getElementById('form-status');
const formImage = document.getElementById('form-image');
const imagePreview = document.getElementById('image-preview');
const formError = document.getElementById('form-error');

function openAddModal() {
    modalTitle.textContent = 'Add New Item';
    productForm.reset();
    formItemId.value = '';
    imagePreview.classList.add('hidden');
    formError.classList.add('hidden');
    productModal.classList.remove('hidden');
    formName.focus();
}

function openEditModal(id) {
    const items = getMenuItems() || [];
    const item = items.find(i => i.id === id);
    if (!item) return;

    modalTitle.textContent = 'Edit Item';
    formItemId.value = item.id;
    formName.value = item.name;
    formCategory.value = item.category;
    formDescription.value = item.description || '';
    formPrice.value = item.price;
    formStatus.value = item.status;
    formImage.value = item.image || '';

    if (item.image) {
        imagePreview.src = item.image;
        imagePreview.classList.remove('hidden');
    } else {
        imagePreview.classList.add('hidden');
    }

    formError.classList.add('hidden');
    productModal.classList.remove('hidden');
    formName.focus();
}

function closeProductModal() {
    productModal.classList.add('hidden');
}

document.getElementById('add-product-btn').addEventListener('click', openAddModal);
document.getElementById('modal-close').addEventListener('click', closeProductModal);
document.getElementById('modal-cancel').addEventListener('click', closeProductModal);

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
});

// Image preview on URL input
formImage.addEventListener('input', () => {
    const url = formImage.value.trim();
    if (url) {
        imagePreview.src = url;
        imagePreview.classList.remove('hidden');
    } else {
        imagePreview.classList.add('hidden');
    }
});

// Form submission (Add / Edit)
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = formName.value.trim();
    const category = formCategory.value.trim();
    const price = Number(formPrice.value);

    if (!name) {
        showFormError('Item name is required.');
        return;
    }
    if (!category) {
        showFormError('Category is required.');
        return;
    }
    if (!price || price <= 0) {
        showFormError('Please enter a valid price.');
        return;
    }

    const itemData = {
        name,
        category,
        description: formDescription.value.trim(),
        price,
        status: formStatus.value,
        image: formImage.value.trim() || 'assets/images/item-1.png'
    };

    const editId = formItemId.value ? Number(formItemId.value) : null;

    if (editId) {
        updateMenuItem(editId, itemData);
    } else {
        addMenuItem(itemData);
    }

    closeProductModal();
    refreshDashboard();
});

function showFormError(msg) {
    formError.textContent = msg;
    formError.classList.remove('hidden');
}

// ---- Delete Modal ----
const deleteModal = document.getElementById('delete-modal');
const deleteItemName = document.getElementById('delete-item-name');
let pendingDeleteId = null;

function openDeleteModal(id) {
    const items = getMenuItems() || [];
    const item = items.find(i => i.id === id);
    if (!item) return;

    pendingDeleteId = id;
    deleteItemName.textContent = item.name;
    deleteModal.classList.remove('hidden');
    document.getElementById('delete-confirm').focus();
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    pendingDeleteId = null;
}

document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);
document.getElementById('delete-confirm').addEventListener('click', () => {
    if (pendingDeleteId !== null) {
        deleteMenuItem(pendingDeleteId);
        closeDeleteModal();
        refreshDashboard();
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});

// Keyboard close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!productModal.classList.contains('hidden')) closeProductModal();
        if (!deleteModal.classList.contains('hidden')) closeDeleteModal();
    }
});

// ---- Refresh All Dashboard Data ----
function refreshDashboard() {
    updateStats();
    renderRecentItems();
    populateCategoryFilter();
    applyFilters();
}

// ---- Initialize ----
setActiveSection('dashboard');
refreshDashboard();
