const navLinks = document.querySelectorAll('.nav-menu .nav-link');
const menuOpenButton = document.getElementById('menu-open-button');
const menuCloseButton = document.getElementById('menu-close-button');

menuOpenButton.addEventListener('click', () => {
    
// Toggle mobile menu visibility 
    document.body.classList.toggle("show-mobile-menu");
});

// close menu when the close button clicked
menuCloseButton.addEventListener('click', () => menuOpenButton.click
());

// close menu when one of the nav link is clicked eg: Home, About, Menu, Testimonials, Contact
navLinks.forEach(link => {
    link.addEventListener('click', () => menuOpenButton.click());
});

// Install Swiper.js slider for testimonials section
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

