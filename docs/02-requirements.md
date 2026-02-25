# Requirements — Hela Bojun

## 1. Functional Requirements

### 1.1 Public Website

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The home page MUST display a hero section with the brand name, tagline, description, and two CTA buttons ("Order Now" and "Contact Us"). | High |
| FR-02 | The navbar MUST include links to Home, About Us, Menu, Testimonials, Gallery, Contact, and Admin. | High |
| FR-03 | On mobile, the navbar MUST collapse into a hamburger menu that opens/closes on button click. | High |
| FR-04 | The About section MUST display a description and social media icon links. | Medium |
| FR-05 | The Best Selling section on the home page MUST dynamically render up to all menu items from localStorage. | High |
| FR-06 | The full menu page MUST show only items with status `available`. | High |
| FR-07 | The menu page MUST provide category filter tabs (All + one per unique category). | High |
| FR-08 | The gallery section MUST contain at least 6 images with a click-to-enlarge lightbox. | Medium |
| FR-09 | The testimonials section MUST use a looping carousel with navigation arrows and pagination dots. | Medium |
| FR-10 | The contact section MUST show address, email, phone, operating hours, website URL, and an embedded Google Map. | High |
| FR-11 | The footer MUST display copyright text, social media links, and links to privacy and refund policy PDFs. | Medium |

### 1.2 Admin Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-12 | The login page MUST verify username and SHA-256 hashed password against values defined in `config.js`. | High |
| FR-13 | On successful login, a session flag MUST be stored in `sessionStorage` and the user MUST be redirected to `admin.html`. | High |
| FR-14 | If a user navigates to `admin.html` without a valid session, they MUST be redirected to `login.html`. | High |
| FR-15 | The login form MUST include a password visibility toggle button. | Low |
| FR-16 | On logout, the session flag MUST be cleared and the user MUST be redirected to `login.html`. | High |

### 1.3 Admin Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-17 | The dashboard MUST display four stat cards: Total Items, Categories, Available, Out of Stock. | High |
| FR-18 | The dashboard MUST display a "Recent Items" table showing the last 5 added items. | Medium |
| FR-19 | The Products section MUST display all menu items in a table with columns: Image, Name, Category, Price, Status, Actions. | High |
| FR-20 | The Products section MUST support searching items by name or category. | High |
| FR-21 | The Products section MUST support filtering by category and by status. | High |
| FR-22 | The admin MUST be able to add a new item with fields: Name (required), Category (required), Description, Price (required, > 0), Status, Image URL. | High |
| FR-23 | The admin MUST be able to edit any existing item using a pre-populated modal form. | High |
| FR-24 | The admin MUST be able to delete an item after confirming in a delete confirmation modal. | High |
| FR-25 | The sidebar MUST be collapsible on desktop and slide-in on mobile. | Medium |

---

## 2. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | The website MUST be responsive at breakpoints 320px, 768px, 1024px, and 1440px. |
| NFR-02 | All images MUST use `loading="lazy"` to defer off-screen image loading. |
| NFR-03 | The website MUST achieve a Lighthouse Performance score ≥ 80 on a simulated mobile device. |
| NFR-04 | All interactive UI elements MUST have accessible `aria-label` or `aria-labelledby` attributes. |
| NFR-05 | The website MUST work without a backend server; all data persistence uses `localStorage`. |
| NFR-06 | The `config.js` file containing admin credentials MUST be listed in `.gitignore` and MUST NOT be committed. |
| NFR-07 | The website MUST function correctly in the latest versions of Chrome, Firefox, Edge, and Safari. |
| NFR-08 | External CDN resources (Font Awesome, Swiper.js) MUST be loaded over HTTPS. |

---

## 3. Product Backlog

The full product backlog, organised by priority (MoSCoW):

### Must Have
- Responsive landing page (hero, about, contact, footer)
- Dynamic best-selling items from localStorage
- Full menu page with category filters
- Admin login with SHA-256 password hashing
- Admin CRUD for menu items
- Session-based authentication guard

### Should Have
- Gallery lightbox
- Testimonials carousel
- Scroll-reveal animations
- Admin sidebar collapse/expand
- Image URL preview in the add/edit modal
- Product search and filter

### Could Have
- Dark mode toggle
- Order submission form
- Email notifications for new orders
- Multi-language support (Sinhala / English)

### Won't Have (this release)
- Payment gateway integration
- Real-time inventory updates
- Mobile app

---

## 4. Acceptance Criteria Examples

### US-07 — Full Menu Page with Category Filters

**Given** I am on `menu.html`  
**When** the page loads  
**Then** I see all available menu items displayed in a grid  
**And** filter tabs are shown for "All" and each unique category  

**Given** I click a category tab (e.g., "Beverages")  
**When** the filter is applied  
**Then** only items in the "Beverages" category are shown  
**And** the clicked tab is visually highlighted as active  

### US-14 — Add New Menu Item

**Given** I am logged in as admin and on the Products section  
**When** I click "Add Item"  
**Then** a modal form opens with empty fields  

**Given** I fill in Name, Category, and Price and click "Save Item"  
**When** the form is submitted  
**Then** the new item appears in the products table  
**And** the dashboard stats update to reflect the new total  

**Given** I submit the form with Price = 0  
**When** validation runs  
**Then** an error message "Please enter a valid price." is shown and the item is NOT saved  
