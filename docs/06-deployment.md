# Deployment Guide — Hela Bojun

## Overview

Hela Bojun is a **fully static website** (HTML + CSS + JavaScript). It requires no server-side language, no build step, and no database. It can be served from any static file host.

---

## 1. Local Development

### Prerequisites

- Git
- A modern browser (Chrome, Firefox, Edge, or Safari)
- Optional: Node.js (for `npx serve`) or VS Code with the Live Server extension

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/chamika-u/hela-bojun.git
cd hela-bojun

# 2. Create your local config file (required for the admin panel)
cp assets/scripts/config.example.js assets/scripts/config.js
```

Edit `assets/scripts/config.js`:

```javascript
window.APP_CONFIG = {
    adminUsername: 'admin',
    adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};
```

> The hash `240be518...` is the SHA-256 of `admin123`.  
> To use a different password: `echo -n "yourpassword" | sha256sum`

### Serving the site locally

**Option A — VS Code Live Server** (recommended)
1. Install the Live Server extension.
2. Right-click `index.html` → **Open with Live Server**.
3. Opens at `http://127.0.0.1:5500/`.

**Option B — npx serve**
```bash
npx serve .
# Opens at http://localhost:3000
```

**Option C — Python**
```bash
python -m http.server 8080
# Opens at http://localhost:8080
```

> ⚠️ Do **not** just double-click `index.html` (file:// protocol). Some browsers block `localStorage` on `file://` URLs, which will prevent menu items from loading.

---

## 2. GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to the `main` branch.

### How it works

1. A push is made to the `main` branch.
2. GitHub Actions runs the `deploy` workflow.
3. The workflow publishes the repository root to the `gh-pages` branch.
4. GitHub Pages serves the site from the `gh-pages` branch.

### Manual deployment steps (if not using the workflow)

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Click **Save**. The site will be available at `https://<username>.github.io/hela-bojun/`.

### Important: `config.js` on GitHub Pages

Because `config.js` is gitignored, it is **not deployed** with the rest of the site. There are two options for production:

**Option 1 — Use a placeholder (no admin access in production)**

The public website works fine without `config.js`. Only the admin login will fail. This is acceptable for a demo deployment.

**Option 2 — GitHub Actions secret injection**

Add a GitHub Actions step that writes `config.js` from a repository secret before deployment:

```yaml
- name: Create config.js from secret
  run: |
    echo "window.APP_CONFIG = { adminUsername: '${{ secrets.ADMIN_USERNAME }}', adminPasswordHash: '${{ secrets.ADMIN_PASSWORD_HASH }}' };" > assets/scripts/config.js
```

Add `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` as repository secrets in **Settings → Secrets and variables → Actions**.

---

## 3. Other Static Hosts

| Host | How to deploy |
|---|---|
| **Netlify** | Drag and drop the project folder onto netlify.com, or connect the GitHub repo for auto-deploy |
| **Vercel** | `npx vercel` in the project directory, or connect the GitHub repo |
| **Cloudflare Pages** | Connect the GitHub repo; set build command to empty and output directory to `/` |
| **Firebase Hosting** | `firebase init hosting` → set public directory to `.` → `firebase deploy` |

All of these hosts support single static sites for free.

---

## 4. Deployment Checklist

Before deploying to production:

- [ ] `config.js` is NOT committed (check `.gitignore`)
- [ ] All image paths are relative (not absolute local paths)
- [ ] CDN links use HTTPS
- [ ] Google Map embed `src` is correct for the deployment URL
- [ ] No `console.log` debug statements left in production code
- [ ] Lighthouse audit passes (Performance ≥ 80, Accessibility ≥ 90)
- [ ] The site works correctly after a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## 5. Resetting Demo Data

Because menu items are stored in the visitor's `localStorage`, each visitor has their own independent copy of the menu data. To reset to the default 6 items:

1. Open Chrome DevTools (F12).
2. Go to **Application** → **Local Storage** → select the site origin.
3. Find the key `helaBojunMenuItems` and delete it.
4. Reload the page — the default items will be seeded again automatically.

Alternatively, open the browser console and run:

```javascript
localStorage.removeItem('helaBojunMenuItems');
location.reload();
```
