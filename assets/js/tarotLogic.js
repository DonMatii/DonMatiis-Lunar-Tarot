import { tarotDeck } from './tarotData.js';

export function initTarotOracle() {
    const oracleCard = document.getElementById('oracle-card');
    const drawBtn = document.getElementById('draw-card-btn');

    const cardIcon = document.getElementById('card-icon');
    const cardName = document.getElementById('card-name');
    const cardPosition = document.getElementById('card-position');
    const cardMeaning = document.getElementById('card-meaning');
    const typedMessage = document.getElementById('typed-message');

    const misticAudio = new Audio('assets/audio/Bell.mp3');
    misticAudio.volume = 0.6;

    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    const audioStatus = document.getElementById('audio-status');
    let isAudioMuted = false;

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            if (isAudioMuted) {
                audioIcon.className = 'fa-solid fa-volume-xmark';
                audioStatus.textContent = 'Sonido: Silenciado';
                audioToggleBtn.style.opacity = '0.6';
            } else {
                audioIcon.className = 'fa-solid fa-volume-high';
                audioStatus.textContent = 'Sonido: Activado';
                audioToggleBtn.style.opacity = '1';
            }
        });
    }

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
        const today = new Date().toISOString().split('T')[0];
        const lastDrawDate = localStorage.getItem('lunarTarot_lastDate');
        const savedCardName = localStorage.getItem('lunarTarot_cardName');
        const savedIsUpright = localStorage.getItem('lunarTarot_isUpright');
        const savedMeaning = localStorage.getItem('lunarTarot_meaning');
        const savedIcon = localStorage.getItem('lunarTarot_icon');

        if (lastDrawDate === today && savedCardName) {
            cardIcon.className = `fa-solid ${savedIcon}`;
            cardName.textContent = savedCardName;

            if (savedIsUpright === 'true') {
                cardPosition.textContent = "Al Derecho";
                cardPosition.className = "card-position-badge upright";
            } else {
                cardPosition.textContent = "Invertida";
                cardPosition.className = "card-position-badge reversed";
            }

            cardMeaning.textContent = savedMeaning;
            oracleCard.classList.add('flipped');

            const exactPhrase = "Ya has consultado tu Oráculo de hoy. Regresa mañana para una nueva guía, mientras tanto, puedes agendar una lectura de Tarot, Péndulo o Cartomancia si necesitas más";
            typedMessage.textContent = exactPhrase;

            drawBtn.disabled = true;
            drawBtn.style.opacity = '0.5';
            drawBtn.style.cursor = 'not-allowed';
            drawBtn.textContent = "Oráculo ya consultado hoy 🌙";
        }

        drawBtn.addEventListener('click', () => {
            const currentDate = new Date().toISOString().split('T')[0];
            if (localStorage.getItem('lunarTarot_lastDate') === currentDate) return;

            if (!isAudioMuted) {
                misticAudio.currentTime = 0;
                misticAudio.play().catch(err => console.log("Audio play prevented:", err));
            }

            const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
            const isUpright = Math.random() >= 0.5;

            cardIcon.className = `fa-solid ${randomCard.icon}`;
            cardName.textContent = randomCard.name;

            let meaningText = "";
            if (isUpright) {
                cardPosition.textContent = "Al Derecho";
                cardPosition.className = "card-position-badge upright";
                meaningText = randomCard.upright;
            } else {
                cardPosition.textContent = "Invertida";
                cardPosition.className = "card-position-badge reversed";
                meaningText = randomCard.reversed;
            }
            cardMeaning.textContent = meaningText;

            localStorage.setItem('lunarTarot_lastDate', currentDate);
            localStorage.setItem('lunarTarot_cardName', randomCard.name);
            localStorage.setItem('lunarTarot_isUpright', isUpright);
            localStorage.setItem('lunarTarot_meaning', meaningText);
            localStorage.setItem('lunarTarot_icon', randomCard.icon);

            oracleCard.classList.add('flipped');

            const exactPhrase = "Regresa mañana para ver nuevamente tu Oráculo Diario!, mientras tanto, puedes agendar una lectura de Tarot, Péndulo o Cartomancia si necesitas más";
            setTimeout(() => {
                typeWriterEffect(exactPhrase, typedMessage, 18);
            }, 500);

            drawBtn.disabled = true;
            drawBtn.style.opacity = '0.5';
            drawBtn.style.cursor = 'not-allowed';
            drawBtn.textContent = "Oráculo ya consultado hoy 🌙";
        });
    }
}