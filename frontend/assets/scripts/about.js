// about.js – Hela Bojun About Page

// Navbar mobile menu
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

// Glassmorphism navbar on scroll
const siteHeader = document.querySelector('header');
if (siteHeader) {
    window.addEventListener('scroll', () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    });
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
