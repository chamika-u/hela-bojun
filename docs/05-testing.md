# Testing — Hela Bojun

## 1. Testing Strategy

Hela Bojun is a client-side static website with no build toolchain or automated test runner. Testing is performed **manually** using the browser's developer tools and structured test cases.

| Test Type | Tool | When |
|---|---|---|
| Manual functional testing | Chrome DevTools | After each sprint |
| Responsive / cross-browser | Chrome, Firefox, Edge, Safari | Before deployment |
| Accessibility audit | Lighthouse (Chrome DevTools) | Sprint 4 |
| Console error check | Browser DevTools Console | After each feature |

---

## 2. Test Environment Setup

1. Serve the project locally (see `docs/06-deployment.md` — Local Development section).
2. Create `assets/scripts/config.js` with demo credentials:
   ```javascript
   window.APP_CONFIG = {
       adminUsername: 'admin',
       adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
   };
   ```
   (Hash is SHA-256 of `admin123`)
3. Open Chrome DevTools (F12) to the **Console** tab. All tests should produce zero errors.

---

## 3. Manual Test Cases

### TC-01: Home Page Load

| Step | Expected Result |
|---|---|
| Open `index.html` | Page loads without console errors |
| Check hero section | Brand name, tagline, description, and two buttons are visible |
| Check navbar | All 7 links are visible on desktop |
| Scroll down 100px | Navbar gains glassmorphism effect |
| Scroll back to top | Glassmorphism effect is removed |

---

### TC-02: Mobile Navigation

| Step | Expected Result |
|---|---|
| Resize browser to 375px wide | Hamburger icon (☰) is visible; nav links are hidden |
| Click hamburger icon | Mobile menu slides open; links are visible |
| Click a nav link | Menu closes and page scrolls to the section |
| Click close button (✕) | Mobile menu closes |

---

### TC-03: Best Selling Menu (Home Page)

| Step | Expected Result |
|---|---|
| First visit (clear localStorage first: DevTools → Application → localStorage → clear) | 6 default menu items are displayed |
| Scroll the menu section | Each card animates in as it enters the viewport |
| Check localStorage (DevTools → Application → localStorage) | Key `helaBojunMenuItems` contains a JSON array of 6 items |

---

### TC-04: Full Menu Page

| Step | Expected Result |
|---|---|
| Click "Menu" in navbar | Navigates to `menu.html` |
| Page loads | Category filter tabs are shown (All, Main Course, Beverages, Short Eats, Desserts) |
| "All" tab is active by default | All available items are displayed |
| Click "Beverages" tab | Only "Avocado Juice" is shown |
| Click "All" tab again | All items are shown |
| Set an item to "out-of-stock" in admin, then reload menu page | That item no longer appears |

---

### TC-05: Gallery Lightbox

| Step | Expected Result |
|---|---|
| Click any gallery image | Full-size image appears in lightbox overlay |
| Background scrolling | Page does not scroll while lightbox is open |
| Click the × close button | Lightbox closes |
| Click outside the image | Lightbox closes |
| Press Escape key | Lightbox closes |
| Tab to a gallery image and press Enter | Lightbox opens (keyboard accessibility) |

---

### TC-06: Testimonials Carousel

| Step | Expected Result |
|---|---|
| Scroll to testimonials section | Carousel is displayed with visible slides |
| Click the next arrow (→) | Carousel advances to the next slide |
| Click the previous arrow (←) | Carousel goes back one slide |
| Click a pagination dot | Carousel jumps to that slide |
| Resize to 768px | 2 slides are shown at once |
| Resize to 375px | 1 slide is shown at once |

---

### TC-07: Admin Login — Success

| Step | Expected Result |
|---|---|
| Navigate to `login.html` | Login card is displayed |
| Enter username `admin`, password `admin123` | No error shown yet |
| Click "Sign In" | Redirected to `admin.html` |
| Check sessionStorage (DevTools → Application) | Key `helaBojunAdminAuth` = `"true"` |

