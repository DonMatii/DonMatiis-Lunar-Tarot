import { supabase } from './supabaseClient.js';

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function maskEmail(email) {
    if (!email || !email.includes('@')) return '**@***.com';
    const parts = email.split('@');
    const user = parts[0];
    const domainPart = parts[1];

    let maskedUser = '';
    if (user.length <= 2) {
        maskedUser = user.substring(0, 1) + '***';
    } else {
        maskedUser = user.substring(0, 2) + '****';
    }

    const lastDotIndex = domainPart.lastIndexOf('.');
    let extension = 'com';
    if (lastDotIndex !== -1) {
        extension = domainPart.substring(lastDotIndex + 1);
    }

    return `${maskedUser}@****.${extension}`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function initTestimonials() {
    const testimonialForm = document.getElementById('testimonial-form');
    const ratingInput = document.getElementById('rating-value');
    const starButtons = document.querySelectorAll('.star-btn');
    const ratingText = document.getElementById('rating-text');
    const testimonialsList = document.getElementById('testimonials-list');
    const noTestimonialsMsg = document.getElementById('no-testimonials-msg');
    const formFeedback = document.getElementById('form-feedback');

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

    let currentStarFilter = 'all';

    async function renderTestimonials(filter = 'all') {
        if (!testimonialsList) return;

        // Mostrar indicador de carga sutil
        if (noTestimonialsMsg) {
            noTestimonialsMsg.textContent = '🌙 Consultando experiencias en los arcanos...';
            noTestimonialsMsg.style.display = 'block';
        }

        try {
            // Consultar testimonios aprobados directo desde Supabase
            const { data: testimonials, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            testimonialsList.innerHTML = '';

            const filteredTestimonials = (testimonials || []).filter(item => {
                if (filter === 'all') return true;
                return parseInt(item.rating) === parseInt(filter);
            });

            if (filteredTestimonials.length === 0) {
                if (noTestimonialsMsg) {
                    noTestimonialsMsg.textContent = (testimonials || []).length === 0
                        ? 'Aún no hay testimonios aprobados. ¡Sé el primero en compartir tu experiencia!'
                        : 'No hay testimonios con esta valoración todavía.';
                    noTestimonialsMsg.style.display = 'block';
                }
                return;
            }

            if (noTestimonialsMsg) noTestimonialsMsg.style.display = 'none';

            filteredTestimonials.forEach(item => {
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

                const dateFormatted = new Date(item.created_at).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });

                card.innerHTML = `
                    <div class="testimonial-card-header">
                        <div class="stars">${starsHtml}</div>
                        <span class="testimonial-date">${dateFormatted}</span>
                    </div>
                    <p>"${escapeHtml(item.message)}"</p>
                    <div class="client-meta">
                        <span class="client-name">— ${escapeHtml(item.name)}</span>
                        <span class="client-email-masked" title="Correo enmascarado por privacidad"><i class="fa-solid fa-envelope-circle-check"></i> ${escapeHtml(maskEmail(item.email))}</span>
                    </div>
                `;
                testimonialsList.appendChild(card);
            });
        } catch (err) {
            console.error('Error cargando testimonios:', err);
            if (noTestimonialsMsg) {
                noTestimonialsMsg.textContent = 'Error al conectar con la base de datos de testimonios.';
                noTestimonialsMsg.style.display = 'block';
            }
        }
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value.trim();
            const email = document.getElementById('review-email').value.trim();
            const rating = parseInt(ratingInput.value) || 5;
            const comment = document.getElementById('review-comment').value.trim();

            if (!name || !email || !comment) {
                showFeedback('Por favor completa todos los campos requeridos.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFeedback('Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).', 'error');
                return;
            }

            try {
                // Insertar testimonio en Supabase con approved = false para moderación
                const { error } = await supabase
                    .from('testimonials')
                    .insert([
                        {
                            name,
                            email,
                            rating,
                            message: comment,
                            approved: false
                        }
                    ]);

                if (error) throw error;

                testimonialForm.reset();
                ratingInput.value = '5';
                ratingText.textContent = '5 de 5 estrellas';
                starButtons.forEach(btn => btn.classList.add('active'));

                showFeedback('¡Muchas gracias! Tu testimonio fue enviado y será publicado muy pronto tras una revisión.', 'success');
            } catch (err) {
                console.error('Error al guardar testimonio:', err);
                showFeedback('Hubo un error al enviar tu testimonio. Inténtalo de nuevo más tarde.', 'error');
            }
        });
    }

    function showFeedback(msg, type) {
        if (!formFeedback) return;
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.style.display = 'block';
        setTimeout(() => {
            formFeedback.style.display = 'none';
            formFeedback.className = 'form-feedback';
        }, 5000);
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'var(--bg-card)';
                });
                btn.classList.add('active');
                btn.style.background = 'var(--accent-purple)';

                currentStarFilter = btn.getAttribute('data-filter');
                renderTestimonials(currentStarFilter);
            });
        });
    }

    renderTestimonials('all');
}
