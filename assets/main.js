// Menú Móvil
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

// Animación de aparición al hacer scroll (Dinamismo)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

function observeDynamicElements() {
    document.querySelectorAll('.service-card, .faq-item, .testimonial-card, .about-container, .testimonial-form-wrapper').forEach(el => {
        if (!el.classList.contains('fade-in-scroll')) {
            el.classList.add('fade-in-scroll');
            observer.observe(el);
        }
    });
}
observeDynamicElements();

// Sistema de Testimonios Dinámicos
const testimonialForm = document.getElementById('testimonial-form');
const ratingInput = document.getElementById('rating-value');
const starButtons = document.querySelectorAll('.star-btn');
const ratingText = document.getElementById('rating-text');
const testimonialsList = document.getElementById('testimonials-list');
const noTestimonialsMsg = document.getElementById('no-testimonials-msg');
const formFeedback = document.getElementById('form-feedback');

// Manejo interactivo de estrellas
if (starButtons.length > 0) {
    starButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedVal = parseInt(button.getAttribute('data-value'));
            ratingInput.value = selectedVal;
            ratingText.textContent = `${selectedVal} de 5 estrellas`;
            
            starButtons.forEach(btn => {
                const btnVal = parseInt(btn.getAttribute('data-value'));
                if (btnVal <= selectedVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });

        button.addEventListener('mouseenter', () => {
            const hoverVal = parseInt(button.getAttribute('data-value'));
            starButtons.forEach(btn => {
                const btnVal = parseInt(btn.getAttribute('data-value'));
                if (btnVal <= hoverVal) {
                    btn.classList.add('hover');
                } else {
                    btn.classList.remove('hover');
                }
            });
        });

        button.addEventListener('mouseleave', () => {
            starButtons.forEach(btn => btn.classList.remove('hover'));
        });
    });
}

// Cargar y mostrar testimonios almacenados
function getStoredTestimonials() {
    try {
        const stored = localStorage.getItem('donmatii_testimonials');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveTestimonial(item) {
    const list = getStoredTestimonials();
    list.unshift(item); // Insertar al inicio
    try {
        localStorage.setItem('donmatii_testimonials', JSON.stringify(list));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage');
    }
}

function renderTestimonials() {
    if (!testimonialsList) return;
    
    const testimonials = getStoredTestimonials();
    testimonialsList.innerHTML = '';

    if (testimonials.length === 0) {
        if (noTestimonialsMsg) noTestimonialsMsg.style.display = 'block';
        return;
    }

    if (noTestimonialsMsg) noTestimonialsMsg.style.display = 'none';

    testimonials.forEach(item => {
        const card = document.createElement('div');
        card.className = 'testimonial-card fade-in-scroll visible';

        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= item.rating) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star" style="color: rgba(255,255,255,0.2)"></i>';
            }
        }

        card.innerHTML = `
            <div class="testimonial-card-header">
                <div class="stars">${starsHtml}</div>
                <span class="testimonial-date">${item.date}</span>
            </div>
            <p>"${escapeHtml(item.comment)}"</p>
            <span class="client-name">— ${escapeHtml(item.name)}</span>
        `;
        testimonialsList.appendChild(card);
    });

    observeDynamicElements();
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Envío del formulario
if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('review-name').value.trim();
        const email = document.getElementById('review-email').value.trim();
        const rating = parseInt(ratingInput.value) || 5;
        const comment = document.getElementById('review-comment').value.trim();

        if (!name || !email || !comment) {
            showFeedback('Por favor completa todos los campos requeridos.', 'error');
            return;
        }

        const dateFormatted = new Date().toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const newReview = {
            name,
            email,
            rating,
            comment,
            date: dateFormatted
        };

        saveTestimonial(newReview);
        renderTestimonials();

        testimonialForm.reset();
        ratingInput.value = '5';
        ratingText.textContent = '5 de 5 estrellas';
        starButtons.forEach(btn => btn.classList.add('active'));

        showFeedback('¡Muchas gracias por tu testimonio! Se ha publicado correctamente.', 'success');
    });
}

function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${type}`;
    setTimeout(() => {
        formFeedback.style.display = 'none';
        formFeedback.className = 'form-feedback';
    }, 4000);
}

// Carga inicial
renderTestimonials();
