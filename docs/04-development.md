# Development — Code Walkthrough

This document explains every file in the Hela Bojun project in detail.

---

## 1. `assets/scripts/data.js` — Data Layer

This is the **single source of truth** for menu data. All pages that need menu items import this script.

### Default Seed Data

```javascript
const DEFAULT_MENU_ITEMS = [ ... ];
```

An array of 6 pre-defined menu item objects. Each item has:
- `id` — unique integer
- `name` — display name
- `description` — short description
- `image` — relative path to image in `assets/images/`
- `category` — one of: "Main Course", "Beverages", "Short Eats", "Desserts"
- `price` — integer price in Sri Lankan Rupees
- `status` — `"available"` or `"out-of-stock"`

### Storage Key

```javascript
const STORAGE_KEY = 'helaBojunMenuItems';
```

All menu items are stored under this single key in `localStorage` as a JSON string.

### CRUD Functions

#### `getMenuItems()`
```javascript
function getMenuItems() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}
```
Retrieves and parses menu items from `localStorage`. Returns `null` if no data exists yet.

#### `saveMenuItems(items)`
```javascript
function saveMenuItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
```
Serialises the items array to JSON and persists it in `localStorage`.

#### `seedMenuItems()`
```javascript
function seedMenuItems() {
    if (!getMenuItems()) {
        saveMenuItems(DEFAULT_MENU_ITEMS);
    }
    return getMenuItems();
}
```
Called on page load. If `localStorage` is empty (first visit), it seeds it with `DEFAULT_MENU_ITEMS`. Always returns the current list.

#### `getNextId()`
```javascript
function getNextId() {
    const items = getMenuItems() || [];
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
```
Finds the maximum existing `id` and increments it by 1. Safe against gaps in the sequence.

#### `addMenuItem(item)`
```javascript
function addMenuItem(item) {
    const items = getMenuItems() || [];
    item.id = getNextId();
    items.push(item);
    saveMenuItems(items);
    return item;
}
```
Assigns a new ID to the item, pushes it to the array, and saves.

#### `updateMenuItem(id, updatedItem)`
```javascript
function updateMenuItem(id, updatedItem) {
    const items = getMenuItems() || [];
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem, id };
        saveMenuItems(items);
        return items[index];
    }
    return null;
}
```
Uses object spread (`...`) to merge the existing item with the updated fields, preserving the original `id`.

#### `deleteMenuItem(id)`
```javascript
function deleteMenuItem(id) {
    const items = getMenuItems() || [];
    const filtered = items.filter(i => i.id !== id);
    saveMenuItems(filtered);
}
```
Removes the item with the matching `id` by filtering it out.

---

## 2. `assets/scripts/script.js` — Home Page Logic

Handles all interactive behaviour on `index.html`.

### Mobile Navigation

```javascript
const menuOpenButton = document.getElementById('menu-open-button');
const menuCloseButton = document.getElementById('menu-close-button');
const navMenu = document.querySelector('.nav-menu');

const closeMobileMenu = () => document.body.classList.remove("show-mobile-menu");

menuOpenButton.addEventListener('click', () => {
    document.body.classList.toggle("show-mobile-menu");
});
menuCloseButton.addEventListener('click', closeMobileMenu);
```

- Clicking the hamburger button (`menu-open-button`) toggles the class `show-mobile-menu` on `<body>`.
- The CSS for `.show-mobile-menu` slides the nav menu into view.
- Clicking the close button (`menu-close-button`) removes the class to hide the menu.
- **Event delegation** on `navMenu` closes the menu whenever any `nav-link` is clicked (avoids one listener per link).

### Glassmorphism Navbar on Scroll

```javascript
const siteHeader = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
});
```

Adds/removes the `.scrolled` class based on vertical scroll position. The CSS defines a `backdrop-filter: blur()` effect for this class.

### Dynamic Menu Rendering

```javascript
function renderMenuItems() {
    const menuList = document.getElementById('menu-list');
    if (!menuList) return;
    const items = seedMenuItems();
    menuList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item reveal-on-scroll';
        li.innerHTML = `
            <img src="${item.image}" class="menu-item-image" alt="${item.name}" loading="lazy">
            <h3 class="name">${item.name}</h3>
            <p class="text">${item.description}</p>
            <p class="price">Rs. ${item.price.toLocaleString()}</p>
        `;
        menuList.appendChild(li);
    });
    document.querySelectorAll('.menu-item.reveal-on-scroll').forEach(el => revealObserver.observe(el));
}
```

1. Calls `seedMenuItems()` (from `data.js`) to get or initialise the menu.
2. Clears the existing list.
3. Creates a `<li>` element for each item and appends it.
4. Registers each new item with the scroll-reveal observer.

### Scroll Reveal — Intersection Observer

```javascript
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
```

- `IntersectionObserver` fires a callback whenever observed elements enter/leave the viewport.
- `threshold: 0.12` means the callback fires when 12% of the element is visible.
- Once revealed, the element is **unobserved** to avoid redundant callbacks.
- The `revealed` class triggers a CSS animation (opacity 0→1 + translateY).

### Gallery Lightbox

```javascript
function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';  // Prevent background scroll
    lightboxClose.focus();                     // Move focus for accessibility
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
```

- `openLightbox` sets the full-size image `src`, shows the overlay, disables body scroll, and moves keyboard focus to the close button.
- Closes on: close button click, overlay background click, or Escape key.
- Keyboard support: `Enter` or `Space` on a gallery image triggers `openLightbox`.

### Swiper.js Testimonials Carousel

```javascript
if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.slider-wrapper', { ... });
}
```

