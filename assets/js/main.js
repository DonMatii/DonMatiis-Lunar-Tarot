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
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Animación de aparición al hacer scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
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

    // Botón volver arriba
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Event Tracking para GTM
    initEventTracking();
});

// Tracking de eventos clave para Google Tag Manager
function initEventTracking() {
    // Solo trackear si GTM está activo
    if (typeof window.dataLayer === 'undefined') return;

    // Click en "Agendar lectura" (CTA principal)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            const context = link.closest('.hero-cta') ? 'hero' :
                           link.closest('.oracle-whatsapp-link') ? 'oraculo' :
                           link.closest('.btn-submit-booking') ? 'modal' :
                           link.closest('.cta-section') ? 'cta-final' : 'other';
            window.dataLayer.push({
                event: 'cta_whatsapp_click',
                cta_location: context
            });
        });
    });

    // Click en botón flotante de WhatsApp
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', () => {
            window.dataLayer.push({
                event: 'whatsapp_float_click'
            });
        });
    }

    // Revelación del oráculo diario
    const oracleCard = document.querySelector('.oracle-card');
    if (oracleCard) {
        oracleCard.addEventListener('click', () => {
            window.dataLayer.push({
                event: 'oracle_card_reveal'
            });
        });
    }

    // Click en chips de servicios (interés del usuario)
    document.querySelectorAll('.chip-btn').forEach(chip => {
        chip.addEventListener('click', () => {
            window.dataLayer.push({
                event: 'service_topic_select',
                topic: chip.textContent.trim()
            });
        });
    });
}