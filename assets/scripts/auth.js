// Admin Authentication – Hela Bojun

const AUTH_KEY = 'helaBojunAdminAuth';

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function isAdminLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function adminLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

// ---- Login page logic (runs only when login-form exists) ----
const loginForm = document.getElementById('login-form');
if (loginForm) {
    // Already logged in → skip login
    if (isAdminLoggedIn()) {
        window.location.href = 'admin.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        const config = window.APP_CONFIG;
        if (!config) {
            errorEl.textContent = 'Configuration not loaded. Please ensure config.js is present.';
            errorEl.classList.remove('hidden');
            return;
        }

        const passwordHash = await hashPassword(password);

        if (username === config.adminUsername && passwordHash === config.adminPasswordHash) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            window.location.href = 'admin.html';
        } else {
            errorEl.textContent = 'Invalid username or password. Please try again.';
            errorEl.classList.remove('hidden');
        }
    });

    // Toggle password visibility
    const toggleBtn = document.getElementById('toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const input = document.getElementById('login-password');
            const icon = toggleBtn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}
