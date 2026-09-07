export function initAccessibility() {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityText = document.getElementById('accessibility-text');
    const body = document.body;

    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize === 'large') {
        body.classList.add('large-text');
        if (accessibilityText) accessibilityText.textContent = 'Texto: Grande';
    }

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
}