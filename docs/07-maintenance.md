# Maintenance & Retrospective — Hela Bojun

## 1. Sprint Retrospective

### What Went Well

- The decision to use **vanilla JavaScript** (no frameworks) kept the codebase small, fast, and dependency-free.
- Using the **Web Crypto API** for SHA-256 hashing meant no external crypto library was needed.
- **localStorage** as the data store made the project fully deployable as a static site — no backend infrastructure required.
- The **Intersection Observer** scroll-reveal pattern is performant and requires no third-party animation library.
- **Swiper.js** handled all carousel complexity (loop, responsive breakpoints, pagination, navigation) with minimal configuration.

### What Could Be Improved

- The mobile nav and scroll-glassmorphism logic is duplicated in both `script.js` and `menu.js`. This could be extracted into a shared `nav.js` module.
- The admin authentication relies on `sessionStorage` and a client-side config file. For a production system, server-side authentication would be more secure.
- There is no automated test suite. Adding unit tests (e.g., for `data.js` CRUD functions using Jest) would increase confidence during future changes.
- `localStorage` data is browser-specific. An admin change on one browser is not reflected on another. A backend API + database would solve this.

### Action Items for Next Sprint

| Action | Owner | Priority |
|---|---|---|
| Extract shared nav logic into `nav.js` | Developer | Medium |
| Add unit tests for `data.js` | Developer | Medium |
| Evaluate replacing `localStorage` with a lightweight backend (e.g., Supabase) | Product Owner | Low |
| Add a proper favicon | Designer | Low |

---

## 2. Known Issues

| ID | Description | Severity | Status |
|---|---|---|---|
| BUG-01 | `config.js` must be created manually; no helpful error if missing on a fresh clone | Low | Open |
| BUG-02 | Admin changes in `localStorage` are browser-local; a second browser/device will always see the seed data | Medium | By Design |
| BUG-03 | No form validation on the image URL field — entering a broken URL shows a broken image icon | Low | Open |
| BUG-04 | Testimonial user images are hard-coded in `index.html`; they cannot be managed via the admin panel | Low | Open |

---

## 3. Future Enhancements (Product Backlog)

### Next Release

| Feature | Description |
|---|---|
| **Online Order Form** | A form on the menu page where customers can select items and submit a pickup order |
| **Email Notifications** | Notify the cafeteria via email when a new order is submitted (e.g., using EmailJS) |
| **Dark Mode** | A toggle in the navbar to switch between light and dark themes |
| **Sinhala Language Toggle** | Show all text in Sinhala (සිංහල) or English |
| **Favicon** | Add a Sri Lankan-themed favicon |

### Future Release

| Feature | Description |
|---|---|
| **Backend API** | Replace localStorage with a REST API + database (e.g., Node.js + MongoDB or Supabase) |
| **Real-time Inventory** | Mark items as out-of-stock in real time across all visitors |
| **Admin Image Upload** | Allow admins to upload image files instead of entering a URL |
| **Multiple Admin Roles** | Superadmin and regular staff with different permission levels |
| **Analytics Dashboard** | Track page views, popular menu items, and peak hours |

---

## 4. Dependency Versions

| Dependency | Version | CDN URL |
|---|---|---|
| Font Awesome | 6.0.0-beta3 | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css` |
| Swiper.js | 11 (latest) | `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js` |

To update Swiper.js to a newer version, change `@11` to `@<new-version>` in both the CSS `<link>` and JS `<script>` tags in `index.html`.

---

## 5. Maintenance Checklist

Perform the following checks periodically:

- [ ] Verify CDN links for Font Awesome and Swiper.js are still active
- [ ] Test all pages in the latest browser versions
- [ ] Review `localStorage` data model if menu item schema changes
- [ ] Update the Google Maps embed URL if the cafeteria location changes
- [ ] Rotate admin credentials if staff changes (update `config.js` locally and re-deploy)
- [ ] Check that policy PDFs (`privacy-policy.pdf`, `refund-policy.pdf`) are current
- [ ] Run a Lighthouse audit and address any new issues

---

## 6. Agile Artefacts Summary

| Artefact | Document |
|---|---|
| Sprint Plan & User Stories | `docs/01-planning.md` |
| Requirements & Backlog | `docs/02-requirements.md` |
| Architecture & Design | `docs/03-design.md` |
| Code Walkthrough | `docs/04-development.md` |
| Test Cases | `docs/05-testing.md` |
| Deployment Guide | `docs/06-deployment.md` |
| Retrospective & Maintenance | `docs/07-maintenance.md` (this file) |
