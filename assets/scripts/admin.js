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
    const titles = { dashboard: 'Dashboard Overview', products: 'Products', messages: 'Messages & Inquiries' };
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

    // Pending messages stat
    const inquiries = getInquiries ? getInquiries() : [];
    const pending = inquiries.filter(i => !i.reviewStatus || i.reviewStatus === 'pending').length;
    const statPending = document.getElementById('stat-pending-msgs');
    if (statPending) statPending.textContent = pending;

    // Sidebar badge
    const badge = document.getElementById('sidebar-msg-badge');
    if (badge) {
        badge.textContent = pending;
        badge.classList.toggle('hidden', pending === 0);
    }
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
        if (messageModal && !messageModal.classList.contains('hidden')) closeMessageModal();
    }
});

// ---- Refresh All Dashboard Data ----
function refreshDashboard() {
    updateStats();
    renderRecentItems();
    populateCategoryFilter();
    applyFilters();
    renderMessagesTable();
}

// ---- Messages Section ----

const MSG_TYPE_LABELS = {
    general: 'General Inquiry',
    product: 'Product Inquiry',
    complaint: 'Complaint'
};

const MSG_STATUS_LABELS = {
    pending: 'Pending',
    reviewed: 'Reviewed',
    resolved: 'Resolved'
};

const MSG_STATUS_BADGE = {
    pending: 'badge-pending',
    reviewed: 'badge-reviewed',
    resolved: 'badge-resolved'
};

const INQUIRY_LABEL_MAP = {
    general: 'General Inquiry', product: 'Product Inquiry', complaint: 'Complaint',
    menu_info: 'Menu & food information', hours_location: 'Operating hours & location',
    pricing_payment: 'Pricing & payment options', reservation_bulk: 'Reservation or bulk order',
    website_digital: 'Website or digital services', other: 'Other',
    quality_taste: 'Quality & taste', freshness_ingredients: 'Freshness & ingredients',
    portion_size: 'Portion size', allergen_info: 'Allergen & ingredients info',
    availability: 'Availability inquiry', pricing: 'Pricing concern', packaging: 'Packaging concern',
    staff: 'Staff / Workers', place: 'Place, Parking & Infrastructure',
    health: 'Health & Hygiene',
    poor_quality: 'Poor quality or taste', stale_food: 'Stale or expired food',
    foreign_object: 'Foreign object found in food', mislabeled: 'Wrong item or mislabeled',
    overcharged: 'Overcharged / wrong price', rude_behavior: 'Rude or inappropriate behavior',
    staff_hygiene: 'Poor personal hygiene', slow_service: 'Slow or poor service',
    wrong_order: 'Wrong order or mistake', unprofessional: 'Unprofessional conduct',
    parking: 'Parking facilities', seating: 'Insufficient seating',
    cleanliness: 'Cleanliness of premises', infrastructure: 'Building or infrastructure issue',
    accessibility: 'Accessibility concerns', food_safety: 'Food safety concern',
    environment_hygiene: 'Environment hygiene', sanitation: 'Sanitation of facilities',
    contamination: 'Suspected contamination', pests: 'Pest or rodent presence'
};

function msgLabel(value) {
    return INQUIRY_LABEL_MAP[value] || value || '—';
}

