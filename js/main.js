/* ==========================================================================
   R3C Creative Studio — Lógica de interfaz (UI)
   Menú móvil, scroll reveal, tilt 3D, contadores, parallax, partículas,
   carruseles de "Nosotros" y "Trabajos".
   Se ejecuta una vez el DOM está listo (DOMContentLoaded).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ── Mobile Menu ──
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function openMenu() {
        mobileMenuBtn.classList.add('open');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ── Navbar scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // ── Scroll Progress ──
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });

    // ── Custom Cursor ──
    const cursor = document.getElementById('custom-cursor');
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouch && !prefersReduced) {
        cursor.classList.add('active');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .tilt-card, .step-node');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Hide cursor when leaving the window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
    }

    // ── Scroll Reveal (multiple variants) ──
    const revealEls = document.querySelectorAll('.reveal:not(.revealed), .reveal-scale:not(.revealed), .reveal-rotate:not(.revealed)');
    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    // ── 3D Tilt ──
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (!prefersReduced && !isTouch) {
        tiltCards.forEach(card => {
            const maxTilt = 8;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const rotateY = (px - 0.5) * maxTilt * 2;
                const rotateX = (0.5 - py) * maxTilt * 2;
                card.style.transform =
                    `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.setProperty('--mx', `${px * 100}%`);
                card.style.setProperty('--my', `${py * 100}%`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    // ── Spotlight ──
    const spotlightPairs = [
        ['hero-section', 'hero-spotlight'],
        ['servicios', 'servicios-spotlight'],
        ['contacto', 'contacto-spotlight'],
    ];
    if (!isTouch) {
        spotlightPairs.forEach(([sectionId, glowId]) => {
            const section = document.getElementById(sectionId);
            const glow = document.getElementById(glowId);
            if (!section || !glow) return;
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                glow.style.setProperty('--x', `${x}%`);
                glow.style.setProperty('--y', `${y}%`);
            });
        });
    }

    // ── Counters ──
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const duration = 1400;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = prefix + Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        };
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(c => counterObserver.observe(c));
        } else {
            counters.forEach(animateCounter);
        }
    }

    // ── Parallax ──
    const parallaxEls = document.querySelectorAll('.parallax-layer');
    if (parallaxEls.length && !prefersReduced) {
        let parallaxTicking = false;

        function updateParallax() {
            const vh = window.innerHeight;
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.speed || '0.1');
                const rect = el.getBoundingClientRect();
                const centerDelta = (rect.top + rect.height / 2) - vh / 2;
                el.style.transform = `translateY(${centerDelta * speed * -0.2}px)`;
            });
            parallaxTicking = false;
        }
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                requestAnimationFrame(updateParallax);
                parallaxTicking = true;
            }
        }, { passive: true });
        updateParallax();
    }

    // ── Particles (Hero) ──
    const canvas = document.getElementById('particles-canvas');
    if (canvas && !prefersReduced) {
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const count = 80;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 4 + 2;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = `hsla(${Math.random() * 60 + 30}, 80%, 70%, ${this.opacity})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w) this.speedX *= -1;
                if (this.y < 0 || this.y > h) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function drawParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 214, 0, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ── Carousel About ──
    const track = document.getElementById('carousel-track');
    const dots = [document.getElementById('dot-0'), document.getElementById('dot-1')].filter(Boolean);
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const TOTAL = 7;
    const INTERVAL_MS = 5000;
    let current = 0;
    let paused = false;
    let lastTimestamp = null;
    let rafId = null;

    function goTo(index) {
        current = (index + TOTAL) % TOTAL;
        track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
        dots.forEach((d, i) => {
            const active = i === current;
            d.classList.toggle('bg-brandyellow', active);
            d.classList.toggle('bg-white/40', !active);
            d.setAttribute('aria-selected', String(active));
        });
    }

    function tick(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        if (!paused && timestamp - lastTimestamp >= INTERVAL_MS) {
            goTo(current + 1);
            lastTimestamp = timestamp;
        }
        rafId = requestAnimationFrame(tick);
    }

    if (!prefersReduced) {
        rafId = requestAnimationFrame(tick);
    }

    const wrapper = document.getElementById('carousel-wrapper');
    wrapper.addEventListener('mouseenter', () => { paused = true; });
    wrapper.addEventListener('mouseleave', () => { paused = false;
        lastTimestamp = null; });
    wrapper.addEventListener('focusin', () => { paused = true; });
    wrapper.addEventListener('focusout', () => { paused = false;
        lastTimestamp = null; });

    prevBtn.addEventListener('click', () => { goTo(current - 1);
        lastTimestamp = null; });
    nextBtn.addEventListener('click', () => { goTo(current + 1);
        lastTimestamp = null; });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i);
            lastTimestamp = null; });
    });

    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
            goTo(delta < 0 ? current + 1 : current - 1);
            lastTimestamp = null;
        }
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        paused = document.hidden;
        if (!paused) lastTimestamp = null;
    });

    // ── Trabajos Carousel ──
    const tCarousel = document.getElementById('trabajos-carousel');
    const tBtnPrev = document.getElementById('btn-trabajos-prev');
    const tBtnNext = document.getElementById('btn-trabajos-next');

    if (tCarousel && tBtnPrev && tBtnNext) {
        tBtnPrev.addEventListener('click', () => {
            const cardWidth = tCarousel.querySelector('article').offsetWidth;
            tCarousel.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        });
        tBtnNext.addEventListener('click', () => {
            const cardWidth = tCarousel.querySelector('article').offsetWidth;
            tCarousel.scrollBy({ left: (cardWidth + 24), behavior: 'smooth' });
        });

        let isDown = false;
        let startX;
        let scrollLeft;

        tCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            tCarousel.classList.add('cursor-grabbing');
            tCarousel.classList.remove('cursor-grab', 'snap-mandatory');
            tCarousel.style.scrollBehavior = 'auto';
            startX = e.pageX - tCarousel.offsetLeft;
            scrollLeft = tCarousel.scrollLeft;
        });
        tCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            tCarousel.classList.remove('cursor-grabbing');
            tCarousel.classList.add('cursor-grab', 'snap-mandatory');
            tCarousel.style.scrollBehavior = 'smooth';
        });
        tCarousel.addEventListener('mouseup', () => {
            isDown = false;
            tCarousel.classList.remove('cursor-grabbing');
            tCarousel.classList.add('cursor-grab', 'snap-mandatory');
            tCarousel.style.scrollBehavior = 'smooth';
        });
        tCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            tCarousel.scrollLeft = scrollLeft - walk;
        });
    }

});