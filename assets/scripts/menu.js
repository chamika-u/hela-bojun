// Menu Page Logic – Hela Bojun

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

// ---- Render Menu Grid ----
function renderMenuPage(filterCategory = 'all') {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    const items = seedMenuItems();
    // Only show available items on the menu page
    let filtered = items.filter(item => item.status === 'available');

    if (filterCategory !== 'all') {
        filtered = filtered.filter(item => item.category === filterCategory);
    }

    if (filtered.length === 0) {
        menuGrid.innerHTML = '<p class="menu-page-empty">No items available in this category.</p>';
        return;
    }

    menuGrid.innerHTML = filtered.map(item => `
        <div class="menu-card reveal-on-scroll">
            <div class="menu-card-img-wrapper">
                <img src="${item.image || 'assets/images/item-1.png'}" alt="${item.name}" class="menu-card-img" loading="lazy">
            </div>
            <div class="menu-card-body">
                <span class="menu-card-category">${item.category}</span>
                <h3 class="menu-card-name">${item.name}</h3>
                <p class="menu-card-desc">${item.description || ''}</p>
                <p class="menu-card-price">Rs. ${Number(item.price).toLocaleString()}</p>
            </div>
        </div>
    `).join('');

    menuGrid.querySelectorAll('.menu-card.reveal-on-scroll').forEach(el => revealObserver.observe(el));
}

// ---- Category Filter Tabs ----
function setupCategoryFilters() {
    const items = getMenuItems() || [];
    const categories = [...new Set(items.map(i => i.category))].sort();
    const filterContainer = document.getElementById('menu-filter-tabs');
    if (!filterContainer) return;

    // All button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-tab active';
    allBtn.dataset.category = 'all';
    allBtn.textContent = 'All';
    filterContainer.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-tab';
        btn.dataset.category = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
    });

    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab');
        if (!btn) return;
        filterContainer.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenuPage(btn.dataset.category);
    });
}

// ---- Navbar Mobile Menu ----
const menuOpenButton = document.getElementById('menu-open-button');
const menuCloseButton = document.getElementById('menu-close-button');
const navMenu = document.querySelector('.nav-menu');

if (menuOpenButton) {
    menuOpenButton.addEventListener('click', () => document.body.classList.toggle('show-mobile-menu'));
}
if (menuCloseButton) {
    menuCloseButton.addEventListener('click', () => document.body.classList.remove('show-mobile-menu'));
}
if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            document.body.classList.remove('show-mobile-menu');
        }
    });
}

// ---- Navbar scroll glassmorphism ----
const siteHeader = document.querySelector('header');
if (siteHeader) {
    window.addEventListener('scroll', () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ---- Initialize ----
seedMenuItems(); // ensure data is seeded before building filter tabs
setupCategoryFilters();
renderMenuPage();
