import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ynzcxucugrzlitremtus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluemN4dWN1Z3J6bGl0cmVtdHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzEyNTUsImV4cCI6MjEwNDc0NzI1NX0.d3DQliKqJHzdhQtcQlOGM-vLPpl5QZP5WKmH-wfchXM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const adminEmail = document.getElementById('admin-email');
const logoutBtn = document.getElementById('logout-btn');
const statTotal = document.getElementById('stat-total');
const statAvg = document.getElementById('stat-avg');
const testimonialsList = document.getElementById('testimonials-list');

// Utility: escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Utility: mask email for display
function maskEmail(email) {
    if (!email || !email.includes('@')) return '***@***.***';
    const parts = email.split('@');
    const user = parts[0];
    const domain = parts[1];
    const maskedUser = user.length <= 2 ? user[0] + '***' : user.substring(0, 2) + '****';
    const lastDot = domain.lastIndexOf('.');
    const tld = lastDot !== -1 ? domain.substring(lastDot) : '.com';
    return `${maskedUser}@***${tld}`;
}

// Utility: format date
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Utility: render stars
function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= rating
            ? '<i class="fa-solid fa-star"></i>'
            : '<i class="fa-regular fa-star" style="opacity:0.3"></i>';
    }
    return html;
}

// Update stats from DOM
function updateStats() {
    const cards = testimonialsList.querySelectorAll('.admin-testimonial-card');
    statTotal.textContent = cards.length;

    if (cards.length === 0) {
        statAvg.textContent = '0';
        return;
    }

    let totalRating = 0;
    cards.forEach(card => {
        totalRating += parseInt(card.dataset.rating) || 0;
    });
    statAvg.textContent = (totalRating / cards.length).toFixed(1);
}

// Show login view
function showLogin() {
    loginView.style.display = 'flex';
    dashboardView.style.display = 'none';
    loginForm.reset();
    loginError.style.display = 'none';
}

// Show dashboard view
function showDashboard(user) {
    loginView.style.display = 'none';
    dashboardView.style.display = 'flex';
    adminEmail.textContent = user.email;
    loadTestimonials();
}

// Load testimonials from Supabase
async function loadTestimonials() {
    testimonialsList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Cargando testimonios...</p>';

    const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        testimonialsList.innerHTML = '<p style="color: #ff6b6b;">Error al cargar testimonios.</p>';
        console.error('Error loading testimonials:', error);
        return;
    }

    if (!testimonials || testimonials.length === 0) {
        testimonialsList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay testimonios todavía.</p>';
        updateStats();
        return;
    }

    testimonialsList.innerHTML = '';
    testimonials.forEach(testimonial => {
        testimonialsList.appendChild(createTestimonialCard(testimonial));
    });
    updateStats();
}

// Create a testimonial card element
function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'admin-testimonial-card';
    card.dataset.id = testimonial.id;
    card.dataset.rating = testimonial.rating;

    card.innerHTML = `
        <div class="admin-testimonial-header">
            <span class="admin-testimonial-name">${escapeHtml(testimonial.name)}</span>
            <span class="admin-testimonial-date">${formatDate(testimonial.created_at)}</span>
        </div>
        <div class="admin-testimonial-email">
            <i class="fa-solid fa-envelope"></i> ${escapeHtml(maskEmail(testimonial.email))}
        </div>
        <div class="admin-testimonial-stars">${renderStars(testimonial.rating)}</div>
        <div class="admin-testimonial-message">"${escapeHtml(testimonial.message)}"</div>
        <div class="admin-testimonial-actions">
            <button class="btn-edit" data-id="${testimonial.id}">
                <i class="fa-solid fa-pen"></i> Editar
            </button>
            <button class="btn-delete" data-id="${testimonial.id}">
                <i class="fa-solid fa-trash"></i> Borrar
            </button>
        </div>
    `;

    // Edit button handler
    card.querySelector('.btn-edit').addEventListener('click', () => {
        card.innerHTML = `
            <div class="admin-testimonial-header">
                <span class="admin-testimonial-name">${escapeHtml(testimonial.name)}</span>
                <span class="admin-testimonial-date">${formatDate(testimonial.created_at)}</span>
            </div>
            <div class="admin-testimonial-email">
                <i class="fa-solid fa-envelope"></i> ${escapeHtml(maskEmail(testimonial.email))}
            </div>
            <textarea class="edit-textarea">${escapeHtml(testimonial.message)}</textarea>
            <select class="edit-rating-select">
                ${[1, 2, 3, 4, 5].map(r => `<option value="${r}" ${r === testimonial.rating ? 'selected' : ''}>${'⭐'.repeat(r)} (${r})</option>`).join('')}
            </select>
            <div class="edit-actions">
                <button class="btn-save"><i class="fa-solid fa-check"></i> Guardar</button>
                <button class="btn-cancel"><i class="fa-solid fa-xmark"></i> Cancelar</button>
            </div>
        `;

        // Save handler
        card.querySelector('.btn-save').addEventListener('click', async () => {
            const newMessage = card.querySelector('.edit-textarea').value.trim();
            const newRating = parseInt(card.querySelector('.edit-rating-select').value);

            if (!newMessage) {
                showToast('El mensaje no puede estar vacío.', 'error');
                return;
            }

            const { error } = await supabase
                .from('testimonials')
                .update({ message: newMessage, rating: newRating })
                .eq('id', testimonial.id);

            if (error) {
                showToast('Error al guardar cambios.', 'error');
                console.error('Error updating testimonial:', error);
                return;
            }

            testimonial.message = newMessage;
            testimonial.rating = newRating;
            const newCard = createTestimonialCard(testimonial);
            card.replaceWith(newCard);
            updateStats();
            showToast('Testimonio actualizado correctamente.');
        });

        // Cancel handler
        card.querySelector('.btn-cancel').addEventListener('click', () => {
            const newCard = createTestimonialCard(testimonial);
            card.replaceWith(newCard);
        });
    });

    // Delete button handler
    card.querySelector('.btn-delete').addEventListener('click', async () => {
        if (!confirm('¿Estás seguro de que quieres borrar este testimonio? Esta acción no se puede deshacer.')) {
            return;
        }

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', testimonial.id);

        if (error) {
            showToast('Error al borrar testimonio.', 'error');
            console.error('Error deleting testimonial:', error);
            return;
        }

        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            card.remove();
            updateStats();
        }, 300);
        showToast('Testimonio eliminado.');
    });

    return card;
}

// Login handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        loginError.textContent = 'Por favor completa todos los campos.';
        loginError.style.display = 'block';
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginError.textContent = 'Email o contraseña incorrectos.';
        loginError.style.display = 'block';
        console.error('Login error:', error);
        return;
    }

    showDashboard(data.user);
});

// Logout handler
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showLogin();
});

// Check session on load
async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
        showDashboard(session.user);
    } else {
        showLogin();
    }
}

init();