function formatDate(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function renderMessagesTable() {
    const tbody = document.getElementById('messages-tbody');
    const emptyState = document.getElementById('msg-empty-state');
    if (!tbody) return;

    const searchVal = (document.getElementById('msg-search-input') || {}).value || '';
    const typeVal = (document.getElementById('msg-type-filter') || {}).value || '';
    const statusVal = (document.getElementById('msg-status-filter') || {}).value || '';

    let items = getInquiries ? getInquiries() : [];

    // Sort newest first
    items = items.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (searchVal) {
        const q = searchVal.toLowerCase();
        items = items.filter(i =>
            (i.name && i.name.toLowerCase().includes(q)) ||
            (i.email && i.email.toLowerCase().includes(q)) ||
            (i.ref && i.ref.toLowerCase().includes(q))
        );
    }
    if (typeVal) {
        items = items.filter(i => i.type === typeVal);
    }
    if (statusVal) {
        items = items.filter(i => (i.reviewStatus || 'pending') === statusVal);
    }

    if (items.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    if (emptyState) emptyState.classList.add('hidden');

    tbody.innerHTML = items.map(item => {
        const status = item.reviewStatus || 'pending';
        const badgeClass = MSG_STATUS_BADGE[status] || 'badge-pending';
        const typeLabel = MSG_TYPE_LABELS[item.type] || item.type || '—';
        return `
        <tr>
            <td><code class="msg-ref">${item.ref || '—'}</code></td>
            <td><span class="badge msg-type-badge msg-type-${item.type}">${typeLabel}</span></td>
            <td>${item.name || '—'}</td>
            <td class="msg-email">${item.email || '—'}</td>
            <td class="msg-date">${formatDate(item.timestamp)}</td>
            <td><span class="badge ${badgeClass}">${MSG_STATUS_LABELS[status] || status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-icon-view" data-ref="${item.ref}" aria-label="View message ${item.ref}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.btn-icon-view').forEach(btn => {
        btn.addEventListener('click', () => openMessageModal(btn.dataset.ref));
    });
}

// ---- Message Detail Modal ----
const messageModal = document.getElementById('message-modal');
let currentMsgRef = null;

function openMessageModal(ref) {
    const items = getInquiries ? getInquiries() : [];
    const item = items.find(i => i.ref === ref);
    if (!item) return;
    currentMsgRef = ref;

    const status = item.reviewStatus || 'pending';
    const statusSelect = document.getElementById('msg-status-select');
    if (statusSelect) statusSelect.value = status;

    // Build detail rows
    const rows = [];
    rows.push({ label: 'Reference', value: item.ref });
    rows.push({ label: 'Type', value: MSG_TYPE_LABELS[item.type] || item.type });
    rows.push({ label: 'Name', value: item.name });
    rows.push({ label: 'Email', value: item.email });
    rows.push({ label: 'Phone', value: item.phone || '—' });
    rows.push({ label: 'Date', value: formatDate(item.timestamp) });

    if (item.type === 'general') {
        rows.push({ label: 'Topic', value: msgLabel(item.issue) });
        if (item.issue === 'other' && item.otherDetail) {
            rows.push({ label: 'Other Detail', value: item.otherDetail });
        }
    } else if (item.type === 'product') {
        if (item.products && item.products.length) {
            rows.push({ label: 'Product(s)', value: item.products.join(', ') });
        }
        rows.push({ label: 'Issue', value: msgLabel(item.issue) });
    } else if (item.type === 'complaint') {
        rows.push({ label: 'Category', value: msgLabel(item.complaintCategory) });
        if (item.products && item.products.length) {
            rows.push({ label: 'Product(s)', value: item.products.join(', ') });
        }
        if (item.issue) {
            rows.push({ label: 'Issue', value: msgLabel(item.issue) });
        }
    }

    rows.push({ label: 'Message', value: item.message, full: true });
    rows.push({ label: 'Review Status', value: MSG_STATUS_LABELS[status] || status });

    const body = document.getElementById('msg-detail-body');
    if (body) {
        body.innerHTML = rows.map(r => `
            <div class="msg-detail-row${r.full ? ' msg-detail-row-full' : ''}">
                <span class="msg-detail-label">${r.label}</span>
                <span class="msg-detail-value">${r.value || '—'}</span>
            </div>
        `).join('');
    }

    messageModal.classList.remove('hidden');
}

function closeMessageModal() {
    messageModal.classList.add('hidden');
    currentMsgRef = null;
}

document.getElementById('message-modal-close').addEventListener('click', closeMessageModal);
document.getElementById('message-modal-cancel').addEventListener('click', closeMessageModal);

document.getElementById('msg-save-status').addEventListener('click', () => {
    if (!currentMsgRef) return;
    const sel = document.getElementById('msg-status-select');
    if (sel && typeof updateInquiryStatus === 'function') {
        updateInquiryStatus(currentMsgRef, sel.value);
        closeMessageModal();
        refreshDashboard();
    }
});

document.getElementById('msg-delete-btn').addEventListener('click', () => {
    if (!currentMsgRef) return;
    if (confirm('Delete this message? This cannot be undone.')) {
        if (typeof deleteInquiry === 'function') deleteInquiry(currentMsgRef);
        closeMessageModal();
        refreshDashboard();
    }
});

messageModal.addEventListener('click', (e) => {
    if (e.target === messageModal) closeMessageModal();
});

// Filters for messages
const msgSearchInput = document.getElementById('msg-search-input');
const msgTypeFilter = document.getElementById('msg-type-filter');
const msgStatusFilterEl = document.getElementById('msg-status-filter');

if (msgSearchInput) msgSearchInput.addEventListener('input', renderMessagesTable);
if (msgTypeFilter) msgTypeFilter.addEventListener('change', renderMessagesTable);
if (msgStatusFilterEl) msgStatusFilterEl.addEventListener('change', renderMessagesTable);

// Dashboard stat card click → go to messages
const dashGoMessages = document.getElementById('dash-go-messages');
if (dashGoMessages) {
    dashGoMessages.addEventListener('click', () => setActiveSection('messages'));
}

// ---- Initialize ----
setActiveSection('dashboard');
refreshDashboard();