Guarded with a `typeof` check so the page does not throw if the CDN fails to load. See `docs/03-design.md` for the full configuration.

---

## 3. `assets/scripts/menu.js` — Menu Page Logic

Handles all behaviour on `menu.html`.

### `renderMenuPage(filterCategory)`

Reads all items from localStorage, filters by `status === 'available'`, optionally filters by category, and renders a grid of `.menu-card` elements. Each card shows: image, category badge, name, description, and price.

### `setupCategoryFilters()`

Reads unique categories from the stored items and dynamically creates one `<button class="filter-tab">` per category plus an "All" button. Uses **event delegation** on the container to handle all tab clicks with a single listener. Clicking a tab:
1. Removes `active` from all tabs.
2. Adds `active` to the clicked tab.
3. Calls `renderMenuPage(category)` to re-render.

### Navbar & Scroll (duplicated from `script.js`)

`menu.html` is a standalone page so it includes its own mobile-nav and scroll-glassmorphism logic, which is functionally identical to the code in `script.js`.

---

## 4. `assets/scripts/auth.js` — Authentication

### `hashPassword(password)`

```javascript
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

Uses the **Web Crypto API** (`crypto.subtle.digest`) — a built-in browser API — to hash the password with SHA-256. Returns a lowercase hex string. No external library needed.

### `isAdminLoggedIn()`

```javascript
function isAdminLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}
```

Checks `sessionStorage` for the auth flag. Returns `true` only if the exact string `"true"` is present.

### `adminLogout()`

```javascript
function adminLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}
```

Clears the auth flag and redirects to the login page.

### Login Form Handler

Runs only when `document.getElementById('login-form')` exists (i.e., on `login.html`).

1. If already logged in, redirects immediately to `admin.html`.
2. On form submit: reads username + password, calls `hashPassword()`, compares against `window.APP_CONFIG.adminUsername` and `window.APP_CONFIG.adminPasswordHash` from `config.js`.
3. On match: sets `sessionStorage` flag and redirects to `admin.html`.
4. On mismatch: shows an error message.

### `config.js` Dependency

`auth.js` reads credentials from `window.APP_CONFIG`, which is defined in `config.js`. If `config.js` is missing, an error is shown in the login form.

---

## 5. `assets/scripts/admin.js` — Admin Dashboard

Requires: `data.js`, `auth.js`, `config.js` (loaded first in `admin.html`).

### Auth Guard

```javascript
if (!isAdminLoggedIn()) {
    window.location.href = 'login.html';
}
```

This runs immediately when the script loads. If the session is not valid the admin is bounced to the login page before any dashboard logic runs.

### Section Navigation

The dashboard has two sections: "dashboard" and "products". `setActiveSection(sectionName)` shows the correct `<section>` by toggling the `hidden` class, updates the sidebar active state, and updates the top-bar page title.

### Statistics (`updateStats`)

Reads all items from localStorage, counts total items, unique categories (using a `Set`), available items, and out-of-stock items. Updates the four stat cards in the DOM.

### Recent Items (`renderRecentItems`)

Reads the last 5 items (using `.slice(-5).reverse()`) and renders them in an HTML table.

### Products Table (`renderProductsTable`)

Supports three simultaneous filters:
- **Search**: case-insensitive substring match on `name` or `category`
- **Category filter**: exact match on `category`
- **Status filter**: exact match on `status`

Each row has Edit (pencil) and Delete (trash) icon buttons. Event listeners are attached to each button after the table renders.

### Add / Edit Modal

- `openAddModal()` — resets the form and opens the modal.
- `openEditModal(id)` — finds the item by ID, pre-fills all form fields, and opens the modal.
- On form submit, validates Name, Category, and Price. Calls `addMenuItem` or `updateMenuItem` depending on whether `form-item-id` has a value.
- Image URL preview: an `input` event listener on the image URL field updates the preview `<img>` in real time.

### Delete Modal

- `openDeleteModal(id)` — shows the delete confirmation modal with the item's name.
- Stores the pending ID in `pendingDeleteId`.
- On confirm: calls `deleteMenuItem(pendingDeleteId)`, closes the modal, refreshes the dashboard.

### `refreshDashboard()`

Calls `updateStats()`, `renderRecentItems()`, `populateCategoryFilter()`, and `applyFilters()` in sequence. Called after every Add, Edit, or Delete operation.

---

## 6. `assets/styles/style.css` — Main Stylesheet

Defines styles for all sections on `index.html` and `menu.html`:
- CSS custom properties (variables) for colours, spacing, and font sizes
- Navbar with glass effect (`.scrolled` class)
- Hero section with Flexbox layout
- Menu card grid
- Testimonials placeholder (Swiper handles most of the slider styling)
- Gallery grid and lightbox overlay
- Contact section and footer
- Scroll-reveal animation (`@keyframes` for opacity + translateY)

## 7. `assets/styles/responsive.css` — Responsive Overrides

Media queries that adjust layout at each breakpoint:
- **`≤ 1024px`**: Adjust hero section, menu grid columns
- **`≤ 768px`**: Collapse navbar to hamburger, stack hero section vertically, single-column grids
- **`≤ 480px`**: Further font size reductions

## 8. `assets/styles/admin.css` — Admin Panel Stylesheet

Styles specific to `login.html` and `admin.html`:
- Login card: centred card with logo, form, and back link
- Sidebar: fixed-width sidebar with collapsed and mobile-open states
- Stats grid: responsive card grid
- Data table: striped rows with action icon buttons
- Modals: centred overlay with animation
- Badges: `.badge-available` (green) and `.badge-oos` (red)
