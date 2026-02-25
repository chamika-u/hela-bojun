// contact.js – Hela Bojun Contact Us Page

// ── Navbar helpers ──────────────────────────────────────────────────────────

const menuOpenButton = document.getElementById('menu-open-button');
const menuCloseButton = document.getElementById('menu-close-button');
const navMenu = document.querySelector('.nav-menu');

if (menuOpenButton) {
    menuOpenButton.addEventListener('click', () => document.body.classList.toggle('show-mobile-menu'));
}
if (menuCloseButton) {
    menuCloseButton.addEventListener('click', () => document.body.classList.remove('show-mobile-menu'));
}
if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            document.body.classList.remove('show-mobile-menu');
        }
    });
}

const siteHeader = document.querySelector('header');
if (siteHeader) {
    window.addEventListener('scroll', () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ── Product list (reads from data.js seed or localStorage) ──────────────────

function getProducts() {
    const stored = typeof getMenuItems === 'function' ? getMenuItems() : null;
    if (stored && stored.length > 0) return stored;
    return typeof DEFAULT_MENU_ITEMS !== 'undefined' ? DEFAULT_MENU_ITEMS : [];
}

// ── Render product grids ────────────────────────────────────────────────────

function renderProductGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const products = getProducts();
    container.innerHTML = products.map(p => `
        <label class="product-check-card" for="prod-${containerId}-${p.id}">
            <input type="checkbox" name="selected_products" id="prod-${containerId}-${p.id}"
                   value="${escapeHtml(p.name)}" class="sr-only">
            <div class="pcc-icon"><i class="fas fa-utensils"></i></div>
            <span class="pcc-name">${escapeHtml(p.name)}</span>
            <span class="pcc-cat">${escapeHtml(p.category)}</span>
            <span class="pcc-check"><i class="fas fa-check"></i></span>
        </label>
    `).join('');

    // Toggle selected state
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.closest('.product-check-card').classList.toggle('selected', cb.checked);
        });
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── Step management ─────────────────────────────────────────────────────────

let currentStep = 1;
const TOTAL_STEPS = 3;

function showStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(n === 'success' ? 'step-success' : `step-${n}`);
    if (target) target.classList.add('active');

    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const progressSteps = document.querySelectorAll('.progress-step');

    if (n === 'success') {
        if (progressFill) progressFill.style.width = '100%';
        progressSteps.forEach(s => s.classList.add('completed'));
        document.getElementById('form-progress').classList.add('hidden');
        return;
    }

    if (progressFill) {
        progressFill.style.width = `${((n - 1) / (TOTAL_STEPS - 1)) * 100}%`;
    }
    progressSteps.forEach(s => {
        const sn = parseInt(s.dataset.step);
        s.classList.toggle('active', sn === n);
        s.classList.toggle('completed', sn < n);
    });
    document.getElementById('form-progress').classList.remove('hidden');
}

// ── Option card radio/checkbox toggling ────────────────────────────────────

function bindOptionCards(scope) {
    scope.querySelectorAll('.option-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            scope.querySelectorAll(`.option-card input[name="${radio.name}"]`).forEach(r => {
                r.closest('.option-card').classList.toggle('selected', r.checked);
            });
        });
    });
}

function bindInquiryTypeCards() {
    document.querySelectorAll('.inquiry-type-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.inquiry-type-card').forEach(c => c.classList.remove('selected'));
            radio.closest('.inquiry-type-card').classList.add('selected');
        });
    });
}

function bindComplaintCatCards() {
    document.querySelectorAll('.complaint-cat-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.complaint-cat-card').forEach(c => c.classList.remove('selected'));
            radio.closest('.complaint-cat-card').classList.add('selected');
            // Show relevant sub-panel
            document.querySelectorAll('.complaint-sub').forEach(s => s.classList.add('hidden'));
            const sub = document.getElementById(`comp-sub-${radio.value}`);
            if (sub) {
                sub.classList.remove('hidden');
                sub.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── "Other" text input for General Inquiries ───────────────────────────────

function bindGeneralOther() {
    document.querySelectorAll('input[name="general_issue"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const otherBox = document.getElementById('general-other-text');
            if (otherBox) {
                otherBox.classList.toggle('hidden', radio.value !== 'other');
            }
        });
    });
}

