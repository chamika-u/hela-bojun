const menuOpenButton = document.getElementById('menu-open-button');
const menuCloseButton = document.getElementById('menu-close-button');
const navMenu = document.querySelector('.nav-menu');

// Function to close the mobile menu
const closeMobileMenu = () => document.body.classList.remove("show-mobile-menu");

// Toggle mobile menu visibility when open button is clicked
menuOpenButton.addEventListener('click', () => {
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener('click', closeMobileMenu);

// Use event delegation for nav links to avoid multiple event listeners
navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
    }
});

// Glassmorphism navbar on scroll
const siteHeader = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
});

// Dynamic Menu Rendering from LocalStorage
function renderMenuItems() {
    const menuList = document.getElementById('menu-list');
    if (!menuList) return;

    const items = seedMenuItems();
    // Best Selling shows all items regardless of availability status
    const bestSellingItems = items;

    menuList.innerHTML = '';
    bestSellingItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item reveal-on-scroll';
        li.innerHTML = `
            <img src="${item.image}" class="menu-item-image" alt="${item.name}" loading="lazy">
            <h3 class="name">${item.name}</h3>
            <p class="text">${item.description}</p>
            <p class="price">Rs. ${item.price.toLocaleString()}</p>
        `;
        menuList.appendChild(li);
    });

    // Observe newly rendered menu items for scroll reveal
    document.querySelectorAll('.menu-item.reveal-on-scroll').forEach(el => revealObserver.observe(el));
}

// Scroll Reveal with Intersection Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// Gallery Lightbox
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = lightboxOverlay ? lightboxOverlay.querySelector('.lightbox-img') : null;
const lightboxClose = lightboxOverlay ? lightboxOverlay.querySelector('.lightbox-close') : null;
const lightboxPrev = lightboxOverlay ? lightboxOverlay.querySelector('.lightbox-prev') : null;
const lightboxNext = lightboxOverlay ? lightboxOverlay.querySelector('.lightbox-next') : null;
const lightboxCounter = lightboxOverlay ? lightboxOverlay.querySelector('.lightbox-counter') : null;

const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
let currentGalleryIndex = 0;

function openLightbox(index) {
    currentGalleryIndex = index;
    const img = galleryImages[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
}

function navigateGallery(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    openLightbox(currentGalleryIndex);
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(index);
        }
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateGallery(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => navigateGallery(1));

if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateGallery(-1);
        if (e.key === 'ArrowRight') navigateGallery(1);
    });
}

// Install Swiper.js slider for testimonials section
if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.slider-wrapper', {
      loop: true,
      grabCursor: true,
      spaceBetween: 25,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },

      },

    });
}

// Initialize dynamic menu rendering
renderMenuItems();

