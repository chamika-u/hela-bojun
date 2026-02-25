// Admin Authentication – Hela Bojun
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const AUTH_KEY = 'helaBojunAdminAuth';

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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
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