// ── Character counter for message textarea ─────────────────────────────────

function bindCharCounter() {
    const textarea = document.getElementById('message');
    const counter = document.getElementById('char-count');
    if (!textarea || !counter) return;
    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
    });
}

// ── Validation helpers ──────────────────────────────────────────────────────

function showError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function hideError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function getSelectedRadio(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
}

function getCheckedProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
}

// ── Step 1 Validation ────────────────────────────────────────────────────────

function validateStep1() {
    const type = getSelectedRadio('inquiry_type');
    if (!type) {
        showError('error-step1');
        return false;
    }
    hideError('error-step1');
    return true;
}

// ── Step 2 Validation ────────────────────────────────────────────────────────

function validateStep2() {
    const type = getSelectedRadio('inquiry_type');

    if (type === 'general') {
        const issue = getSelectedRadio('general_issue');
        if (!issue) {
            showError('error-step2-general');
            return false;
        }
        if (issue === 'other') {
            const detail = document.getElementById('general_other_detail');
            if (!detail || detail.value.trim().length < 3) {
                showError('error-step2-general');
                return false;
            }
        }
        hideError('error-step2-general');
        return true;
    }

    if (type === 'product') {
        const products = getCheckedProducts('product-grid-inquiry');
        const issue = getSelectedRadio('product_issue');
        if (products.length === 0 || !issue) {
            showError('error-step2-product');
            return false;
        }
        hideError('error-step2-product');
        return true;
    }

    if (type === 'complaint') {
        const cat = getSelectedRadio('complaint_category');
        if (!cat) {
            showError('error-step2-complaint');
            return false;
        }
        let subIssue = null;
        if (cat === 'product') {
            const products = getCheckedProducts('product-grid-complaint');
            subIssue = getSelectedRadio('comp_product_issue');
            if (products.length === 0 || !subIssue) {
                showError('error-step2-complaint');
                return false;
            }
        } else if (cat === 'staff') {
            subIssue = getSelectedRadio('comp_staff_issue');
            if (!subIssue) { showError('error-step2-complaint'); return false; }
        } else if (cat === 'place') {
            subIssue = getSelectedRadio('comp_place_issue');
            if (!subIssue) { showError('error-step2-complaint'); return false; }
        } else if (cat === 'health') {
            subIssue = getSelectedRadio('comp_health_issue');
            if (!subIssue) { showError('error-step2-complaint'); return false; }
        }
        hideError('error-step2-complaint');
        return true;
    }

    return false;
}

// ── Step 3 Validation ────────────────────────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return phone === '' || /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

function validateStep3() {
    let valid = true;

    const name = document.getElementById('full_name').value.trim();
    if (name.length < 2) { showError('err-name'); valid = false; } else { hideError('err-name'); }

    const email = document.getElementById('email').value.trim();
    if (!isValidEmail(email)) { showError('err-email'); valid = false; } else { hideError('err-email'); }

    const phone = document.getElementById('phone').value.trim();
    if (!isValidPhone(phone)) { showError('err-phone'); valid = false; } else { hideError('err-phone'); }

    const message = document.getElementById('message').value.trim();
    if (message.length < 10) { showError('err-message'); valid = false; } else { hideError('err-message'); }

    return valid;
}

// ── Build Inquiry Summary ────────────────────────────────────────────────────

