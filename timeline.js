// Animate as timeline items enter viewport
const items = document.querySelectorAll(".timeline-item");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.18 });
items.forEach((item) => observer.observe(item));
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function() {  
    const navToggle = document.querySelector('.nav__toggle');  
    const navMenu = document.querySelector('.nav__menu');  
  
    if (navToggle) {  
             navToggle.addEventListener('click', () => {  
            navMenu.classList.toggle('show');  
        });  
    }  
  
    // Optional: Close the menu if a link is clicked (good for single-page sites)  
    const navLinks = document.querySelectorAll('.nav__link');  
    navLinks.forEach(link => {  
        link.addEventListener('click', () => {  
            if (navMenu.classList.contains('show')) {  
                navMenu.classList.remove('show');  
            }  
        });  
    });  
});     