---

### TC-08: Admin Login — Failure

| Step | Expected Result |
|---|---|
| Navigate to `login.html` | Login card is displayed |
| Enter username `admin`, password `wrongpassword` | — |
| Click "Sign In" | Error message "Invalid username or password. Please try again." is shown |
| Page does NOT redirect | User stays on `login.html` |

---

### TC-09: Admin Auth Guard

| Step | Expected Result |
|---|---|
| Clear sessionStorage (DevTools → Application → sessionStorage → clear) | — |
| Navigate directly to `admin.html` | Immediately redirected to `login.html` |

---

### TC-10: Password Visibility Toggle

| Step | Expected Result |
|---|---|
| On `login.html`, type a password | Characters are hidden (dots) |
| Click the eye icon (👁) | Password is shown as plain text |
| Click the eye icon again | Password is hidden again |

---

### TC-11: Admin Dashboard Stats

| Step | Expected Result |
|---|---|
| Log in and land on admin dashboard | Stats cards show: Total Items = 6, Categories = 4, Available = 6, Out of Stock = 0 |
| Add a new item | Total Items increments by 1 |
| Set an item to out-of-stock | Out of Stock increments by 1, Available decrements by 1 |

---

### TC-12: Add Menu Item

| Step | Expected Result |
|---|---|
| Click "Products" in sidebar | Products table is shown |
| Click "Add Item" | Modal opens with empty fields |
| Submit with Name empty | Error "Item name is required." is shown |
| Submit with Price = 0 | Error "Please enter a valid price." is shown |
| Fill Name="Test Dish", Category="Main Course", Price=300, Status=Available | — |
| Click "Save Item" | Modal closes; new item appears in the products table |
| Check Recent Items on Dashboard | New item appears at the top |

---

### TC-13: Edit Menu Item

| Step | Expected Result |
|---|---|
| Click the pencil icon on any item | Modal opens pre-populated with that item's data |
| Change the price to 999 | — |
| Click "Save Item" | Modal closes; updated price is shown in the table |
| Open full menu page | Updated price is shown |

---

### TC-14: Delete Menu Item

| Step | Expected Result |
|---|---|
| Click the trash icon on any item | Delete confirmation modal opens showing the item name |
| Click "Cancel" | Modal closes; item is NOT deleted |
| Click trash icon again, then click "Delete" | Item is removed from the table; stats update |

---

### TC-15: Product Search and Filter

| Step | Expected Result |
|---|---|
| Type "rice" in the search box | Only "Rice and Curry" is shown |
| Clear search, select "Beverages" from category filter | Only "Avocado Juice" is shown |
| Select "Out of Stock" from status filter (with no OOS items) | "No items found." empty state is shown |

---

### TC-16: Admin Logout

| Step | Expected Result |
|---|---|
| Click "Logout" button | Redirected to `login.html` |
| Check sessionStorage | `helaBojunAdminAuth` key no longer exists |
| Press browser Back button | Cannot return to `admin.html`; redirected to `login.html` again |

---

## 4. Cross-Browser Test Matrix

| Browser | Version | Home | Menu | Login | Admin |
|---|---|---|---|---|---|
| Chrome | Latest | ✅ | ✅ | ✅ | ✅ |
| Firefox | Latest | ✅ | ✅ | ✅ | ✅ |
| Edge | Latest | ✅ | ✅ | ✅ | ✅ |
| Safari | Latest | ✅ | ✅ | ✅ | ✅ |

---

## 5. Accessibility Checklist

- [ ] All images have descriptive `alt` attributes
- [ ] All icon-only buttons have `aria-label` attributes
- [ ] Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Navigation has `role="navigation"` and `aria-label`
- [ ] Gallery images have `tabindex="0"`, `role="button"`, and keyboard event handlers
- [ ] Carousel has ARIA attributes provided by Swiper.js
- [ ] Error messages use `role="alert"`
- [ ] Colour contrast ratio ≥ 4.5:1 for normal text