const LABEL_MAP = {
    // Inquiry types
    general: 'General Inquiry',
    product: 'Product Inquiry',
    complaint: 'Complaint',
    // General issues
    menu_info: 'Menu & food information',
    hours_location: 'Operating hours & location',
    pricing_payment: 'Pricing & payment options',
    reservation_bulk: 'Reservation or bulk order',
    website_digital: 'Website or digital services',
    other: 'Other',
    // Product issues
    quality_taste: 'Quality & taste',
    freshness_ingredients: 'Freshness & ingredients',
    portion_size: 'Portion size',
    allergen_info: 'Allergen & ingredients info',
    availability: 'Availability inquiry',
    pricing: 'Pricing concern',
    packaging: 'Packaging concern',
    // Complaint categories
    staff: 'Staff / Workers',
    place: 'Place, Parking & Infrastructure',
    health: 'Health & Hygiene',
    product_complaint: 'Product Related',
    // Complaint – product
    poor_quality: 'Poor quality or taste',
    stale_food: 'Stale or expired food',
    foreign_object: 'Foreign object found in food',
    mislabeled: 'Wrong item or mislabeled',
    overcharged: 'Overcharged / wrong price',
    // Complaint – staff
    rude_behavior: 'Rude or inappropriate behavior',
    staff_hygiene: 'Poor personal hygiene',
    slow_service: 'Slow or poor service',
    wrong_order: 'Wrong order or mistake',
    unprofessional: 'Unprofessional conduct',
    // Complaint – place
    parking: 'Parking facilities',
    seating: 'Insufficient seating',
    cleanliness: 'Cleanliness of premises',
    infrastructure: 'Building or infrastructure issue',
    accessibility: 'Accessibility concerns',
    // Complaint – health
    food_safety: 'Food safety concern',
    environment_hygiene: 'Environment hygiene',
    sanitation: 'Sanitation of facilities',
    contamination: 'Suspected contamination',
    pests: 'Pest or rodent presence',
};

function labelOf(value) {
    return LABEL_MAP[value] || value;
}

function buildSummary() {
    const type = getSelectedRadio('inquiry_type');
    const rows = [];

    rows.push({ label: 'Type', value: labelOf(type) });

    if (type === 'general') {
        const issue = getSelectedRadio('general_issue');
        rows.push({ label: 'Topic', value: labelOf(issue) });
        if (issue === 'other') {
            const detail = document.getElementById('general_other_detail');
            if (detail && detail.value.trim()) {
                rows.push({ label: 'Details', value: detail.value.trim() });
            }
        }
    }

    if (type === 'product') {
        const products = getCheckedProducts('product-grid-inquiry');
        rows.push({ label: 'Product(s)', value: products.join(', ') });
        rows.push({ label: 'Issue', value: labelOf(getSelectedRadio('product_issue')) });
    }

    if (type === 'complaint') {
        const cat = getSelectedRadio('complaint_category');
        rows.push({ label: 'Category', value: cat === 'product' ? 'Product Related' : labelOf(cat) });
        if (cat === 'product') {
            rows.push({ label: 'Product(s)', value: getCheckedProducts('product-grid-complaint').join(', ') });
            rows.push({ label: 'Complaint', value: labelOf(getSelectedRadio('comp_product_issue')) });
        } else if (cat === 'staff') {
            rows.push({ label: 'Issue', value: labelOf(getSelectedRadio('comp_staff_issue')) });
        } else if (cat === 'place') {
            rows.push({ label: 'Issue', value: labelOf(getSelectedRadio('comp_place_issue')) });
        } else if (cat === 'health') {
            rows.push({ label: 'Issue', value: labelOf(getSelectedRadio('comp_health_issue')) });
        }
    }

    const summaryBody = document.getElementById('summary-body');
    if (summaryBody) {
        summaryBody.innerHTML = rows.map(r => `
            <div class="summary-row">
                <span class="summary-label">${r.label}</span>
                <span class="summary-value">${escapeHtml(r.value || '—')}</span>
            </div>
        `).join('');
    }
}

// ── Save submission to localStorage ─────────────────────────────────────────

const SUBMISSIONS_KEY = 'helaBojunInquiries';

