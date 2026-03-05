let engineStarted = false;

function startEngine() {
    if (engineStarted) return;
    engineStarted = true;

    const sound = document.getElementById('engineSound');
    if (sound) {
        sound.volume = 0.8;
        sound.play().catch(err => console.log('Sound not played:', err));
    }

    const btn     = document.getElementById('startButton');
    const car     = document.getElementById('carWrapper');
    const blur    = document.getElementById('blurOverlay');
    const smokeEl = document.getElementById('smokeContainer');
    const tireEl  = document.getElementById('tireMarks');
    const title   = document.getElementById('heroTitle');
    const hint    = document.getElementById('scrollHint');

    // Hide button
    btn.classList.add('hide');

    // 1. Vibrate
    car.classList.add('engine-on');

    // 2. Smoke + tire marks
    setTimeout(() => {
        spawnSmoke(car, smokeEl);
        spawnTireMarks(tireEl);
    }, 600);

    // 3. Launch
    setTimeout(() => {
        car.classList.remove('engine-on');
        car.classList.add('launching');
    }, 1100);

    // 4. After launch — fade blur, show title + scroll hint
    setTimeout(() => {
        blur.classList.add('hide');
        smokeEl.classList.remove('active');

        // Show car faded out (optional: keep hidden after launch)
        car.classList.remove('launching');
        car.style.display = 'none';

        // Show hero title
        if (title) title.classList.add('visible');

        // Show scroll hint
        setTimeout(() => {
            if (hint) hint.classList.add('visible');
        }, 600);

    }, 2400);
}

function spawnSmoke(car, smokeEl) {
    smokeEl.classList.add('active');
    const rect = car.getBoundingClientRect();
    const containerRect = document.getElementById('heroSection').getBoundingClientRect();

    const baseLeft = ((rect.left - containerRect.left) / containerRect.width) * 100;
    const baseTop  = ((rect.bottom - containerRect.top) / containerRect.height) * 100;

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const puff = document.createElement('div');
            puff.className = 'smoke-puff';
            const size = 60 + Math.random() * 80;
            puff.style.width  = size + 'px';
            puff.style.height = size + 'px';
            puff.style.left   = (baseLeft - 5 + Math.random() * 10) + '%';
            puff.style.top    = (baseTop - 15 + Math.random() * 10) + '%';
            smokeEl.appendChild(puff);
            setTimeout(() => puff.remove(), 1400);
        }, i * 80);
    }
}

function spawnTireMarks(tireEl) {
    const marks = [
        { top: 53, left: 5, width: 22, rot: 0 },
        { top: 57, left: 5, width: 22, rot: 0 }
    ];
    marks.forEach((m, idx) => {
        const el = document.createElement('div');
        el.className = 'tire-mark';
        el.style.top       = m.top + '%';
        el.style.left      = m.left + '%';
        el.style.width     = m.width + '%';
        el.style.transform = `rotate(${m.rot}deg)`;
        tireEl.appendChild(el);
        setTimeout(() => el.classList.add('visible'), idx * 50);
    });
}

// ============ SCROLL REVEAL ============
function initScrollReveal() {
    const els = document.querySelectorAll(
        '.about-text, .about-stats, .stat-card, .tech-block, .badge-row, ' +
        '.project-card, .team-card, .section-title, .section-tag'
    );
    els.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered reveal for siblings
                const siblings = [...entry.target.parentElement.children];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollReveal);
