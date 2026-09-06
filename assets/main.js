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
// MÓDULO DE MINI-ORÁCULO DIARIO (Baraja Completa: 78 Arcanos con Descripciones Profundas)
// ==========================================
const tarotDeck = [
    // --- 22 ARCANOS MAYORES ---
    {
        name: "El Loco",
        icon: "fa-person-hiking",
        upright: "Te encuentras en la antesala de un ciclo totalmente renovador. Esta carta representa la chispa de la espontaneidad, la inocencia y una fe ciega pero hermosa en el porvenir. Los arcanos te empujan a dar un salto de fe cuántico, liberándote por completo del peso del qué dirán y permitiéndote explorar territorios inexplorados con el corazón abierto.",
        reversed: "Existe una tendencia a actuar desde la impulsividad irresponsable o el autoengaño. Puedes estar tomando riesgos innecesarios sin medir las consecuencias reales de tus actos, o bien, el miedo paralizante te está impidiendo dar el paso que tu evolución pide a gritos, manteniéndote estancado en la zona de confort."
    },
    {
        name: "El Mago",
        icon: "fa-wand-magic-sparkles",
        upright: "Posees un dominio absoluto sobre tus talentos latentes y cuentas con todas las herramientas materiales y espirituales dispuestas sobre tu mesa cósmica. Es un período de altísima manifestación donde tu voluntad se alinea con el universo; lo que proyectes con convicción y enfoque absoluto se materializará con éxito.",
        reversed: "Tus dones y capacidades están siendo subestimados, bloqueados o desviados hacia propósitos egoístas y manipuladores. Cuidado con caer en ilusiones vacías, promesas falsas o la sensación frustrante de que posees un gran potencial pero eres incapaz de concretarlo en el plano físico."
    },
    {
        name: "La Sacerdotisa",
        icon: "fa-book-open-reader",
        upright: "Se abre un velo místico que te conecta directamente con tu intuición más prístina y la sabiduría ancestral del inconsciente. No busques respuestas en el ruido exterior; la guía que necesitas reside en el silencio de tu templo interior. Secretos o verdades ocultas están a punto de ser reveladas ante tus ojos.",
        reversed: "Te encuentras profundamente desconectado de tu brújula interna, priorizando la lógica superficial y cediendo tu poder de discernimiento ante opiniones ajenas cargadas de juicio. Presta atención a corazonadas ignoradas y evita caer en habladurías o manipulación emocional."
    },
    {
        name: "La Emperatriz",
        icon: "fa-crown",
        upright: "Canalizas una energía magnética de profunda fertilidad, amor incondicional y creatividad desbordante. Es un momento idílico para nutrir tus proyectos más preciados, embellecer tu entorno y conectar fuertemente con el placer sensorial, la abundancia material y el autocuidado consciente.",
        reversed: "Los bloqueos creativos y la dependencia emocional nublan tu bienestar. Es muy probable que estés entregando tanta energía vital al cuidado de los demás que te has olvidado por completo de nutrir tu propio espíritu, cayendo en el desgaste, la insatisfacción y el vacío interior."
    },
    {
        name: "El Emperador",
        icon: "fa-chess-king",
        upright: "La energía de la estructura, la disciplina férrea y el liderazgo consciente se posan sobre ti. Es el momento idóneo para tomar el control absoluto de tu rumbo, estableciendo bases sólidas, orden y límites sanos que protejan tus intereses y garanticen una estabilidad duradera.",
        reversed: "La rigidez excesiva, el autoritarismo o el deseo desmedido de control lo están corrompiendo todo a tu alrededor. Puedes estar chocando duramente contra jerarquías obsoletas, o bien, cayendo en el caos absoluto y la falta de disciplina por negarte a asumir tu propia autoridad."
    },
    {
        name: "El Sumo Sacerdote",
        icon: "fa-landmark",
        upright: "Se manifiesta la necesidad imperiosa de buscar guía espiritual, alinear tus acciones con tus códigos morales más elevados y respetar las tradiciones que sustentan tu comunidad. Es un ciclo excelente para el aprendizaje formal, la mentoría y la consolidación de alianzas basadas en valores éticos.",
        reversed: "Te rebelas de manera destructiva contra los dogmas establecidos, o bien, estás cayendo en el fanatismo ciego y la sumisión ante estructuras rígidas que ya no representan tu evolución espiritual. Cuestiona qué reglas estás siguiendo por inercia y cuáles por convicción real."
    },
    {
        name: "Los Enamorados",
        icon: "fa-heart",
        upright: "Te enfrentas a una encrucijada vital de profundo significado emocional donde deberás tomar una decisión crucial guiada por la honestidad de tu corazón. Esta carta augura una profunda armonía, entendimiento empático y una sincronía magnética en tus vínculos más cercanos.",
        reversed: "Existe una profunda desarmonía interna provocada por un conflicto de valores o elecciones tomadas desde el miedo y la indecisión. La falta de comunicación sincera y los compromisos rotos amenazan con generar rupturas dolorosas o la sensación de estar atado a opciones incorrectas."
    },
    {
        name: "El Carro",
        icon: "fa-chariot",
        upright: "El triunfo absoluto está reservado para quienes mantienen las riendas firmes con férrea disciplina, enfoque mental y voluntad inquebrantable. A pesar de las fuerzas opuestas que intenten desestabilizarte, tu determinación te conducirá directo a la victoria y a la conquista de tus metas.",
        reversed: "Experimentas una frustrante pérdida de control sobre los acontecimientos, dispersión de energías y bloqueos constantes en tus desplazamientos o proyectos. La agresividad mal canalizada o la falta de un rumbo claro están provocando que tu carro emocional colapse."
    },
    {
        name: "La Fuerza",
        icon: "fa-hand-fist",
        upright: "La verdadera maestría no se logra mediante la imposición violenta, sino a través del dominio compasivo de tus pasiones internas, la paciencia infinita y un valor inquebrantable. Posees una resiliencia interna colosal capaz de dominar cualquier adversidad con gracia y serenidad.",
        reversed: "Las dudas profundas sobre tu valor personal, los miedos irracionales y los arrebatos impulsivos minan tu confianza. Puedes estar actuando desde la desesperación o la irritabilidad, permitiendo que tus instintos más primarios saboteen tu estabilidad emocional."
    },
    {
        name: "El Ermitaño",
        icon: "fa-user-ninja",
        upright: "Los arcanos te convocan a un sagrado retiro del mundanal ruido para adentrarte en la cueva de la introspección y la autoevaluación sincera. Esta soledad elegida no es sinónimo de vacío, sino de una profunda iluminación interior que encenderá tu propia lámpara de la sabiduría.",
        reversed: "El aislamiento se ha vuelto enfermizo y doloroso, convirtiéndose en una muralla de rechazo hacia el mundo exterior y hacia los consejos valiosos de quienes te aman. Te estás negando a ver la luz porque te has encariñado demasiado con la penumbra de tu propio aislamiento."
    },
    {
        name: "La Rueda de la Fortuna",
        icon: "fa-dharmachakra",
        upright: "El destino se pone en marcha de manera imparable, trayendo consigo giros kármicos muy favorables, golpes de suerte inesperados y la transición natural hacia un nuevo ciclo de expansión. Las piezas del tablero cósmico se alinean perfectamente para regalarte un renacer lleno de oportunidades.",
        reversed: "Atraviesas una mala racha temporal marcada por la resistencia terca al cambio y la sensación agobiante de estar atrapado en un bucle kármico repetitivo. Comprende que intentar detener los giros inevitables de la vida solo incrementará tu sufrimiento; toca aprender la lección y fluir."
    },
    {
        name: "La Justicia",
        icon: "fa-scale-balanced",
        upright: "La balanza cósmica restablece el orden absoluto, premiando la integridad, la honestidad y las decisiones tomadas con absoluta conciencia. Si tienes asuntos legales, trámites o contratos pendientes, el fallo o desenlace será profundamente justo y equilibrado.",
        reversed: "Afloran situaciones de profunda injusticia, deshonestidad, evasión de responsabilidades y la dolorosa sensación de que las reglas del juego han sido manipuladas en tu contra. Cuidado con actuar desde el sesgo personal o eludir las consecuencias éticas de tus propias elecciones."
    },
    {
        name: "El Colgado",
        icon: "fa-person-falling",
        upright: "Se impone una pausa cósmica obligatoria que te invita a suspender temporalmente la acción para cambiar radicalmente tu perspectiva mental. Este sacrificio voluntario de tus comodidades habituales te abrirá portales de iluminación y comprensión que antes te estaban vedados.",
        reversed: "Te consumes en un estancamiento prolongado y estéril, adoptando el papel de una víctima martirizada que se niega a soltar aquello que ya no le sirve. Estás perdiendo un tiempo valiosísimo en situaciones insostenibles por pura cabezonería y miedo al cambio de paradigma."
    },
    {
        name: "La Muerte",
        icon: "fa-skull",
        upright: "No temas a su nombre, pues es el arcano más liberador de la baraja: anuncia una transformación radical, el corte definitivo de amarras con el pasado y el renacimiento de una versión mucho más sabia de ti mismo. Para que lo nuevo florezca con esplendor, lo viejo debe extinguirse.",
        reversed: "Te aferras con uñas y dientes a situaciones, relaciones o empleos caducos, generando un sufrimiento innecesario por resistirte a un proceso de duelo natural. Postergar esta metamorfosis ineludible solo prolonga una agonía estéril que obstaculiza tu evolución."
    },
    {
        name: "La Templanza",
        icon: "fa-wine-glass",
        upright: "La energía de la alquimia interior fluye suavemente, permitiéndote mezclar los opuestos de tu vida con absoluta mesura, paciencia infinita y una profunda paz holística. Es un período de sanación integral donde la armonía y la moderación restauran por completo tu salud emocional.",
        reversed: "El desequilibrio y los excesos descontrolados sacuden tu estabilidad cotidiana. Las tensiones, la impaciencia y los choques constantes con tu entorno demuestran que has perdido la proporción adecuada de las cosas, cayendo en la irritabilidad y el despilfarro energético."
    },
    {
        name: "El Diablo",
        icon: "fa-fire",
        upright: "Este arcano actúa como un espejo implacable que expone con crudeza tus ataduras materiales, dependencias emocionales, vicios y patrones de pensamiento tóxicos. Te recuerda que las cadenas que crees tener atadas al cuello son, en realidad, de papel: tú mismo posees la llave para liberarte.",
        reversed: "Comienzas el proceso glorioso de despertar y romper los grilletes que te mantenían subyugado a relaciones o hábitos destructivos. Recuperas el control soberano sobre tu voluntad, reconociendo las trampas del ego y decidiendo transitar hacia una libertad limpia y consciente."
    },
    {
        name: "La Torre",
        icon: "fa-bolt",
        upright: "Un rayo de absoluta verdad colapsa repentinamente las estructuras falsas, mentiras o falsas seguridades sobre las cuales edificabas tu realidad. Aunque el impacto inicial pueda resultar desconcertante, esta sacudida violenta es una bendición disfrazada que limpia el terreno de escombros.",
        reversed: "Has logrado esquivar milagrosamente un colapso mayor a último minuto, o bien, estás gastando una energía titánica en prolongar artificialmente una crisis inevitable. Tarde o temprano tendrás que demoler los cimientos podridos; resistirte solo alarga el inevitable derrumbe."
    },
    {
        name: "La Estrella",
        icon: "fa-star",
        upright: "Tras la tormenta, el cielo se despeja para dejar brillar la luz más pura de la esperanza renovada, la inspiración divina y la fe espiritual. Los arcanos te bendicen con un bálsamo de profunda paz interior, recordándote que el universo te acompaña y te protege amorosamente.",
        reversed: "Un manto de escepticismo paralizante, desánimo profundo y pérdida total de fe ensombrece tus días. Las expectativas desmedidas e irreales que te habías trazado se derrumban, sumiéndote temporalmente en un pesimismo estéril que te impide ver las bendiciones cotidianas."
    },
    {
        name: "La Luna",
        icon: "fa-moon",
        upright: "Te adentras en los misteriosos dominios del subconsciente, donde reinan los sueños vívidos, las ilusiones sutiles y los miedos irracionales que acechan en las sombras. Es un tiempo de profunda intuición donde debes aprender a navegar con pies de plomo por terrenos poco claros.",
        reversed: "Los autoengaños se desvanecen y la niebla mental comienza a disiparse de manera muy aliviadora. Logras identificar con nitidez los orígenes de tus ansiedades y temores infundados, enfrentándolos cara a cara con la luz de la verdad recuperada."
    },
    {
        name: "El Sol",
        icon: "fa-sun",
        upright: "Es una de las bendiciones más grandes del tarot: anuncia una etapa de felicidad absoluta, éxito resonante, vitalidad desbordante y claridad mental diáfana. Todo rincón oscuro de tu existencia se ilumina con un calor radiante, atrayendo reconocimiento, alegría y paz duradera.",
        reversed: "La manifestación de tu plenitud experimenta un retraso temporal, o bien, estás intentando proyectar un optimismo artificial y forzado para ocultar problemas de fondo que requieren atención. No permitas que nubes pasajeras empañen la luz genuina que reside en tu interior."
    },
    {
        name: "El Juicio",
        icon: "fa-bullhorn",
        upright: "Escuchas el llamado definitivo de tu evolución espiritual que te convoca a un profundo examen de conciencia, el perdón liberador y el renacimiento kármico. Es el momento perfecto para dejar atrás viejos culpas, perdonarte y sintonizar con tu verdadera vocación de vida.",
        reversed: "Te encuentras atrapado en las garras de una autocrítica cruel y destructiva, rumiando errores del pasado y negándote a otorgarte el perdón que mereces. La incapacidad de cerrar cuentas pendientes te mantiene atado a juicios severos, tanto propios como ajenos."
    },
    {
        name: "El Mundo",
        icon: "fa-earth-americas",
        upright: "Representa la cúspide del viaje espiritual: la culminación exitosa y armoniosa de un ciclo evolutivo trascendental, la integración de tus aprendizajes y la celebración gozosa de tus logros. Te sientes completo, en total sincronía con el cosmos y preparado para un nuevo vuelo.",
        reversed: "Los cierres de etapa se demoran más de lo previsto debido a cabos sueltos que te negaste a atar a tiempo. Experimentas una frustrante sensación de incompletitud, como si el rompecabezas de tu esfuerzo actual se negara a mostrar la imagen final por pequeños detalles pendientes."
    },

    // --- ARCANOS MENORES (Palo de Bastos, Copas, Espadas y Oros con lecturas profundas) ---
    {
        name: "As de Bastos",
        icon: "fa-wand-sparkles",
        upright: "Una poderosa oleada de inspiración pura y energía creadora irrumpe en tu presente, encendiendo una chispa apasionada para el inicio de nuevos proyectos con un potencial extraordinario. El universo te entrega la antorcha; corre hacia tus metas con arrojo.",
        reversed: "La llama inicial se apaga debido a una severa falta de motivación, bloqueos creativos o interferencias externas que frenan en seco tu ímpetu. Sientes que la energía se estanca y no encuentras el canal adecuado para expresar tu iniciativa."
    },
    {
        name: "2 de Bastos",
        icon: "fa-compass",
        upright: "Te hallas contemplando nuevos horizontes desde una posición de poder y planificación estratégica. Es el momento de trazar el mapa definitivo para tus próximas grandes decisiones, evaluando con inteligencia qué caminos expandirán tu destino.",
        reversed: "El miedo paralizante a lo desconocido y la ausencia de una estrategia clara te condenan a la indecisión crónica. Tus planes se quedan en meras intenciones abstractas por temor a arriesgar tu aparente comodidad actual."
    },
    {
        name: "3 de Bastos",
        icon: "fa-ship",
        upright: "Los barcos que enviaste al mar comercial y creativo comienzan a dar sus frutos a lo lejos. La expansión se consolida gracias a tu visión de futuro, augurando excelentes perspectivas de crecimiento y el inicio de recompensas muy esperadas.",
        reversed: "Sobrevienen retrasos imprevistos en tus planes de expansión internacional o comercial, acompañados de una agobiante sensación de frustración al comprobar que tus expectativas de crecimiento tardan demasiado en materializarse."
    },
    {
        name: "4 de Bastos",
        icon: "fa-house-chimney",
        upright: "Se celebra la consolidación de un hito muy importante que trae consigo una profunda estabilidad en el hogar, armonía familiar y un sentido reconfortante de comunidad. Es tiempo de festejar los logros colectivos y la paz alcanzada.",
        reversed: "Surgen tensiones domésticas inesperadas, discusiones familiares o la cancelación de eventos importantes que amenazaban con brindar alegría a tu núcleo íntimo. La sensación de refugio seguro se ve temporalmente alterada."
    },
    {
        name: "5 de Bastos",
        icon: "fa-people-arrows",
        upright: "Afloran pequeños conflictos de intereses, choques de ego y dinámicas competitivas caóticas que ponen a prueba tu paciencia. Estos retos temporales exigen que demuestres temple y diplomacia para no desgastarte en discusiones estériles.",
        reversed: "Logras evitar disputas innecesarias mediante una tregua inteligente, optando por ceder inteligentemente o aplicar resoluciones pacíficas que devuelven la calma y la cooperación a tu entorno inmediato."
    },
    {
        name: "6 de Bastos",
        icon: "fa-trophy",
        upright: "La victoria es tuya y viene acompañada de un merecido reconocimiento público que enaltece tu esfuerzo y dedicación. Tu liderazgo brilla con fuerza, inspirando admiración y consolidando un triunfo rotundo.",
        reversed: "El reconocimiento que esperabas se diluye, provocando heridas en tu ego, una caída temporal de tu popularidad o la aparición traicionera del síndrome del impostor que te hace dudar de tus propios méritos."
    },
    {
        name: "7 de Bastos",
        icon: "fa-shield-halved",
        upright: "Te encuentras defendiendo con uñas y dientes tus posturas, proyectos o conquistas frente a una fuerte oposición externa. Mantén tu posición con firmeza y valentía; cuentas con la ventaja estratégica de estar en tu verdad.",
        reversed: "La presión agobiante de tantos frentes abiertos comienza a desbordarte, haciéndote sopesar la posibilidad de rendirte o ceder terreno fundamental por agotamiento mental y falta de respaldo."
    },
    {
        name: "8 de Bastos",
        icon: "fa-angles-right",
        upright: "Los acontecimientos se precipitan a una velocidad vertiginosa, trayendo consigo noticias estimulantes, viajes repentinos y una fluidez asombrosa en todas tus comunicaciones y gestiones pendientes.",
        reversed: "El caos se apodera de tus canales comunicativos, generando confusiones, demoras exasperantes y una total falta de dirección que frena bruscamente tus gestiones más urgentes."
    },
    {
        name: "9 de Bastos",
        icon: "fa-user-shield",
        upright: "Has librado duras batallas en el pasado y, aunque acuses fatiga, tu resistencia y resiliencia te sitúan en el último tramo defensivo. No bajes la guardia ahora; la victoria final está cerca.",
        reversed: "El desgaste acumulado te arrastra a una paranoia defensiva extrema, donde ves enemigos en todas partes y prefieres arrojar la toalla en la recta final por puro agotamiento psicológico."
    },
    {
        name: "10 de Bastos",
        icon: "fa-boxes-packing",
        upright: "Cargas sobre tus espaldas un peso desproporcionado de responsabilidades ajenas y propias. Estás a un solo paso de coronar tu esfuerzo, pero debes aprender a soltar lastre urgentemente para no colapsar.",
        reversed: "El colapso por estrés se materializa al negarte sistemáticamente a delegar tareas. La sobrecarga te abruma y te obliga de la peor manera a rendirte y reorganizar tus prioridades vitales."
    },
    {
        name: "Sota de Bastos",
        icon: "fa-child-reaching",
        upright: "Un espíritu juvenil, entusiasta y explorador te impulsa a abrazar nuevas ideas creativas con una energía contagiosa y noticias estimulantes que avivan tus ambiciones.",
        reversed: "La inmadurez, la falta de compromiso real y la dispersión mental provocan que tus grandes ideas se disipen rápidamente sin dejar ningún fruto concreto."
    },
    {
        name: "Caballo de Bastos",
        icon: "fa-horse",
        upright: "Una oleada de acción apasionada, viajes rápidos y audacia desenfrenada te arrastra hacia adelante con una energía magnética e imparable.",
        reversed: "La impaciencia destructiva y la impulsividad irreflexiva provocan accidentes operativos, caos por prisas absurdas y un desgaste físico innecesario."
    },
    {
        name: "Reina de Bastos",
        icon: "fa-chess-queen",
        upright: "Irradias un carisma arrollador, independencia, calidez humana y una seguridad en ti mismo que cautiva y lidera con naturalidad.",
        reversed: "Los celos infundados, la vanidad exagerada y las demandas autoritarias ensombrecen tu liderazgo, generando rechazo en tu entorno."
    },
    {
        name: "Rey de Bastos",
        icon: "fa-crown",
        upright: "Tu capacidad para el emprendimiento visionario y el liderazgo honorable inspira a grandes equipos a conquistar metas ambiciosas con audacia.",
        reversed: "La soberbia, la impaciencia dictatorial y la propensión a imponer proyectos irrealistas arruinan tus alianzas profesionales."
    },

    // --- ARCANOS MENORES: PALO DE COPAS ---
    {
        name: "As de Copas",
        icon: "fa-glass-water",
        upright: "El cáliz de tu corazón se desborda con un amor puro y renovado, abriendo portales hacia conexiones emocionales profundas y una paz espiritual inmensa.",
        reversed: "Un profundo bloqueo emocional, desamor o penas contenidas impiden que fluya la expresión sincera de tus sentimientos más íntimos."
    },
    {
        name: "2 de Copas",
        icon: "fa-handshake",
        upright: "Se sella una unión armónica y un pacto de absoluta sinceridad, ya sea en el terreno afectivo de pareja o en lucrativas asociaciones de almas.",
        reversed: "Los desencuentros, la ruptura repentina de acuerdos y el desequilibrio en la sintonía mutua erosionan la confianza del vínculo."
    },
    {
        name: "3 de Copas",
        icon: "fa-champagne-glasses",
        upright: "La alegría compartida, la celebración en comunidad y el apoyo incondicional de tus amistades iluminan una etapa muy feliz y colaborativa.",
        reversed: "Los excesos festivos, los chismes malintencionados o la sensación dolorosa de exclusión social empañan tu bienestar colectivo."
    },
    {
        name: "4 de Copas",
        icon: "fa-face-frown",
        upright: "Te envuelve una apatía reflexiva y un hastío temporal que te lleva a rechazar nuevas oportunidades por puro desinterés interno.",
        reversed: "Despiertas de tu letargo emocional con una motivación renovada, aceptando con entusiasmo las oportunidades que antes ignorabas."
    },
    {
        name: "5 de Copas",
        icon: "fa-droplet",
        upright: "Te consumes lamentándote amargamente por lo que perdiste, ignorando las copas que aún permanecen de pie y listas para ti.",
        reversed: "Asimilas el duelo con madurez, perdonas el pasado, sanas tu interior y decides mirar al futuro con esperanza."
    },
    {
        name: "6 de Copas",
        icon: "fa-gifts",
        upright: "Una dulce nostalgia inunda tu alma a través de recuerdos entrañables de la infancia y reencuentros mágicos con personas de tu ayer.",
        reversed: "Vivir anclado en el pasado te impide madurar emocionalmente, idealizando tiempos pretéritos que ya no volverán."
    },
    {
        name: "7 de Copas",
        icon: "fa-cloud-moon",
        upright: "Un abanico de ilusiones y fantasías desfila ante ti; debes afinar tu discernimiento para no caer en espejismos engañosos.",
        reversed: "Aterrizas bruscamente en la realidad, recuperando la claridad mental necesaria para tomar decisiones prácticas y firmes."
    },
    {
        name: "8 de Copas",
        icon: "fa-person-walking-arrow-right",
        upright: "Tomas la valiente decisión de apartarte de aquello que ya no alimenta tu alma, emprendiendo una búsqueda espiritual más profunda.",
        reversed: "El miedo paralizante a la soledad te retiene en situaciones vacías e insatisfactorias por pura comodidad y cobardía."
    },
    {
        name: "9 de Copas",
        icon: "fa-face-smile-beam",
        upright: "La célebre carta de los deseos cumplidos: disfrutas de una profunda satisfacción personal, bienestar emocional y dicha cotidiana.",
        reversed: "La complacencia excesiva, el esnobismo material o la vanidad personal erosionan la verdadera felicidad de tus logros."
    },
    {
        name: "10 de Copas",
        icon: "fa-rainbow",
        upright: "Se manifiesta la máxima expresión de felicidad familiar, paz en el hogar y un amor duradero bendecido por la armonía total.",
        reversed: "Disputas domésticas soterradas, hipocresía familiar o expectativas afectivas profundamente frustradas erosionan el hogar."
    },
    {
        name: "Sota de Copas",
        icon: "fa-fish",
        upright: "Recibes mensajes tiernos y sorpresivos que despiertan tu sensibilidad artística, tu intuición creativa y un afecto muy sincero.",
        reversed: "La inmadurez emocional, la hipersensibilidad crónica o la recepción de noticias afectivas decepcionantes perturban tu paz."
    },
    {
        name: "Caballo de Copas",
        icon: "fa-water",
        upright: "Propuestas románticas cautivadoras, invitaciones sinceras y la firme disposición de seguir los dictados nobles de tu corazón.",
        reversed: "Promesas vacías, fantasías irreales, celos enfermizos o una sutil manipulación emocional disfrazada de romanticismo."
    },
    {
        name: "Reina de Copas",
        icon: "fa-heart-circle-check",
        upright: "Tu empatía desbordante, intuición sanadora y compasión sincera convierten tu presencia en un refugio de paz para los demás.",
        reversed: "La dependencia emocional patológica, el martirio y la absorción tóxica de dolores ajenos desequilibran tus sentimientos."
    },
    {
        name: "Rey de Copas",
        icon: "fa-user-gear",
        upright: "Dominas tus emociones con una sabiduría madura, ofreciendo consejo diplomático, calma, equilibrio y generosidad afectiva.",
        reversed: "La represión fría de sentimientos, el rencor oculto o la manipulación psicológica solapada empañan tu autoridad afectiva."
    },

    // --- ARCANOS MENORES: PALO DE ESPADAS ---
    {
        name: "As de Espadas",
        icon: "fa-bolt-lightning",
        upright: "Una claridad mental fulminante corta de raíz toda confusión, trayendo la victoria de la verdad y decisiones sumamente justas.",
        reversed: "La confusión mental, los juicios gravemente erróneos o el uso destructivo de las palabras generan un daño innecesario."
    },
    {
        name: "2 de Espadas",
        icon: "fa-eye-slash",
        upright: "Te encuentras paralizado en una encrucijada, negándote obstinadamente a ver una verdad evidente para evitar un conflicto inevitable.",
        reversed: "Ruptura de la parálisis: por fin aceptas la cruda realidad y tomas una decisión valiente que zanja la indefinición."
    },
    {
        name: "3 de Espadas",
        icon: "fa-heart-crack",
        upright: "Un profundo dolor emocional, desamor o separación inevitable lacera temporalmente tu sensibilidad con palabras hirientes.",
        reversed: "Comienza el lento pero seguro proceso de sanación del trauma, perdonando las heridas del pasado y superando el dolor."
    },
    {
        name: "4 de Espadas",
        icon: "fa-bed",
        upright: "El cuerpo y la mente exigen un descanso absoluto; retírate temporalmente del mundanal ruido para recuperar fuerzas en silencio.",
        reversed: "El agotamiento se agrava por tu terca negativa a parar; el estrés acumulado te pasa la cuenta de forma estrepitosa."
    },
    {
        name: "5 de Espadas",
        icon: "fa-user-slash",
        upright: "Victorias mezquinas y egoístas que dejan a su paso un tendal de relaciones rotas, rencores y batallas carentes de ética.",
        reversed: "Intentos sinceros de reconciliación, disposición a dejar atrás discusiones absurdidades y aceptar derrotas con hidalguía."
    },
    {
        name: "6 de Espadas",
        icon: "fa-ferry",
        upright: "Emprendes una transición pacífica hacia aguas mentales mucho más tranquilas, dejando atrás turbulencias y problemas complejos.",
        reversed: "El equipaje emocional pesado de tu pasado te persigue, obstaculizando tus intentos de mudanza o renovación vital."
    },
    {
        name: "7 de Espadas",
        icon: "fa-user-secret",
        upright: "Estrategias sutiles, actuar con astucia diplomática o, en su costado negativo, la presencia de engaños y ocultamientos.",
        reversed: "Se descubren mentiras ocultas, confesiones obligadas o planes tramados en secreto que se desmoronan estrepitosamente."
    },
    {
        name: "8 de Espadas",
        icon: "fa-lock",
        upright: "Sientes que estás atado de pies y manos por tus propios pensamientos negativos y limitaciones autoimpuestas.",
        reversed: "Rompes por fin las cadenas mentales que te aprisionaban, recuperando una autoconfianza y empoderamiento rotundos."
    },
    {
        name: "9 de Espadas",
        icon: "fa-face-rolling-eyes",
        upright: "La ansiedad nocturna, los insomnios y las preocupaciones agobiantes te torturan con escenarios mentales catastróficos.",
        reversed: "Alivio anímico muy esperado al compartir tus temores con alguien de confianza, superando el insomnio y recuperando el optimismo."
    },
    {
        name: "10 de Espadas",
        icon: "fa-skull-crossbones",
        upright: "Tocas fondo de manera implacable; una traición o colapso marca el final absoluto y doloroso de un ciclo insostenible.",
        reversed: "Milagrosa recuperación frente a los golpes bajos de la vida, aceptando con dignidad el fin de la crisis para renacer."
    },
    {
        name: "Sota de Espadas",
        icon: "fa-user-pen",
        upright: "Una curiosidad intelectual insaciable y una vigilancia aguda te mantienen alerta ante cualquier información relevante.",
        reversed: "Chismes malintencionados, espionaje mezquino, tendencia a criticar destructivamente o promesas verbales vacías."
    },
    {
        name: "Caballo de Espadas",
        icon: "fa-wind",
        upright: "Te lanzas a toda velocidad hacia tus metas intelectuales o profesionales con una determinación feroz e imbatible.",
        reversed: "La agresividad verbal, la imprudencia mental y la pésima costumbre de actuar sin pensar generan caos a tu paso."
    },
    {
        name: "Reina de Espadas",
        icon: "fa-chess-queen",
        upright: "Tu objetividad impecable, discernimiento analítico y honestidad frontal te permiten dictar juicios certeros y justos.",
        reversed: "La frialdad emocional extrema, la amargura o el uso de un sarcasmo hiriente aíslan afectivamente tu entorno."
    },
    {
        name: "Rey de Espadas",
        icon: "fa-gavel",
        upright: "Un intelecto superior y una justicia rigurosa cimentada en la ética profesional guían tus decisiones con absoluta imparcialidad.",
        reversed: "El abuso de poder intelectual, la tiranía mental y la aplicación rígida de normas injustas dañan tus vínculos."
    },

    // --- ARCANOS MENORES: PALO DE OROS ---
    {
        name: "As de Oros",
        icon: "fa-coins",
        upright: "Se abre una puerta sumamente sólida hacia la prosperidad material, nuevas fuentes de ingresos estables y seguridad financiera.",
        reversed: "Oportunidades doradas de dinero que se esfuman por una mala gestión financiera, retrasos en pagos o escasez."
    },
    {
        name: "2 de Oros",
        icon: "fa-scale-unbalanced",
        upright: "Haces malabares con habilidad para equilibrar tus finanzas, el trabajo y los tiempos personales en medio de cambios.",
        reversed: "La desorganización económica total y el estrés financiero te desbordan al no poder sostener tantas obligaciones."
    },
    {
        name: "3 de Oros",
        icon: "fa-hammer",
        upright: "El trabajo en equipo colaborativo rinde frutos excelentes, recibiendo el reconocimiento profesional por tu maestría.",
        reversed: "Desacuerdos graves en equipos de trabajo, falta de sintonía laboral o pésima calidad en proyectos conjuntos."
    },
    {
        name: "4 de Oros",
        icon: "fa-vault",
        upright: "Consolidas un ahorro prudente y seguridad material, aunque con cierta tendencia excesiva al control y apego rígido.",
        reversed: "Gastos imprevistos dolorosos, pérdida abrupta de control económico o la necesidad forzada de soltar dinero."
    },
    {
        name: "5 de Oros",
        icon: "fa-person-walking-with-cane",
        upright: "Atraviesas una crisis económica temporal o una sensación punzante de aislamiento y falta de apoyo material.",
        reversed: "Comienza una recuperación financiera muy esperada, saliendo de la tormenta gracias a una ayuda inesperada."
    },
    {
        name: "6 de Oros",
        icon: "fa-hand-holding-dollar",
        upright: "La generosidad y el equilibrio financiero fluyen: das o recibes ayuda material de forma justa y equitativa.",
        reversed: "Deudas desatendidas, egoísmo económico lacerante o condiciones de ayuda abusivas que desequilibran el poder."
    },
    {
        name: "7 de Oros",
        icon: "fa-seedling",
        upright: "Practicas una paciencia infinita evaluando los frutos a largo plazo de tus inversiones y tu siembra laboral.",
        reversed: "Frustración acumulada por la baja rentabilidad de tus esfuerzos o el abandono prematuro de proyectos."
    },
    {
        name: "8 de Oros",
        icon: "fa-gears",
        upright: "Dedicación artesanal y esfuerzo constante enfocado en pulir tus habilidades profesionales hasta alcanzar la excelencia.",
        reversed: "Descuidos imperdonables en los detalles, baja calidad laboral, perfeccionismo paralizante o aburrimiento crónico."
    },
    {
        name: "9 de Oros",
        icon: "fa-gem",
        upright: "Disfrutas de una elegante independencia financiera y de los lujos merecidos fruto de tu autogestión y disciplina.",
        reversed: "Dependencia económica agobiante de terceros, gastos superficiales orientados a mantener apariencias vacías."
    },
    {
        name: "10 de Oros",
        icon: "fa-building-columns",
        upright: "Riqueza familiar duradera, herencias, estabilidad económica generacional y un éxito material plenamente consolidado.",
        reversed: "Disputas familiares mezquinas por dinero, pérdida patrimonial o profunda inestabilidad financiera a futuro."
    },
    {
        name: "Sota de Oros",
        icon: "fa-seedling",
        upright: "Nuevas oportunidades prometedoras de estudio, becas o propuestas financieras prácticas que impulsan tu futuro.",
        reversed: "Falta de ambición, pereza laboral extrema, retrasos burocráticos en contratos o pésima planificación."
    },
    {
        name: "Caballo de Oros",
        icon: "fa-tractor",
        upright: "Una constancia indestructible y una ética laboral impecable garantizan un avance lento pero sumamente seguro.",
        reversed: "Estancamiento laboral absoluto por culpa de rutinas grises, terquedad intransigente o total falta de iniciativa."
    },
    {
        name: "Reina de Oros",
        icon: "fa-basket-shopping",
        upright: "Pragmatismo, abundancia generosa, calidez en el hogar y una excelente administración de los recursos materiales.",
        reversed: "Descuido evidente del hogar u oficina, materialismo superficial obsesivo o aislamiento controlador."
    },
    {
        name: "Rey de Oros",
        icon: "fa-sack-dollar",
        upright: "Alcanzas un éxito empresarial rotundo y una seguridad financiera absoluta, liderando con solidez y provisión firme.",
        reversed: "Materialismo tóxico, avaricia desmedida, ruinosas inversiones por obstinación o control financiero tiránico."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const oracleCard = document.getElementById('oracle-card');
    const drawBtn = document.getElementById('draw-card-btn');
    
    const cardIcon = document.getElementById('card-icon');
    const cardName = document.getElementById('card-name');
    const cardPosition = document.getElementById('card-position');
    const cardMeaning = document.getElementById('card-meaning');
    const typedMessage = document.getElementById('typed-message');

    // Función para simular efecto de máquina de escribir
    function typeWriterEffect(text, element, speed = 20) {
        element.textContent = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    if (drawBtn && oracleCard) {
        drawBtn.addEventListener('click', () => {
            // Seleccionar carta al azar de los 78 arcanos
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

            const exactPhrase = "Regresa mañana para ver nuevamente tu Oráculo Diario!, mientras tanto, puedes agendar una lectura de Tarot, Péndulo o Cartomancia si necesitas más";
            setTimeout(() => {
                typeWriterEffect(exactPhrase, typedMessage, 18);
            }, 500);
        });
    }
});

// ==========================================
// MÓDULO DE MODAL DE AGENDAMIENTO WHATSAPP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
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

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('client-name').value.trim();
            const service = serviceSelect.value;
            const query = document.getElementById('client-query').value.trim();

            if (!name || !service || !query) return;

            const message = `Hola Matías, mi nombre es *${name}*. Me interesa agendar una *${service}*. Mi inquietud principal es: "${query}". ¿Cómo coordinamos?`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/56982128604?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            closeModal();
            bookingForm.reset();
        });
    }
});