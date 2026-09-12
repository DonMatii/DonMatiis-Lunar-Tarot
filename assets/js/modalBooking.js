export function initBookingModal() {
    const modalOverlay = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const bookingForm = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('service-type');
    const queryInput = document.getElementById('client-query');
    const chipBtns = document.querySelectorAll('.chip-btn');

    const bookingTriggers = document.querySelectorAll('a[href*="wa.me"]');

    if (modalOverlay && bookingForm) {
        let lastFocusedElement = null;

        // Elementos focusables dentro del modal
        const getFocusableElements = () => {
            return modalOverlay.querySelectorAll(
                'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])'
            );
        };

        // Manejo de los chips rápidos de temáticas
        chipBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                chipBtns.forEach(b => b.style.background = 'rgba(157, 78, 221, 0.2)');
                btn.style.background = 'rgba(157, 78, 221, 0.6)';
                
                const topic = btn.getAttribute('data-topic');
                queryInput.value = `Quiero consultar sobre: ${topic}. `;
                queryInput.focus();
            });
        });

        const openModal = (trigger) => {
            lastFocusedElement = trigger;
            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus en el primer input del modal
            const firstInput = modalOverlay.querySelector('input:not([type="hidden"]), select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        };

        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const href = trigger.getAttribute('href');

                if (href.includes('Tarot')) {
                    serviceSelect.value = 'Tarot';
                } else if (href.includes('Péndulo')) {
                    serviceSelect.value = 'Péndulo';
                } else if (href.includes('Cartomancia')) {
                    serviceSelect.value = 'Cartomancia';
                } else if (href.includes('oráculo')) {
                    serviceSelect.value = 'Oráculo Diario';
                }

                openModal(trigger);
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';

            // Devolver foco al elemento que abrió el modal
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Escape para cerrar
        modalOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            // Focus trap: Tab cicla entre primer y último elemento focusable
            if (e.key === 'Tab') {
                const focusable = getFocusableElements();
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        const showBookingError = (msg) => {
            let errorDiv = document.getElementById('booking-error-msg');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'booking-error-msg';
                errorDiv.className = 'booking-error-msg';
                bookingForm.prepend(errorDiv);
            }
            errorDiv.textContent = `🌙 DonMatii te recomienda: ${msg}`;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        };

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('client-name');
            const service = serviceSelect.value;
            const queryTextarea = document.getElementById('client-query');

            const name = nameInput.value.trim();
            const query = queryTextarea.value.trim();

            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'.,-]{2,50}$/;
            if (!nameRegex.test(name)) {
                showBookingError('Por favor ingresa un nombre válido (solo letras, sin números ni símbolos, mínimo 2 caracteres).');
                nameInput.focus();
                return;
            }

            if (!service) {
                showBookingError('Por favor selecciona un tipo de lectura disponible.');
                return;
            }

            if (query.length < 15 || query.length > 250) {
                showBookingError('Tu inquietud o temática principal debe tener entre 15 y 250 caracteres para poder entender bien tu caso.');
                queryTextarea.focus();
                return;
            }

            const message = `Hola Matías, mi nombre es *${name}*. Vengo de tu web y me interesa agendar una *${service}*. 

Mi inquietud principal es: "${query}". 

¿Qué disponibilidad tienes y cómo coordinamos el pago? Quedo atento/a. ¡Muchas gracias!`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/56982128604?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            closeModal();
            bookingForm.reset();
        });
    }
}
