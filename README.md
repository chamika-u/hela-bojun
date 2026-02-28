# 🍛 හෙළ බොජුන් — Authentic Sri Lankan Cuisine Website

A modern, responsive website for **Hela Bojun**, the cafeteria at **Sabaragamuwa University of Sri Lanka**, offering healthy and authentic Sri Lankan dishes, beverages, sweets, and short eats. Built with **HTML5**, **CSS3**, and **Vanilla JavaScript** — no frameworks required.

> 📚 Full Agile SDLC documentation is available in the [`docs/`](docs/) directory.

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Start the Website](#-how-to-start-the-website)
- [How to Use the Website](#-how-to-use-the-website)
- [Admin Panel & Demo Login Credentials](#-admin-panel--demo-login-credentials)
- [Configuration Reference](#-configuration-reference)
- [Image Disclaimer](#-image-disclaimer)
- [Documentation](#-documentation)

---

## ✅ Features

- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile.
- **Pages & Sections**:
  - **Home (`index.html`)** — Hero, About Us, Best Selling Menu, Testimonials, Gallery, Contact, Footer
  - **Menu (`menu.html`)** — Full menu grid with dynamic category filter tabs
  - **Admin Login (`login.html`)** — Secure credential-based login
  - **Admin Dashboard (`admin.html`)** — Product management CRUD panel
- **Interactive Elements**:
  - Mobile navigation toggle (hamburger menu)
  - Swiper.js testimonials carousel with pagination and navigation arrows
  - Gallery lightbox (click to enlarge images, keyboard-accessible)
  - Scroll-reveal animations on menu cards
- **Admin Dashboard**:
  - Overview statistics (total items, categories, available, out-of-stock)
  - Add, edit, and delete menu items
  - Search and filter by category / status
  - Image URL preview
  - Session-based authentication (SHA-256 password hashing)
- **Data Persistence** — Menu items stored in browser `localStorage`; no backend required
- **Accessibility**:
  - Semantic HTML5 tags
  - ARIA attributes for navigation, carousel, modals, and gallery
  - Keyboard-friendly interactions (Enter/Space for gallery, Escape to close modals)

---

## 📸 Screenshots

### Home Page
![Home](frontend/assets/images/screenshot.png)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Responsive layout using Flexbox & Grid |
| **JavaScript (ES6+)** | DOM manipulation, interactivity, localStorage |
| **Swiper.js v11** | Testimonials slider |
| **Font Awesome 6** | Icons throughout the UI |

---

## 📁 Project Structure

```
hela-bojun/
├── frontend/                   # All client-facing static files
│   ├── index.html              # Main landing page
│   ├── menu.html               # Full menu page
│   ├── about.html              # About Us page
│   ├── login.html              # Admin login page
│   ├── admin.html              # Admin dashboard
│   ├── contact.html            # Contact & inquiry page
│   └── assets/
│       ├── images/             # All image assets
│       ├── scripts/
│       │   ├── data.js         # Menu data model + localStorage CRUD
│       │   ├── script.js       # Home page interactions (navbar, swiper, lightbox)
│       │   ├── menu.js         # Menu page rendering + category filters
│       │   ├── about.js        # About page interactions
│       │   ├── contact.js      # Contact form multi-step logic
│       │   ├── auth.js         # Admin authentication logic
│       │   ├── admin.js        # Admin dashboard logic
│       │   ├── config.example.js  # Config template (copy → config.js)
│       │   └── config.js       # ⚠️ Your local config (gitignored, not committed)
│       ├── styles/
│       │   ├── style.css       # Main stylesheet
│       │   ├── responsive.css  # Responsive/media query overrides
│       │   └── admin.css       # Admin panel stylesheet
│       └── policies/
│           ├── privacy-policy.pdf
│           └── refund-policy.pdf
├── backend/                    # Node.js/Express server
│   ├── server.js               # Express static file server
│   ├── package.json            # Node.js dependencies
│   └── .env.example            # Environment variable template
├── docs/                       # Agile SDLC documentation
│   ├── 01-planning.md
│   ├── 02-requirements.md
│   ├── 03-design.md
│   ├── 04-development.md
│   ├── 05-testing.md
│   ├── 06-deployment.md
│   └── 07-maintenance.md
└── README.md
```

---

## 🚀 How to Start the Website

### Option 1 — Backend server with Node.js (recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chamika-u/hela-bojun.git
   cd hela-bojun
   ```

2. **Create your `config.js`** (required for the admin panel):
   ```bash
   cp frontend/assets/scripts/config.example.js frontend/assets/scripts/config.js
   ```

3. **Install backend dependencies and start the server**:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

---

### Option 2 — Open directly in a browser (quickest)

1. **Clone the repository** and create `config.js` as above.
2. **Open `frontend/index.html`** in any modern browser (Chrome, Firefox, Edge, Safari).

> ⚠️ Some browsers block `localStorage` for `file://` URLs. If the menu does not load, use Option 1 or one of the options below.

---

### Option 3 — VS Code Live Server (recommended for development)

1. Install the **Live Server** extension in VS Code.
2. Right-click `frontend/index.html` → **Open with Live Server**.
3. The site will open at `http://127.0.0.1:5500/frontend/` and auto-reload on save.

---

### Option 4 — `npx serve` (Node.js required)

```bash
cd hela-bojun
npx serve frontend
```

The site will be available at `http://localhost:3000`.

---

### Option 5 — Python HTTP server

```bash
cd hela-bojun/frontend
# Python 3
python -m http.server 8080
# Python 2
python -m SimpleHTTPServer 8080
```

Open `http://localhost:8080` in your browser.

---

## 🖥 How to Use the Website

### Public Website

| Section | How to access | Description |
|---|---|---|
| **Home** | Click *Home* in navbar or scroll to top | Hero banner with brand name and CTA buttons |
| **About Us** | Click *About Us* in navbar | Mission statement and social links |
| **Best Selling** | Scroll down on home page | Top menu items dynamically loaded from localStorage |
| **Full Menu** | Click *Menu* in navbar or *Order Now* button | Full menu page with category filter tabs |
| **Testimonials** | Scroll down on home page | Customer reviews carousel (use arrows or swipe) |
| **Gallery** | Scroll down on home page | Click any image to view it full-size in a lightbox |
| **Contact** | Click *Contact* in navbar | Address, email, phone, hours, and embedded Google Map |

### Menu Page (`menu.html`)

- Use the **category filter tabs** (All, Main Course, Beverages, Short Eats, Desserts) to filter items.
- Only items with status **Available** are shown to customers.
- Items appear with a smooth scroll-reveal animation.

### Gallery Lightbox

- **Click** any gallery image to open it full-size.
- Press **Escape** or click outside the image to close.
- Keyboard: focus an image with **Tab**, then press **Enter** or **Space** to open.

---

## 🔐 Admin Panel & Demo Login Credentials

The admin panel allows staff to manage menu items (add, edit, delete, toggle availability).

### 1. Set up demo credentials

Create `frontend/assets/scripts/config.js` (this file is gitignored and must be created locally):

```javascript
window.APP_CONFIG = {
    adminUsername: 'admin',
    adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};
```

> The hash above is the SHA-256 of the password `admin123`.

### 2. Demo login credentials

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Login URL** | `login.html` (or click *Admin* in the navbar) |

### 3. Using the Admin Dashboard

After logging in you will see:

- **Dashboard tab** — Overview statistics (total items, categories, available, out-of-stock) and a recent items table.
- **Products tab** — Full product table with search, category filter, and status filter.
  - **Add Item** — Click the green *Add Item* button, fill in the form, and click *Save Item*.
  - **Edit Item** — Click the pencil icon on any row to update an item.
  - **Delete Item** — Click the trash icon; a confirmation modal will appear.
- **Logout** — Click *Logout* in the top-right corner.
- **View Site** — Opens the main public website in the same tab.

> Menu changes are saved to `localStorage` and immediately reflected on the public menu page when refreshed.

### 4. Changing the password

Generate a SHA-256 hash of your new password and update `config.js`:

```bash
# Linux / macOS
echo -n "yournewpassword" | sha256sum

# Windows PowerShell
(Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes("yournewpassword"))) -Algorithm SHA256).Hash.ToLower()
```

---

## ⚙️ Configuration Reference

| File | Purpose |
|---|---|
| `frontend/assets/scripts/config.example.js` | Template — copy to `config.js` |
| `frontend/assets/scripts/config.js` | **Gitignored** — holds real admin credentials |
| `backend/.env.example` | Documents environment variables |

`config.js` structure:

```javascript
window.APP_CONFIG = {
    adminUsername: '<your-username>',
    adminPasswordHash: '<sha256-of-your-password>'
};
```

---

## ⚠️ Image Disclaimer

All images used in this website are either:
- **Sourced from the internet** (ownership belongs to the original creators).
- **AI-generated** for demonstration purposes.

This project does **not claim ownership** of any externally sourced images. They are used solely for academic and non-commercial purposes.

---

## 📚 Documentation

Full Agile SDLC documentation is in the [`docs/`](docs/) folder:

| File | Content |
|---|---|
| [`docs/01-planning.md`](docs/01-planning.md) | Sprint planning, project goals, team roles, user stories |
| [`docs/02-requirements.md`](docs/02-requirements.md) | Functional & non-functional requirements, product backlog |
| [`docs/03-design.md`](docs/03-design.md) | Architecture, UI/UX design decisions, data model |
| [`docs/04-development.md`](docs/04-development.md) | Full code walkthrough — every file explained |
| [`docs/05-testing.md`](docs/05-testing.md) | Testing strategy, manual test cases |
| [`docs/06-deployment.md`](docs/06-deployment.md) | Deployment guide (GitHub Pages & local) |
| [`docs/07-maintenance.md`](docs/07-maintenance.md) | Sprint retrospective, known issues, future enhancements |

---

### Made by **[chamika-u](https://github.com/chamika-u)**

---
