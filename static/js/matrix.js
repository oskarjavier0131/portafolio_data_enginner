/**
 * matrix.js — Efecto lluvia de código Matrix
 * Verde #4ADE80 del portafolio, opacidad sutil ~12%
 * Canvas vanilla JS, sin dependencias
 */

(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });

    // Caracteres: katakana + números + símbolos
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}|/\\';

    const FONT_SIZE = 13;
    const COLOR = '#4ADE80';       // --accent-green del portafolio
    const OPACITY_HEAD = 1.0;      // carácter cabeza de columna (más brillante)
    const OPACITY_TRAIL = 0.35;    // rastro (más visible)
    const SPEED_MIN = 0.3;
    const SPEED_MAX = 0.9;

    let columns = [];
    let cols = 0;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        initColumns();
    }

    function initColumns() {
        cols = Math.floor(canvas.width / FONT_SIZE);
        // Conservar estado existente al hacer resize
        const prev = columns;
        columns = Array.from({ length: cols }, (_, i) => {
            if (prev[i]) return prev[i];
            return {
                y: Math.random() * canvas.height / FONT_SIZE,  // posición actual en filas
                speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
                length: 20 + Math.floor(Math.random() * 24),   // rastros más largos
                chars: [],
                opacity: 0.25 + Math.random() * 0.35,          // más luminoso por columna
            };
        });
    }

    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    // Throttle a ~24fps — balance entre fluidez y CPU
    const FRAME_INTERVAL = 1000 / 24;
    let lastTime = 0;
    let animId;

    function randomChar() {
        return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function draw(timestamp) {
        animId = requestAnimationFrame(draw);
        if (timestamp - lastTime < FRAME_INTERVAL) return;
        lastTime = timestamp;

        // Fade sobre el frame anterior — menos agresivo = rastros más persistentes
        ctx.fillStyle = 'rgba(10, 10, 10, 0.10)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${FONT_SIZE}px monospace`;

        for (let i = 0; i < cols; i++) {
            const col = columns[i];
            const x = i * FONT_SIZE;
            const yPx = col.y * FONT_SIZE;

            // Carácter cabeza: blanco brillante
            ctx.fillStyle = `rgba(220, 255, 235, ${OPACITY_HEAD})`;
            ctx.fillText(randomChar(), x, yPx);

            // Rastro: verde del portafolio, más visible
            ctx.fillStyle = `rgba(74, 222, 128, ${OPACITY_TRAIL * col.opacity})`;
            for (let j = 1; j < col.length; j++) {
                const trailY = (col.y - j) * FONT_SIZE;
                if (trailY < 0) break;
                const fade = 1 - j / col.length;
                ctx.globalAlpha = fade * OPACITY_TRAIL * col.opacity;
                ctx.fillText(randomChar(), x, trailY);
            }
            ctx.globalAlpha = 1;

            // Avanzar columna
            col.y += col.speed;

            // Resetear cuando sale de pantalla (con retraso aleatorio)
            if (col.y * FONT_SIZE > canvas.height + col.length * FONT_SIZE) {
                col.y = -col.length - Math.random() * 20;
                col.speed  = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
                col.length = 20 + Math.floor(Math.random() * 24);
                col.opacity = 0.25 + Math.random() * 0.35;
            }
        }
    }

    animId = requestAnimationFrame(draw);

    // Pausar cuando la pestaña está oculta
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            lastTime = 0;
            animId = requestAnimationFrame(draw);
        }
    });
})();
