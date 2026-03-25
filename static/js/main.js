/**
 * main.js — Navbar scroll, scroll reveal, menú móvil, skill bars, copiar email
 */

document.addEventListener('DOMContentLoaded', function () {

    // --- Navbar: blur al hacer scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // --- Bottom nav — marcar ítem activo ---
    const currentPath = window.location.pathname;
    document.querySelectorAll('.bottom-nav__item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && (href === currentPath || (href !== '/' && currentPath.startsWith(href)))) {
            item.classList.add('active');
        }
    });

    // --- Scroll reveal (IntersectionObserver) ---
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // --- Skill bars animadas ---
    const skillBars = document.querySelectorAll('.skill-bar__fill[data-target]');
    if (skillBars.length > 0) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.dataset.target + '%';
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => barObserver.observe(bar));
    }

    // --- Auto-cerrar flash messages ---
    document.querySelectorAll('.flash-message').forEach(msg => {
        setTimeout(() => msg.remove(), 5000);
    });

});