function saveSubmission(data) {
    const existing = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    existing.push(data);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));
}

function generateRef() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `HB-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(Math.random() * 9000) + 1000}`;
}

// ── Show Step 2 sub-panels ───────────────────────────────────────────────────

function showSubStep(type) {
    document.querySelectorAll('.substep').forEach(s => s.classList.add('hidden'));
    const sub = document.getElementById(`substep-${type}`);
    if (sub) sub.classList.remove('hidden');
}

// ── Navigation ───────────────────────────────────────────────────────────────

document.getElementById('btn-next-1').addEventListener('click', () => {
    if (!validateStep1()) return;
    const type = getSelectedRadio('inquiry_type');
    showSubStep(type);
    currentStep = 2;
    showStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-back-2').addEventListener('click', () => {
    currentStep = 1;
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-next-2').addEventListener('click', () => {
    if (!validateStep2()) return;
    buildSummary();
    currentStep = 3;
    showStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-back-3').addEventListener('click', () => {
    currentStep = 2;
    showStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const type = getSelectedRadio('inquiry_type');
    const ref = generateRef();
    const submission = {
        ref,
        type,
        timestamp: new Date().toISOString(),
        name: document.getElementById('full_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
    };

    // Add type-specific data
    if (type === 'general') {
        submission.issue = getSelectedRadio('general_issue');
        if (submission.issue === 'other') {
            const detail = document.getElementById('general_other_detail');
            submission.otherDetail = detail ? detail.value.trim() : '';
        }
    } else if (type === 'product') {
        submission.products = getCheckedProducts('product-grid-inquiry');
        submission.issue = getSelectedRadio('product_issue');
    } else if (type === 'complaint') {
        submission.complaintCategory = getSelectedRadio('complaint_category');
        const cat = submission.complaintCategory;
        if (cat === 'product') {
            submission.products = getCheckedProducts('product-grid-complaint');
            submission.issue = getSelectedRadio('comp_product_issue');
        } else if (cat === 'staff') {
            submission.issue = getSelectedRadio('comp_staff_issue');
        } else if (cat === 'place') {
            submission.issue = getSelectedRadio('comp_place_issue');
        } else if (cat === 'health') {
            submission.issue = getSelectedRadio('comp_health_issue');
        }
    }

    saveSubmission(submission);

    // Show success
    document.getElementById('success-ref').textContent = ref;
    const msgEl = document.getElementById('success-message');
    if (type === 'complaint') {
        msgEl.textContent = 'Your complaint has been submitted. Our team will investigate and respond within 1–2 business days.';
    } else if (type === 'product') {
        msgEl.textContent = "Your product inquiry has been submitted. We'll get back to you with details within 1 business day.";
    } else {
        msgEl.textContent = 'Your inquiry has been submitted. Our team will review it and get back to you within 1–2 business days.';
    }

    showStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-new-inquiry').addEventListener('click', () => {
    // Reset the form
    document.getElementById('contact-form').reset();
    document.querySelectorAll('.inquiry-type-card, .option-card, .product-check-card, .complaint-cat-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.complaint-sub, .substep').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.step-error, .field-error').forEach(e => e.classList.add('hidden'));
    document.getElementById('char-count').textContent = '0';
    document.getElementById('general-other-text').classList.add('hidden');
    document.getElementById('form-progress').classList.remove('hidden');
    currentStep = 1;
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Init ─────────────────────────────────────────────────────────────────────

function init() {
    // Seed menu data if needed
    if (typeof seedMenuItems === 'function') seedMenuItems();

    // Render product grids
    renderProductGrid('product-grid-inquiry');
    renderProductGrid('product-grid-complaint');

    // Bind interactive elements
    bindInquiryTypeCards();
    bindComplaintCatCards();
    bindOptionCards(document.getElementById('step-2'));
    bindGeneralOther();
    bindCharCounter();

    // Initial step
    showStep(1);
}

init();
