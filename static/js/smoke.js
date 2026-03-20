/**
 * smoke.js — Efecto de humo verde neón (suave)
 * Canvas particle system, vanilla JS, sin dependencias
 */

(function () {
    // Respetar preferencia de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('smoke-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    // Reducir partículas en móviles/dispositivos de baja gama
    const IS_MOBILE = window.innerWidth < 768;
    const PARTICLE_COUNT = IS_MOBILE ? 4 : 10;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x      = Math.random() * canvas.width;
            this.y      = initial
                ? canvas.height - Math.random() * canvas.height
                : canvas.height + Math.random() * 80;

            this.radius    = 100 + Math.random() * 150;
            this.radiusMax = this.radius + 120 + Math.random() * 80; // límite de crecimiento

            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -(1.5 + Math.random() * 1.2);

            this.rotation      = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.004;

            this.alpha    = initial ? Math.random() * 0.04 : 0;
            this.alphaMax = 0.012 + Math.random() * 0.018;
            this.fadeIn   = !initial;
            this.growth   = 0.2 + Math.random() * 0.25;

            // Pre-calcular color una sola vez por ciclo de vida — verde neón
            const r = Math.min(255, Math.round(Math.random() * 15));
            const g = Math.min(255, Math.round(200 + Math.random() * 55));
            const b = Math.min(255, Math.round(80 + Math.random() * 70));
            this.rgb = `${r}, ${g}, ${b}`;
        }

        update() {
            this.x        += this.vx;
            this.y        += this.vy;
            this.rotation += this.rotationSpeed;

            if (this.radius < this.radiusMax) {
                this.radius += this.growth;
            }

            if (this.fadeIn) {
                this.alpha += 0.004;
                if (this.alpha >= this.alphaMax) this.fadeIn = false;
            } else if (this.y < canvas.height * 0.02) {
                this.alpha -= 0.002;
            }

            if (this.alpha <= 0 || this.y < -this.radius) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            grad.addColorStop(0,    `rgba(${this.rgb}, ${this.alpha})`);
            grad.addColorStop(0.45, `rgba(${this.rgb}, ${this.alpha * 0.5})`);
            grad.addColorStop(1,    `rgba(${this.rgb}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius, this.radius * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    // Throttle a ~30fps en vez de 60fps
    const FRAME_INTERVAL = 1000 / 30;
    let lastTime = 0;
    let animId;

    function animate(timestamp) {
        animId = requestAnimationFrame(animate);

        if (timestamp - lastTime < FRAME_INTERVAL) return;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.update();
            p.draw();
        }
    }

    animId = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            lastTime = 0;
            animId = requestAnimationFrame(animate);
        }
    });
})();
