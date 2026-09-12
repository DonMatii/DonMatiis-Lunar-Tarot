export function initPWA() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('Service Worker registrado, Scope:', reg.scope);

                // Detectar cuando hay un nuevo SW esperando para activarse
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Hay una nueva versión lista — mostrar toast
                            showUpdateToast();
                        }
                    });
                });
            })
            .catch(err => {
                console.error('Error al registrar Service Worker:', err);
            });

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

function showUpdateToast() {
    // No mostrar si ya existe
    if (document.getElementById('sw-update-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sw-update-toast';
    toast.innerHTML = `
        <span>🌙 Hay una nueva versión disponible</span>
        <button id="sw-update-btn">Actualizar</button>
        <button id="sw-dismiss-btn" aria-label="Cerrar">&times;</button>
    `;
    document.body.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => toast.classList.add('show'));

    // Click en actualizar → recargar
    document.getElementById('sw-update-btn').addEventListener('click', () => {
        // Enviar mensaje al SW para que se active
        navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
    });

    // Click en cerrar → ocultar
    document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}
