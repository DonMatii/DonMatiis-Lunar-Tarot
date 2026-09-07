import { initAccessibility } from './accessibility.js';
import { initTarotOracle } from './tarotLogic.js';
import { initTestimonials } from './testimonials.js';
import { initBookingModal } from './modalBooking.js';
import { initPWA } from './pwa.js';

// Menú Móvil
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Animación de aparición al hacer scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .faq-item, .testimonial-card, .about-container, .testimonial-form-wrapper').forEach(el => {
        if (!el.classList.contains('fade-in-scroll')) {
            el.classList.add('fade-in-scroll');
            observer.observe(el);
        }
    });

    // Inicializar módulos de ingeniería
    initAccessibility();
    initTarotOracle();
    initTestimonials();
    initBookingModal();
    initPWA();
});