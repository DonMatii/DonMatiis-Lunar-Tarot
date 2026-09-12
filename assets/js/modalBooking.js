export function initBookingModal() {
    const modalOverlay = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const bookingForm = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('service-type');

    const bookingTriggers = document.querySelectorAll('a[href*="wa.me"]');

    if (modalOverlay && bookingForm) {
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

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
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
            const queryInput = document.getElementById('client-query');

            const name = nameInput.value.trim();
            const query = queryInput.value.trim();

            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
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
                queryInput.focus();
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