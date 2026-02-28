let engineStarted = false;

    const blockData = [
        {
            icon: '🏎️',
            title: 'Performance',
            stat: '500 HP',
            desc: 'The 4.0-litre naturally aspirated flat-six engine is derived directly from the GT3 RS. It revs freely to 9,000 rpm, producing 500 hp and 450 Nm of torque — a sensory experience unlike any turbocharged car.',
            chips: ['4.0L Flat-Six NA', '450 Nm Torque', 'GT3 RS Engine DNA', 'Mid-Engine Layout']
        },
        {
            icon: '⚡',
            title: 'Speed',
            stat: '0–60 in 3.2s',
            desc: 'The GT4 RS sprints from 0 to 100 km/h in just 3.4 seconds and covers a quarter mile in 11.4 seconds. The 7-speed PDK transmission with launch control catapults you forward with mechanical precision.',
            chips: ['7-Speed PDK', 'Launch Control', '0–100 in 3.4s', '¼ Mile: 11.4s']
        },
        {
            icon: '🏁',
            title: 'Track Ready',
            stat: '196 MPH',
            desc: 'Top speed of 315 km/h (196 mph). The GT4 RS uses the same aerodynamic package as the 911 GT3 RS — swan-neck rear wing, front air intakes, NACA ducts on the hood — generating extraordinary downforce at speed.',
            chips: ['315 km/h Top Speed', 'Swan-Neck Wing', 'NACA Hood Ducts', 'Full Aero Kit']
        },
        {
            icon: '🎯',
            title: 'Precision',
            stat: '9,000 RPM',
            desc: 'Screaming to 9,000 rpm redline, the naturally aspirated engine delivers a soundtrack that no electric or turbo car can replicate. Every detail — from the carbon fibre-reinforced interior to the bespoke suspension — is calibrated for the track.',
            chips: ['9,000 RPM Redline', 'Carbon-Fibre Interior', 'Cup 2R Tyres', 'Clubsport Package']
        }
    ];

    function startEngine() {
        if (engineStarted) return;
        engineStarted = true;

         // --- ЗВУК ---
        const sound = document.getElementById('engineSound');
        sound.volume = 0.8;
        sound.play().catch(err => console.log('Звук не воспроизведён:', err));

        const btn = document.getElementById('startButton');
        const car = document.getElementById('carWrapper');
        const blur = document.getElementById('blurOverlay');
        const blocks = document.getElementById('infoBlocks');
        const smokeEl = document.getElementById('smokeContainer');
        const tireEl = document.getElementById('tireMarks');

        // Hide button
        btn.classList.add('hide');

        // 1. Engine vibration
        car.classList.add('engine-on');

        // 2. Smoke + tire marks after 600ms
        setTimeout(() => {
            spawnSmoke(car, smokeEl);
            spawnTireMarks(tireEl);
        }, 600);

        // 3. Launch after 1.1s
        setTimeout(() => {
            car.classList.remove('engine-on');
            car.classList.add('launching');
        }, 1100);

        // 4. After launch, remove blur, show blocks, re-show car centered
        setTimeout(() => {
            blur.classList.add('hide');
            blocks.classList.add('show');
            smokeEl.classList.remove('active');

            // Reset car (hidden off-screen during transition)
            car.classList.remove('launching');
            car.style.transition = 'none';
            car.style.opacity = '0';
            car.style.top = '50%';
            car.style.left = '50%';
            car.style.transform = 'translate(-50%,-50%) scale(0.45)';

            setTimeout(() => {
                car.style.transition = '';
                car.style.opacity = '1';
                car.classList.add('idle-center');
            }, 100);

            // Block hover → move car
            document.querySelectorAll('.info-block').forEach((el, i) => {
                el.addEventListener('mouseenter', () => {
                    car.classList.remove('idle-center', 'on-block-0','on-block-1','on-block-2','on-block-3');
                    car.classList.add(`on-block-${i}`);
                });
                el.addEventListener('mouseleave', () => {
                    car.classList.remove('on-block-0','on-block-1','on-block-2','on-block-3');
                    car.classList.add('idle-center');
                });
            });

        }, 2500);
    }

    function spawnSmoke(car, smokeEl) {
        smokeEl.classList.add('active');
        // Get car position roughly
        const rect = car.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();

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
        // Two parallel lines from left ~18% going right
        const marks = [
            { top: 53, left: 5, width: 22, rot: 0 },
            { top: 57, left: 5, width: 22, rot: 0 }
        ];
        marks.forEach((m, idx) => {
            const el = document.createElement('div');
            el.className = 'tire-mark';
            el.style.top    = m.top + '%';
            el.style.left   = m.left + '%';
            el.style.width  = m.width + '%';
            el.style.transform = `rotate(${m.rot}deg)`;
            tireEl.appendChild(el);
            setTimeout(() => el.classList.add('visible'), idx * 50);
        });
    }

    function openOverlay(idx) {
        const data = blockData[idx];
        const overlay = document.getElementById('fullscreenOverlay');
        const content = document.getElementById('fsContent');

        content.innerHTML = `
            <div class="fs-icon">${data.icon}</div>
            <h1>${data.title}</h1>
            <div class="big-stat">${data.stat}</div>
            <p>${data.desc}</p>
            <div class="details-list">
                ${data.chips.map(c => `<span class="detail-chip">${c}</span>`).join('')}
            </div>
            <button class="fs-close" onclick="closeOverlay()">CLOSE</button>
        `;

        overlay.classList.add('show');
    }

    function closeOverlay() {
        document.getElementById('fullscreenOverlay').classList.remove('show');
    }

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeOverlay();
    });
