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

// Función para validar formato de correo electrónico
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para enmascarar el correo de forma máxima (solo 2 primeras letras del usuario + dominio oculto con asteriscos + extensión)
function maskEmail(email) {
    if (!email || !email.includes('@')) return '**@***.com';
    const parts = email.split('@');
    const user = parts[0];
    const domainPart = parts[1];
    
    // Solo las 2 primeras letras del usuario y el resto asteriscos
    let maskedUser = '';
    if (user.length <= 2) {
        maskedUser = user.substring(0, 1) + '***';
    } else {
        maskedUser = user.substring(0, 2) + '****';
    }

    // Extraer extensión (.com, .cl, etc.)
    const lastDotIndex = domainPart.lastIndexOf('.');
    let extension = 'com';
    if (lastDotIndex !== -1) {
        extension = domainPart.substring(lastDotIndex + 1);
    }

    return `${maskedUser}@****.${extension}`;
}
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
            <div class="client-meta">
                <span class="client-name">— ${escapeHtml(item.name)}</span>
                <span class="client-email-masked" title="Correo enmascarado por privacidad"><i class="fa-solid fa-envelope-circle-check"></i> ${escapeHtml(maskEmail(item.email))}</span>
            </div>
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

        if (!isValidEmail(email)) {
            showFeedback('Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).', 'error');
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
    formFeedback.style.display = 'block'; // Aseguramos que se muestre en pantalla
    setTimeout(() => {
        formFeedback.style.display = 'none';
        formFeedback.className = 'form-feedback';
    }, 4000);
}

// Carga inicial
renderTestimonials();

// ==========================================
// MÓDULO DE ACCESIBILIDAD (Tamaño de Texto)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityText = document.getElementById('accessibility-text');
    const body = document.body;

    // Verificar si el usuario ya tenía una preferencia guardada
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize === 'large') {
        body.classList.add('large-text');
        if (accessibilityText) accessibilityText.textContent = 'Texto: Grande';
    }

    // Evento de clic para alternar tamaño
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', () => {
            body.classList.toggle('large-text');
            
            if (body.classList.contains('large-text')) {
                localStorage.setItem('textSize', 'large');
                if (accessibilityText) accessibilityText.textContent = 'Texto: Grande';
            } else {
                localStorage.setItem('textSize', 'normal');
                if (accessibilityText) accessibilityText.textContent = 'Texto: Normal';
            }
        });
    }
});

