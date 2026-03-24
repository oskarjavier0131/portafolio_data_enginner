(function () {
    'use strict';

    var widget = document.getElementById('clippy-widget');
    if (!widget) return;

    var bubble   = document.getElementById('clippy-bubble');
    var msgEl    = document.getElementById('clippy-message');
    var closeBtn = document.getElementById('clippy-close');

    if (!bubble || !msgEl || !closeBtn) return;

    // Config from data attributes
    var delayDesktop = (parseInt(widget.dataset.delayDesktop, 10) || 30) * 1000;
    var delayMobile  = (parseInt(widget.dataset.delayMobile,  10) || 20) * 1000;
    var defaultMsg   = widget.dataset.defaultMessage || '¿En qué puedo ayudarte hoy?';

    // localStorage — dismissed for 24 hours
    var DISMISSED_KEY = 'clippy_dismissed_at';
    var DISMISS_TTL   = 24 * 60 * 60 * 1000;

    function isDismissed() {
        var ts = localStorage.getItem(DISMISSED_KEY);
        return ts && (Date.now() - parseInt(ts, 10)) < DISMISS_TTL;
    }

    function showBubble() {
        if (isDismissed()) return;
        if (bubble.classList.contains('clippy-bubble--visible')) return;
        msgEl.textContent = currentMsg;
        bubble.classList.add('clippy-bubble--visible');
    }

    function hideBubble(permanent) {
        bubble.classList.remove('clippy-bubble--visible');
        if (permanent) {
            localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        }
    }

    // ── Mensaje según sección visible (home) o URL (otras páginas) ──────────
    var currentMsg = defaultMsg;

    // URL-based message for non-home pages
    var path = window.location.pathname;
    if (path.indexOf('sobre-mi') !== -1 || path.indexOf('about') !== -1) {
        currentMsg = '¿Quieres trabajar juntos? Agendemos una llamada gratis 📅';
    } else if (path.indexOf('blog') !== -1) {
        currentMsg = '¿Quieres hablar sobre este tema? ¡Escríbeme! ✉️';
    } else if (path.indexOf('contacto') !== -1) {
        currentMsg = '¿Prefieres hablar directo? Estoy en WhatsApp 👇';
    }

    // Section-based messages for the home page (IntersectionObserver)
    var sectionMessages = {
        'automatizaciones': '¿Tienes procesos manuales? Puedo automatizarlos con n8n 🤖',
        'proyectos':        '¿Te gustó algún proyecto? Puedo hacer algo similar para ti ✨',
        'certificaciones':  '¿Quieres saber más sobre mi experiencia? ¡Escríbeme! 🎓'
    };

    function watchSection(id, msg) {
        var el = document.getElementById(id);
        if (!el || !window.IntersectionObserver) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    currentMsg = msg;
                    if (bubble.classList.contains('clippy-bubble--visible')) {
                        msgEl.textContent = currentMsg;
                    }
                }
            });
        }, { threshold: 0.3 });
        obs.observe(el);
    }

    Object.keys(sectionMessages).forEach(function (id) {
        watchSection(id, sectionMessages[id]);
    });

    // Reset to default when hero is visible
    var heroEl = document.querySelector('.hero');
    if (heroEl && window.IntersectionObserver) {
        var heroObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    currentMsg = defaultMsg;
                    if (bubble.classList.contains('clippy-bubble--visible')) {
                        msgEl.textContent = currentMsg;
                    }
                }
            });
        }, { threshold: 0.3 });
        heroObs.observe(heroEl);
    }

    // ── Timer-based appearance ───────────────────────────────────────────────
    var isMobile = window.innerWidth < 768;
    var delay    = isMobile ? delayMobile : delayDesktop;
    var showTimer = setTimeout(showBubble, delay);

    // ── Exit intent (desktop only, enabled after 10s) ────────────────────────
    if (!isMobile) {
        var exitReady = false;
        setTimeout(function () { exitReady = true; }, 10000);
        document.addEventListener('mouseleave', function (e) {
            if (exitReady && e.clientY <= 5) {
                showBubble();
            }
        });
    }

    // ── Mobile: scroll-up intent after 10s ──────────────────────────────────
    if (isMobile) {
        var scrollIntentReady = false;
        var lastScrollY = window.scrollY;
        setTimeout(function () { scrollIntentReady = true; }, 10000);
        window.addEventListener('scroll', function () {
            if (scrollIntentReady && window.scrollY < lastScrollY - 80) {
                showBubble();
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // ── Close button ─────────────────────────────────────────────────────────
    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        hideBubble(true);
        clearTimeout(showTimer);
    });

}());
