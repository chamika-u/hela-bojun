# Design — Hela Bojun

## 1. System Architecture

Hela Bojun is a **client-side only** static website. There is no backend server, no database, and no server-side rendering. All dynamic behaviour is handled in the browser.

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│                                                          │
│  ┌──────────────┐   ┌────────────────┐   ┌───────────┐  │
│  │  index.html  │   │   menu.html    │   │admin.html │  │
│  │  login.html  │   │                │   │           │  │
│  └──────┬───────┘   └───────┬────────┘   └─────┬─────┘  │
│         │                   │                  │        │
│         └───────────────────┼──────────────────┘        │
│                             │                            │
│                    ┌────────▼────────┐                   │
│                    │  JavaScript     │                   │
│                    │  data.js        │                   │
│                    │  script.js      │                   │
│                    │  menu.js        │                   │
│                    │  auth.js        │                   │
│                    │  admin.js       │                   │
│                    └────────┬────────┘                   │
│                             │ read / write               │
│                    ┌────────▼────────┐                   │
│                    │  localStorage   │  (menu items)     │
│                    │  sessionStorage │  (auth flag)      │
│                    └─────────────────┘                   │
│                                                          │
│  External CDNs (loaded over HTTPS):                      │
│  • Swiper.js v11  (cdn.jsdelivr.net)                     │
│  • Font Awesome 6 (cdnjs.cloudflare.com)                 │
└──────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| No backend | Simplifies deployment; can be hosted on GitHub Pages for free |
| `localStorage` for menu data | Allows the admin to persist changes without a database |
| `sessionStorage` for auth | Session clears when the browser tab is closed, improving security |
| SHA-256 password hashing | Credentials are never stored in plaintext; uses the built-in Web Crypto API |
| `config.js` gitignored | Admin credentials stay off version control |

---

## 2. Data Model

### Menu Item Object

```javascript
{
    id: Number,           // Auto-incremented unique identifier
    name: String,         // Display name (required)
    category: String,     // e.g. "Main Course", "Beverages" (required)
    description: String,  // Short description (optional)
    price: Number,        // Price in Sri Lankan Rupees (required, > 0)
    status: String,       // "available" | "out-of-stock"
    image: String         // Relative or absolute image URL
}
```

### localStorage Keys

| Key | Value |
|---|---|
| `helaBojunMenuItems` | `JSON.stringify(menuItemsArray)` |

### sessionStorage Keys

| Key | Value |
|---|---|
| `helaBojunAdminAuth` | `"true"` when logged in |

---

## 3. Page Structure

### `index.html` — Home Page

```
<header>
  <nav class="navbar">          ← Logo + navigation links + mobile toggle
</header>
<main>
  <section#home>                ← Hero: title, subtitle, description, CTA buttons
  <section#about>               ← About: image + text + social links
  <section#menu>                ← Best Selling: dynamically rendered by script.js
  <section#testimonials>        ← Swiper carousel with 5 customer reviews
  <section#gallery>             ← 6 gallery images + lightbox overlay
  <section#contact>             ← Contact list + embedded Google Map
  <footer>                      ← Copyright, social links, policy links
</main>
```

### `menu.html` — Full Menu Page

```
<header>
  <nav class="navbar">
</header>
<main>
  <section.menu-page-hero>      ← Page title and subtitle
  <section.menu-page-section>
    <div#menu-filter-tabs>      ← Category filter buttons (built by menu.js)
    <div#menu-grid>             ← Menu card grid (rendered by menu.js)
</main>
<footer>
```

### `login.html` — Admin Login

```
<body.login-page>
  <div.login-wrapper>
    <div.login-card>
      <div.login-header>        ← Brand logo + "Admin Dashboard"
      <form#login-form>         ← Username + password + toggle button + error display
      <a.login-back>            ← Back to main site link
```

### `admin.html` — Admin Dashboard

```
<body>
  <aside.sidebar>               ← Logo, Dashboard nav, Products nav, Main Site link
  <main.admin-main>
    <header.admin-topbar>       ← Hamburger, page title, View Site link, Logout
    <section#section-dashboard> ← Stats grid + recent items table
    <section#section-products>  ← Toolbar, filter bar, products table
  <div#product-modal>           ← Add/Edit item modal
  <div#delete-modal>            ← Delete confirmation modal
```

---

## 4. UI/UX Design Decisions

### Colour Palette

| Role | Value | Usage |
|---|---|---|
| Primary Green | `#4caf50` / `#2e7d32` | Buttons, badges, accents |
| Amber | `#f59e0b` | Category badges |
| Text Dark | `#1a1a1a` | Body text |
| Text Muted | `#6b7280` | Secondary text |
| Background | `#f9fafb` | Page background |
| White | `#ffffff` | Cards, modals |

### Typography

- **Body / UI**: System font stack (sans-serif) for fast load
- **Brand logo**: Sinhala script character `හෙළ බොජුන්` rendered in the browser's default Sinhala font

### Responsive Breakpoints

| Breakpoint | Devices |
|---|---|
| `< 768px` | Mobile phones |
| `768px – 1023px` | Tablets |
| `≥ 1024px` | Desktops and laptops |

### Navbar Glassmorphism

When the user scrolls more than 50 px, the class `scrolled` is added to `<header>`. This class applies a `backdrop-filter: blur()` and semi-transparent background, creating a frosted-glass effect on the navbar.

### Scroll-Reveal Animation

Menu cards and gallery items use the **Intersection Observer API**. When an element enters the viewport (with 12% threshold), the class `revealed` is added, triggering a CSS opacity + translateY animation.

### Swiper.js Carousel Configuration

```javascript
{
    loop: true,
    grabCursor: true,
    spaceBetween: 25,
    pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
        0:    { slidesPerView: 1 },
        768:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
}
```

---

## 5. Security Design

| Concern | Mitigation |
|---|---|
| Admin credential exposure | `config.js` is gitignored; credentials are never in version control |
| Plaintext password storage | Passwords are hashed with SHA-256 using the Web Crypto API before comparison |
| Session hijacking | `sessionStorage` is used (not `localStorage`) so auth is cleared on tab close |
| XSS via admin input | Image URL is rendered with `<img src="...">` — the browser sanitises this attribute; text fields use `textContent` or template literal insertion into non-executable attributes |