// ==========================================
// MÓDULO DE MINI-ORÁCULO DIARIO
// ==========================================
// ==========================================
// MÓDULO DE MINI-ORÁCULO DIARIO (Baraja Completa: 78 Arcanos)
// ==========================================
const tarotDeck = [
    // --- 22 ARCANOS MAYORES ---
    {
        name: "El Loco",
        icon: "fa-person-hiking",
        upright: "Representa los nuevos comienzos, la espontaneidad y la fe absoluta en el futuro. Es el momento perfecto para dar un salto de fe, arriesgarte por lo que amas y dejar atrás los miedos.",
        reversed: "Indica imprudencia, tomar riesgos innecesarios sin evaluar las consecuencias o un profundo miedo a dar el paso por inseguridad."
    },
    {
        name: "El Mago",
        icon: "fa-wand-magic-sparkles",
        upright: "Simboliza la manifestación, el poder personal y la maestría sobre tus recursos. Tienes todas las herramientas necesarias a tu disposición para materializar tus metas.",
        reversed: "Apunta hacia la manipulación, el uso indebido de tus talentos o la sensación de que tus habilidades están siendo desaprovechadas."
    },
    {
        name: "La Sacerdotisa",
        icon: "fa-book-open-reader",
        upright: "Invoca la intuición profunda, el misterio y la sabiduría interior. Los arcanos te piden que escuches esa voz silenciosa dentro de ti.",
        reversed: "Señala una desconexión total con tu intuición, dejándote guiar únicamente por opiniones externas o juicios superficiales."
    },
    {
        name: "La Emperatriz",
        icon: "fa-crown",
        upright: "Es el máximo reflejo de la abundancia, la fertilidad y una creatividad desbordante. Representa la nutrición emocional y el autocuidado.",
        reversed: "Refleja un bloqueo creativo importante, dependencia emocional hacia los demás o un evidente descuido personal."
    },
    {
        name: "El Emperador",
        icon: "fa-chess-king",
        upright: "Representa la autoridad, la estructura, el orden y la estabilidad. Tienes la capacidad de liderar con firmeza y establecer bases sólidas.",
        reversed: "Indica abuso de poder, tiranía, rigidez excesiva o una completa falta de disciplina y control en tu vida."
    },
    {
        name: "El Sumo Sacerdote",
        icon: "fa-landmark",
        upright: "Simboliza la sabiduría espiritual, las tradiciones, la guía de un mentor y la búsqueda de un propósito elevado.",
        reversed: "Apunta hacia el dogmatismo, la rebeldía frente a las reglas establecidas o caer en creencias limitantes."
    },
    {
        name: "Los Enamorados",
        icon: "fa-heart",
        upright: "Habla de elecciones cruciales desde el corazón, la armonía en las relaciones, el amor genuino y la alineación de valores.",
        reversed: "Refleja desarmonía, toma de decisiones basada en el miedo, falta de compromiso o conflictos internos importantes."
    },
    {
        name: "El Carro",
        icon: "fa-chariot",
        upright: "Anuncia triunfo a través de la fuerza de voluntad, la determinación y el enfoque para superar cualquier obstáculo.",
        reversed: "Indica pérdida de control, dirección dispersa o agresividad mal canalizada debido a la falta de disciplina."
    },
    {
        name: "La Fuerza",
        icon: "fa-hand-fist",
        upright: "Representa el coraje, la paciencia, el dominio propio y la compasión para afrontar los retos con resiliencia.",
        reversed: "Muestra momentos de profunda inseguridad, dudas sobre tu valor personal o pérdida de control emocional."
    },
    {
        name: "El Ermitaño",
        icon: "fa-user-ninja",
        upright: "Invita a la introspección, la búsqueda interior, la soledad consciente y la sabiduría meditativa.",
        reversed: "Advierte sobre un aislamiento excesivo, la soledad mal llevada o el rechazo a escuchar consejos externos."
    },
    {
        name: "La Rueda de la Fortuna",
        icon: "fa-dharmachakra",
        upright: "Anuncia golpes de suerte, cambios de ciclo muy favorables y giros inesperados guiados por el destino.",
        reversed: "Advierte sobre ciclos repetitivos que te atrapan, rachas temporales de inestabilidad o resistencia al cambio."
    },
    {
        name: "La Justicia",
        icon: "fa-scale-balanced",
        upright: "Simboliza la verdad, la equidad, la causa y efecto, y la resolución justa de asuntos legales o contractuales.",
        reversed: "Apunta hacia la injusticia, la deshonestidad, la falta de rendición de cuentas o eludir responsabilidades."
    },
    {
        name: "El Colgado",
        icon: "fa-person-falling",
        upright: "Representa la pausa obligatoria, la entrega, el sacrificio temporal y el cambio de perspectiva.",
        reversed: "Indica estancamiento prolongado, resistencia al cambio, martirio innecesario o perder el tiempo."
    },
    {
        name: "La Muerte",
        icon: "fa-skull",
        upright: "Es transformación profunda, el cierre de ciclos y el renacimiento necesario para dejar ir lo viejo.",
        reversed: "Refleja resistencia al cambio, miedo intenso a dejar ir el pasado o permanecer aferrado a situaciones muertas."
    },
    {
        name: "La Templanza",
        icon: "fa-wine-glass",
        upright: "Incentiva el equilibrio, la moderación, la paciencia y la sanación holística de los opuestos.",
        reversed: "Muestra desequilibrio, excesos, impaciencia y choques constantes que descolocan tu estabilidad."
    },
    {
        name: "El Diablo",
        icon: "fa-fire",
        upright: "Expone las ataduras materiales, las adicciones y los patrones tóxicos que te cuesta reconocer.",
        reversed: "Anuncia el momento liberador de romper cadenas, superar dependencias y recuperar tu poder personal."
    },
    {
        name: "La Torre",
        icon: "fa-bolt",
        upright: "Representa una revelación abrupta, la destrucción repentina de estructuras falsas y limpieza necesaria.",
        reversed: "Indica que has evitado un desastre a última hora o estás prolongando una crisis inevitable."
    },
    {
        name: "La Estrella",
        icon: "fa-star",
        upright: "Trae esperanza renovada, inspiración divina y una profunda sanación espiritual hacia un futuro brillante.",
        reversed: "Muestra momentos de pérdida de fe, desánimo profundo o expectativas poco realistas que frustran."
    },
    {
        name: "La Luna",
        icon: "fa-moon",
        upright: "Ilumina tu intuición más aguda, los sueños reveladores y la necesidad de enfrentar tus propias ilusiones.",
        reversed: "Representa miedos infundados que te paralizan, estados de ansiedad o confusión mental que se disipan."
    },
    {
        name: "El Sol",
        icon: "fa-sun",
        upright: "Promete alegría absoluta, éxito rotundo, vitalidad y felicidad plena bajo una claridad inmensa.",
        reversed: "Indica que la alegría se retrasa un poco o mantienes un optimismo superficial frente a problemas reales."
    },
    {
        name: "El Juicio",
        icon: "fa-bullhorn",
        upright: "Simboliza el despertar de consciencia, la autoevaluación profunda, el perdón y tu destino definitivo.",
        reversed: "Apunta a la duda constante, la autocrítica destructiva o la incapacidad de perdonar errores pasados."
    },
    {
        name: "El Mundo",
        icon: "fa-earth-americas",
        upright: "Es la realización total, la culminación exitosa de un gran ciclo de vida y la celebración de tus logros.",
        reversed: "Indica cierres que se demoran, falta de culminación o sentir que falta un último paso para la satisfacción."
    },

    // --- ARCANOS MENORES: PALO DE BASTOS (Acción, Energía, Pasión) ---
    {
        name: "As de Bastos",
        icon: "fa-wand-sparkles",
        upright: "Inspiración pura, energía desbordante y el inicio de un proyecto lleno de pasión y potencial.",
        reversed: "Falta de motivación, retrasos en tus proyectos o energía bloqueada que no sabe por dónde salir."
    },
    {
        name: "2 de Bastos",
        icon: "fa-compass",
        upright: "Planificación a futuro, toma de decisiones estratégicas y mirar más allá de tus horizontes actuales.",
        reversed: "Miedo a lo desconocido, falta de planificación adecuada o planes que se quedan estancados."
    },
    {
        name: "3 de Bastos",
        icon: "fa-ship",
        upright: "Expansión, visión de futuro, comercio y la espera paciente de los frutos de tus primeras acciones.",
        reversed: "Obstáculos en la expansión, retrasos en viajes o frustración por metas que tardan en llegar."
    },
    {
        name: "4 de Bastos",
        icon: "fa-house-chimney",
        upright: "Celebración, estabilidad en el hogar, armonía familiar y la alegría de alcanzar un hito importante.",
        reversed: "Tensiones familiares, problemas en el hogar o una celebración que se cancela o no resulta como esperabas."
    },
    {
        name: "5 de Bastos",
        icon: "fa-people-arrows",
        upright: "Competencia, pequeños conflictos de intereses, desacuerdos y retos que ponen a prueba tu temple.",
        reversed: "Evitación de conflictos, resolución de disputas o ceder para encontrar la paz colectiva."
    },
    {
        name: "6 de Bastos",
        icon: "fa-trophy",
        upright: "Victoria, reconocimiento público, éxito merecido y la satisfacción de ver tu esfuerzo recompensado.",
        reversed: "Falta de reconocimiento, ego herido, caída temporal del éxito o síndrome del impostor."
    },
    {
        name: "7 de Bastos",
        icon: "fa-shield-halved",
        upright: "Defensa de tus posturas, perseverancia frente a la oposición y firmeza ante los retos externos.",
        reversed: "Sentirse abrumado por la presión, rendirse ante los ataques o dudar de tus propias convicciones."
    },
    {
        name: "8 de Bastos",
        icon: "fa-angles-right",
        upright: "Velocidad, noticias que llegan rápido, eventos repentinos y fluidez total en tus comunicaciones.",
        reversed: "Demoras frustrantes, falta de dirección clara, caos en la comunicación o proyectos frenados."
    },
    {
        name: "9 de Bastos",
        icon: "fa-user-shield",
        upright: "Resiliencia, persistencia a pesar del cansancio y estar preparado para el último gran esfuerzo defensivo.",
        reversed: "Agotamiento extremo, paranoia, actitud defensiva excesiva o rendirse en la recta final."
    },
    {
        name: "10 de Bastos",
        icon: "fa-boxes-packing",
        upright: "Carga pesada, exceso de responsabilidades y la recta final antes de liberarte de un gran peso.",
        reversed: "Colapso por estrés, incapacidad de delegar tareas o la necesidad urgente de soltar cargas ajenas."
    },
    {
        name: "Sota de Bastos",
        icon: "fa-child-reaching",
        upright: "Entusiasmo juvenil, espíritu aventurero, exploración de ideas creativas y noticias estimulantes.",
        reversed: "Falta de compromiso, ideas dispersas, inmadurez o miedo a emprender nuevas aventuras."
    },
    {
        name: "Caballo de Bastos",
        icon: "fa-horse",
        upright: "Acción apasionada, impulsividad, energía arrolladora y viajes rápidos llenos de emoción.",
        reversed: "Agotamiento por prisa inútil, impaciencia destructiva, dispersión o agresividad impulsiva."
    },
    {
        name: "Reina de Bastos",
        icon: "fa-chess-queen",
        upright: "Carisma, seguridad en ti mismo, calidez, independencia y una energía magnética inspiradora.",
        reversed: "Celos infundados, exigencia excesiva con los demás, manipulación o pérdida temporal de confianza."
    },
    {
        name: "Rey de Bastos",
        icon: "fa-crown",
        upright: "Liderazgo visionario, emprendimiento, honor, audacia y capacidad de inspirar a grandes equipos.",
        reversed: "Impaciencia autoritaria, impulsividad en los negocios, arrogancia o expectativas irrealistas."
    },

    // --- ARCANOS MENORES: PALO DE COPAS (Emociones, Amor, Intuición) ---
    {
        name: "As de Copas",
        icon: "fa-glass-water",
        upright: "Amor desbordante, nuevas conexiones emocionales profundas, paz interior y apertura espiritual.",
        reversed: "Bloqueo emocional, pena contenida, desamor o dificultad para expresar lo que sientes."
    },
    {
        name: "2 de Copas",
        icon: "fa-handshake",
        upright: "Unión armoniosa, pactos sinceros, conexiones de almas ya sea en pareja o en asociaciones comerciales.",
        reversed: "Desencuentros, ruptura de acuerdos, desequilibrio en la pareja o falta de sintonía mutua."
    },
    {
        name: "3 de Copas",
        icon: "fa-champagne-glasses",
        upright: "Celebración con amigos, alegría compartida, comunidad, colaboración y momentos de felicidad social.",
        reversed: "Excesos en fiestas, chismes, aislamiento social o exclusión de un grupo cercano."
    },
    {
        name: "4 de Copas",
        icon: "fa-face-frown",
        upright: "Apatía temporal, meditación interna, aburrimiento o rechazo a nuevas oportunidades por desinterés.",
        reversed: "Superar el hastío, despertar a nuevas oportunidades, motivación renovada y optimismo."
    },
    {
        name: "5 de Copas",
        icon: "fa-droplet",
        upright: "Lamentarse por el pasado, duelo emocional, decepción y enfoque exclusivo en lo que se ha perdido.",
        reversed: "Aceptación de la pérdida, perdón, sanación interior y mirar hacia el futuro con esperanza."
    },
    {
        name: "6 de Copas",
        icon: "fa-gifts",
        upright: "Nostalgia hermosa, recuerdos de la infancia, reencuentros con personas del pasado y pureza.",
        reversed: "Vivir demasiado en el pasado, idealizar tiempos pretéritos o incapacidad de madurar emocionalmente."
    },
    {
        name: "7 de Copas",
        icon: "fa-cloud-moon",
        upright: "Ilusiones, fantasías, múltiples opciones sobre la mesa pero con riesgo de idealización excesiva.",
        reversed: "Aterrizar en la realidad, claridad mental frente a las opciones y elección consciente y firme."
    },
    {
        name: "8 de Copas",
        icon: "fa-person-walking-arrow-right",
        upright: "Abandonar lo que ya no te llena en busca de un sentido espiritual o emocional mucho más profundo.",
        reversed: "Miedo a marcharte, permanecer en una situación insatisfactoria por comodidad o cobardía."
    },
    {
        name: "9 de Copas",
        icon: "fa-face-smile-beam",
        upright: "La carta de los deseos cumplidos, satisfacción personal, bienestar emocional y felicidad cotidiana.",
        reversed: "Complacencia excesiva, buscar la felicidad solo en lo material o vanidad personal."
    },
    {
        name: "10 de Copas",
        icon: "fa-rainbow",
        upright: "Felicidad familiar plena, paz en el hogar, alineación emocional y un amor duradero y bendecido.",
        reversed: "Disputas familiares ocultas, ruptura de la armonía en el hogar o expectativas familiares frustradas."
    },
    {
        name: "Sota de Copas",
        icon: "fa-fish",
        upright: "Mensajes de amor inesperados, intuición creativa, sensibilidad artística y ternura sincera.",
        reversed: "Inmadurez emocional, hipersensibilidad, vulnerabilidad mal gestionada o noticias decepcionantes."
    },
    {
        name: "Caballo de Copas",
        icon: "fa-water",
        upright: "Propuestas románticas, seguir los impulsos del corazón, diplomacia y ofrecimientos sinceros.",
        reversed: "Fantasías irreales, promesas vacías, celos enfermizos o manipulación emocional sutil."
    },
    {
        name: "Reina de Copas",
        icon: "fa-heart-circle-check",
        upright: "Empatía profunda, compasión, intuición sanadora y apoyo emocional incondicional hacia los demás.",
        reversed: "Dependencia emocional, absorción de energías ajenas, martirio o desbordamiento de sentimientos."
    },
    {
        name: "Rey de Copas",
        icon: "fa-user-gear",
        upright: "Madurez emocional, control sabio de los sentimientos, diplomacia, calma y generosidad.",
        reversed: "Manipulación emocional oculta, frialdad, represión de sentimientos o descontrol pasional."
    },

    // --- ARCANOS MENORES: PALO DE ESPADAS (Mente, Lógica, Verdad) ---
    {
        name: "As de Espadas",
        icon: "fa-bolt-lightning",
        upright: "Claridad mental absoluta, triunfo de la verdad, nuevas ideas brillantes y cortes tajantes necesarios.",
        reversed: "Confusión mental, ideas destructivas, juicios erróneos o uso de la palabra para herir."
    },
    {
        name: "2 de Espadas",
        icon: "fa-eye-slash",
        upright: "Bloqueo por decisiones difíciles, evitar ver la verdad evidente y tregua temporal tensa.",
        reversed: "Aceptar la verdad por fin, tomar una decisión inevitable y romper la parálisis mental."
    },
    {
        name: "3 de Espadas",
        icon: "fa-heart-crack",
        upright: "Dolor emocional, desamor, pena profunda, palabras hirientes y separación dolorosa pero real.",
        reversed: "Comienzo de la recuperación emocional, perdón, sanación del dolor y superación del trauma."
    },
    {
        name: "4 de Espadas",
        icon: "fa-bed",
        upright: "Descanso mental obligatorio, recuperación física, meditación en silencio y pausa sanadora.",
        reversed: "Agotamiento por no parar, estrés acumulado, inquietud mental o resistencia al descanso."
    },
    {
        name: "5 de Espadas",
        icon: "fa-user-slash",
        upright: "Victorias pírricas, conflictos donde todos pierden, discusiones mezquinas y falta de ética.",
        reversed: "Intento de reconciliación, dejar atrás rencores absurdos o aceptar una derrota con hidalguía."
    },
    {
        name: "6 de Espadas",
        icon: "fa-ferry",
        upright: "Transición hacia aguas más tranquilas, dejar atrás los problemas y viaje de sanación mental.",
        reversed: "Equipaje emocional pesado que te persigue, retrasos en la mudanza o temor al cambio."
    },
    {
        name: "7 de Espadas",
        icon: "fa-user-secret",
        upright: "Estrategia, actuar con sigilo, diplomacia o, en su cara negativa, engaños y astucia oculta.",
        reversed: "Confesión de secretos, descubrir mentiras, remordimiento de conciencia o planes que fallan."
    },
    {
        name: "8 de Espadas",
        icon: "fa-lock",
        upright: "Sentirse atrapado por tus propios pensamientos negativos, limitaciones autoimpuestas e indecisión.",
        reversed: "Liberación mental, ruptura de cadenas limitantes, autoconfianza y empoderamiento recuperado."
    },
    {
        name: "9 de Espadas",
        icon: "fa-face-rolling-eyes",
        upright: "Ansiedad nocturna, pesadillas mentales, preocupación excesiva y culpa tortuosa.",
        reversed: "Alivio de la ansiedad, compartir tus miedos con otros, superación del insomnio y esperanza."
    },
    {
        name: "10 de Espadas",
        icon: "fa-skull-crossbones",
        upright: "Toca fondo, traición evidente, final definitivo de un ciclo doloroso pero purificador.",
        reversed: "Recuperación milagrosa, resistencia frente a los golpes bajos y aceptación del fin de la crisis."
    },
    {
        name: "Sota de Espadas",
        icon: "fa-user-pen",
        upright: "Mente inquisitiva, vigilancia constante, curiosidad intelectual y comunicación directa.",
        reversed: "Chismes malintencionados, espionaje, falta de tacto al hablar o promesas vacías."
    },
    {
        name: "Caballo de Espadas",
        icon: "fa-wind",
        upright: "Acción intelectual veloz, ambición desmedida, determinación feroz y argumentos contundentes.",
        reversed: "Imprudencia verbal, agresividad mental, caos por actuar sin pensar o discusiones destructivas."
    },
    {
        name: "Reina de Espadas",
        icon: "fa-chess-queen",
        upright: "Objetividad, independencia mental, discernimiento agudo, honestidad brutal y claridad de juicio.",
        reversed: "Frialdad extrema, amargura, sarcasmo hiriente o juicio excesivamente severo y crítico."
    },
    {
        name: "Rey de Espadas",
        icon: "fa-gavel",
        upright: "Intelecto superior, justicia imparcial, liderazgo basado en la razón, ética y claridad profesional.",
        reversed: "Abuso de autoridad intelectual, manipulación mediante leyes o normas, tiranía mental."
    },

    // --- ARCANOS MENORES: PALO DE OROS / PENTÁCULOS (Materia, Trabajo, Dinero) ---
    {
        name: "As de Oros",
        icon: "fa-coins",
        upright: "Oportunidad financiera sólida, estabilidad material, nuevas fuentes de ingresos y prosperidad.",
        reversed: "Oportunidades perdidas de dinero, mala gestión financiera, retrasos en pagos o escasez."
    },
    {
        name: "2 de Oros",
        icon: "fa-scale-unbalanced",
        upright: "Hacer malabares con las finanzas o el tiempo, flexibilidad y adaptación frente a los cambios.",
        reversed: "Desorganización total, estrés financiero, incapacidad de equilibrar responsabilidades."
    },
    {
        name: "3 de Oros",
        icon: "fa-hammer",
        upright: "Trabajo en equipo exitoso, colaboración, reconocimiento laboral por tu calidad y maestría.",
        reversed: "Falta de sintonía en el equipo laboral, mal trabajo en equipo o desacuerdos en proyectos."
    },
    {
        name: "4 de Oros",
        icon: "fa-vault",
        upright: "Ahorro, seguridad material, conservadurismo financiero o tendencia excesiva al control y apego.",
        reversed: "Gastos imprevistos, generosidad forzada, pérdida de control económico o soltar el dinero."
    },
    {
        name: "5 de Oros",
        icon: "fa-person-walking-with-cane",
        upright: "Dificultades económicas temporales, sensación de aislamiento, crisis laboral o falta de apoyo.",
        reversed: "Recuperación financiera gradual, salida de la crisis, ayuda inesperada y optimismo."
    },
    {
        name: "6 de Oros",
        icon: "fa-hand-holding-dollar",
        upright: "Generosidad, caridad, equilibrio financiero, recibir o dar ayuda económica justa.",
        reversed: "Deudas desatendidas, egoísmo económico, condiciones de ayuda injustas o desequilibrio de poder."
    },
    {
        name: "7 de Oros",
        icon: "fa-seedling",
        upright: "Paciencia frente a inversiones a largo plazo, evaluación de tus frutos y perseverancia.",
        reversed: "Frustración por baja rentabilidad, impaciencia laboral o abandono prematuro de un proyecto."
    },
    {
        name: "8 de Oros",
        icon: "fa-gears",
        upright: "Dedicación artesanal, esfuerzo constante, perfeccionamiento de habilidades y trabajo duro.",
        reversed: "Falta de atención al detalle, baja calidad laboral, perfeccionismo paralizante o aburrimiento."
    },
    {
        name: "9 de Oros",
        icon: "fa-gem",
        upright: "Independencia financiera, disfrute de los lujos merecidos, autogestión y comodidad material.",
        reversed: "Dependencia económica ajena, gastos superficiales por apariencias o aislamiento material."
    },
    {
        name: "10 de Oros",
        icon: "fa-building-columns",
        upright: "Riqueza familiar duradera, herencias, estabilidad económica generacional y éxito material consolidado.",
        reversed: "Disputas por dinero familiar, pérdida patrimonial o inestabilidad económica a largo plazo."
    },
    {
        name: "Sota de Oros",
        icon: "fa-seedling",
        upright: "Nuevas oportunidades de estudio o trabajo, enfoque práctico, becas y propuestas financieras.",
        reversed: "Falta de ambición, pereza laboral, retrasos en contratos o mala planificación estudiantil."
    },
    {
        name: "Caballo de Oros",
        icon: "fa-tractor",
        upright: "Constancia indestructible, ética laboral impecable, rutina productiva y avance lento pero seguro.",
        reversed: "Estancamiento laboral por rutina aburrida, terquedad excesiva o falta de iniciativa."
    },
    {
        name: "Reina de Oros",
        icon: "fa-basket-shopping",
        upright: "Pragmatismo, abundancia generosa, comodidad en el hogar, buena administración y calidez material.",
        reversed: "Descuido del hogar u oficina, materialismo superficial, control obsesivo o aislamiento."
    },
    {
        name: "Rey de Oros",
        icon: "fa-sack-dollar",
        upright: "Éxito empresarial rotundo, seguridad financiera absoluta, abundancia, liderazgo y provisión sólida.",
        reversed: "Materialismo tóxico, avaricia, malas inversiones por obstinación o control financiero tiránico."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const oracleCard = document.getElementById('oracle-card');
    const drawBtn = document.getElementById('draw-card-btn');
    const resetBtn = document.getElementById('reset-card-btn');
    
    const cardIcon = document.getElementById('card-icon');
    const cardName = document.getElementById('card-name');
    const cardPosition = document.getElementById('card-position');
    const cardMeaning = document.getElementById('card-meaning');

    if (drawBtn && oracleCard) {
        drawBtn.addEventListener('click', () => {
            // Seleccionar carta al azar
            const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
            
            // Determinar si es al derecho (true) o invertida (false) - 50/50
            const isUpright = Math.random() >= 0.5;

            // Rellenar la tarjeta con los datos correspondientes
            cardIcon.className = `fa-solid ${randomCard.icon}`;
            cardName.textContent = randomCard.name;

            if (isUpright) {
                cardPosition.textContent = "Al Derecho";
                cardPosition.className = "card-position-badge upright";
                cardMeaning.textContent = randomCard.upright;
            } else {
                cardPosition.textContent = "Invertida";
                cardPosition.className = "card-position-badge reversed";
                cardMeaning.textContent = randomCard.reversed;
            }

            // Voltear la tarjeta con animación
            oracleCard.classList.add('flipped');
        });
    }

    if (resetBtn && oracleCard) {
        resetBtn.addEventListener('click', () => {
            oracleCard.classList.remove('flipped');
        });
    }
});