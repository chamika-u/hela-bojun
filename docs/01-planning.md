# Sprint Planning — Hela Bojun

## Project Overview

**Project Name:** Hela Bojun — Authentic Sri Lankan Cuisine Website  
**Client:** Sabaragamuwa University of Sri Lanka (SUSL) Cafeteria  
**Methodology:** Agile Scrum  
**Sprint Duration:** 1 week per sprint  
**Total Sprints:** 4  

---

## Project Goals

1. Build a fully responsive public-facing website showcasing the Hela Bojun cafeteria menu, location, and testimonials.
2. Provide an authenticated admin panel for cafeteria staff to manage menu items (add, edit, delete, toggle availability).
3. Ensure the website is accessible (ARIA attributes, keyboard navigation) and performs well (lazy loading, CDN assets).
4. Deploy the website as a static site (no backend required) using GitHub Pages.

---

## Team Roles

| Role | Responsibilities |
|---|---|
| **Product Owner** | Define backlog, prioritise user stories, accept completed work |
| **Scrum Master** | Facilitate ceremonies, remove blockers, track velocity |
| **Frontend Developer** | Build HTML/CSS/JS pages, implement interactive features |
| **UI/UX Designer** | Design wireframes, choose colour palette and typography |
| **QA Tester** | Write and execute manual test cases, file defects |

---

## Sprint Breakdown

### Sprint 1 — Foundation & Static Pages
**Goal:** Deliver a working landing page with all static sections.

| Story ID | User Story | Priority | Estimate (SP) |
|---|---|---|---|
| US-01 | As a visitor, I can view the hero banner with the brand name and CTA buttons | High | 2 |
| US-02 | As a visitor, I can read about the cafeteria in the About section | High | 1 |
| US-03 | As a visitor, I can see contact details and an embedded Google Map | High | 2 |
| US-04 | As a visitor, I can view the footer with social links and policies | Medium | 1 |
| US-05 | As a visitor, the site looks good on mobile, tablet, and desktop | High | 3 |

**Sprint 1 Velocity:** 9 story points

---

### Sprint 2 — Menu, Gallery & Testimonials
**Goal:** Deliver dynamic menu rendering, gallery lightbox, and testimonials carousel.

| Story ID | User Story | Priority | Estimate (SP) |
|---|---|---|---|
| US-06 | As a visitor, I can see best-selling menu items on the home page | High | 2 |
| US-07 | As a visitor, I can browse the full menu with category filters | High | 3 |
| US-08 | As a visitor, I can view enlarged gallery images in a lightbox | Medium | 2 |
| US-09 | As a visitor, I can swipe through customer testimonials | Medium | 2 |
| US-10 | As a visitor, menu items animate into view as I scroll | Low | 1 |

**Sprint 2 Velocity:** 10 story points

---

### Sprint 3 — Admin Authentication & Dashboard
**Goal:** Deliver a secure admin login and a product management dashboard.

| Story ID | User Story | Priority | Estimate (SP) |
|---|---|---|---|
| US-11 | As an admin, I can log in with a username and SHA-256 hashed password | High | 3 |
| US-12 | As an admin, I am redirected to login if I try to access the dashboard unauthenticated | High | 2 |
| US-13 | As an admin, I can view dashboard statistics (total items, categories, available, OOS) | High | 2 |
| US-14 | As an admin, I can add a new menu item with name, category, description, price, status, and image | High | 3 |
| US-15 | As an admin, I can edit an existing menu item | High | 2 |
| US-16 | As an admin, I can delete a menu item with a confirmation modal | High | 2 |
| US-17 | As an admin, I can search and filter products by name, category, and status | Medium | 2 |
| US-18 | As an admin, I can log out and my session is cleared | High | 1 |

**Sprint 3 Velocity:** 17 story points

---

### Sprint 4 — Polish, Accessibility & Deployment
**Goal:** Final refinements, accessibility audit, and GitHub Pages deployment.

| Story ID | User Story | Priority | Estimate (SP) |
|---|---|---|---|
| US-19 | As a user with a keyboard, I can navigate the entire site without a mouse | High | 3 |
| US-20 | As a screen reader user, all interactive elements have descriptive ARIA labels | High | 2 |
| US-21 | As a developer, the codebase is documented and the README covers setup and usage | Medium | 2 |
| US-22 | As a stakeholder, the website is deployed and accessible via a public URL | High | 2 |
| US-23 | As a developer, sensitive configuration (admin credentials) is never committed | High | 1 |

**Sprint 4 Velocity:** 10 story points

---

## Definition of Done (DoD)

A user story is considered **Done** when:

- [ ] The feature is implemented and works in Chrome, Firefox, and Edge.
- [ ] The feature is responsive (tested at 320px, 768px, 1024px, 1440px).
- [ ] ARIA labels are applied to all interactive elements.
- [ ] No console errors are thrown.
- [ ] The relevant manual test cases pass.
- [ ] Code is reviewed and merged into the main branch.

---

## Definition of Ready (DoR)

A user story is **Ready** to be taken into a sprint when:

- [ ] Acceptance criteria are clearly written.
- [ ] The story is estimated.
- [ ] Any design assets (colours, images) are available.
- [ ] Dependencies on other stories are resolved or noted.
