export function initPWA() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('Service Worker registrado, Scope:', reg.scope);
                detectSWUpdate(reg);
            })
            .catch(err => {
                console.error('Error al registrar Service Worker:', err);
            });

        // Toast de bienvenida (primera visita)
        showWelcomeToast();

        // Cuando el usuario recarga, limpiar el controlador viejo
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}

// Detectar nueva versión del SW y mostrar toast de actualización
function detectSWUpdate(reg) {
    reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateToast();
            }
        });
    });
}

// Toast de actualización del SW
function showUpdateToast() {
    if (document.getElementById('sw-update-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sw-update-toast';
    toast.innerHTML = `
        <span>🌙 Hay una nueva versión disponible</span>
        <button id="sw-update-btn">Actualizar</button>
        <button id="sw-dismiss-btn" aria-label="Cerrar">&times;</button>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    document.getElementById('sw-update-btn').addEventListener('click', () => {
        navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
    });

    document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

// Toast de bienvenida — primera visita o no instalada
function showWelcomeToast() {
    // No mostrar si ya se mostró o si el usuario desactivó
    if (localStorage.getItem('lunarTarot_welcomeShown') === 'true') return;
    // No mostrar si ya está instalada (modo standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Esperar 3 segundos para no interrumpir la carga
    setTimeout(() => {
        const toast = document.createElement('div');
        toast.id = 'welcome-toast';

        // Detectar plataforma
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let instruction = '';
        if (isIOS) {
            instruction = 'Tocá el botón de compartir <i class="fa-solid fa-arrow-up-from-bracket"></i> y después "Agregar a pantalla de inicio"';
        } else if (isAndroid) {
            instruction = 'Tocá los tres puntos <i class="fa-solid fa-ellipsis-vertical"></i> y después "Agregar a pantalla de inicio"';
        } else {
            instruction = 'Buscá el ícono de instalar en la barra de direcciones de tu navegador';
        }

        toast.innerHTML = `
            <div class="welcome-toast-content">
                <img src="IMG/Logo-3.webp" alt="Logo" class="welcome-toast-logo" />
                <div>
                    <strong>✨ ¡Bienvenido!</strong>
                    <p>Podés instalar Lunar Tarot en tu celular para tener los arcanos siempre a mano.</p>
                    <small>${instruction}</small>
                </div>
            </div>
            <button id="welcome-dismiss-btn" aria-label="Cerrar">&times;</button>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        document.getElementById('welcome-dismiss-btn').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
            localStorage.setItem('lunarTarot_welcomeShown', 'true');
        });

        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            if (document.getElementById('welcome-toast')) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
                localStorage.setItem('lunarTarot_welcomeShown', 'true');
            }
        }, 10000);
    }, 3000);
}
