/* ══════════════════════════════════════════════════════════════
   KINUN.IN — INTERACTIVE JAVASCRIPT
   Atmospheric Effects, Loading Gate, Talisman Audio,
   Chakra Shrine, Particle Canvas, and Bento Tilt
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════════════════
       1. THE LOADING GATE (Digital Dropouts Replica Loader)
       ══════════════════════════════════════════════════════════ */
    const loader = document.getElementById('loader');
    const ldBar = document.getElementById('ldBar');
    const ldPct = document.getElementById('ldPct');
    const ldCount = document.getElementById('ldCount');
    const ldFlash = document.getElementById('ldFlash');
    const ldBtn = document.getElementById('ldBtn');

    let loadProgress = 0;
    const maxDash = 340; // 2 * PI * 54 ≈ 339.29

    const loadInterval = setInterval(() => {
        // Accelerate loading progress
        loadProgress += Math.floor(Math.random() * 5) + 3;

        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            // Trigger thunder flash
            if (ldFlash) {
                ldFlash.classList.add('active');
                setTimeout(() => ldFlash.classList.remove('active'), 200);
            }

            if (ldCount) ldCount.textContent = 'Storm Ready · প্রস্তুত';
            if (ldBtn) {
                ldBtn.style.transform = 'scale(1.05)';
                ldBtn.style.borderColor = '#10b981';
            }
        }

        // Update progress visuals
        if (ldPct) ldPct.innerHTML = `<b>${loadProgress}</b>%`;
        if (ldBar) {
            const offset = maxDash - (loadProgress / 100) * maxDash;
            ldBar.style.strokeDashoffset = offset;
        }
    }, 40);

    // Dismiss loader on button click or auto after 100%
    function dismissLoader() {
        if (loader) {
            loader.classList.add('loaded');
            document.body.classList.add('ready');
            // Trigger initial scroll reveal
            handleScrollReveal();
        }
    }

    if (ldBtn) {
        ldBtn.addEventListener('click', () => {
            // Start ambient audio on user gesture
            initAudio();
            toggleAudio();
            dismissLoader();
        });
    }

    // Auto dismiss after 3 seconds if user doesn't click
    setTimeout(() => {
        if (loadProgress >= 100 && loader && !loader.classList.contains('loaded')) {
            dismissLoader();
        }
    }, 3200);


    /* ══════════════════════════════════════════════════════════
       2. AMBIENT AUDIO SYNTHESIZER (Web Audio API)
       ══════════════════════════════════════════════════════════ */
    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let droneOsc1 = null;
    let droneOsc2 = null;

    function initAudio() {
        if (audioCtx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();

            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            masterGain.connect(audioCtx.destination);

            // Deep resonant mystic drone (Digital dropouts ambient style)
            droneOsc1 = audioCtx.createOscillator();
            droneOsc1.type = 'sine';
            droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

            droneOsc2 = audioCtx.createOscillator();
            droneOsc2.type = 'triangle';
            droneOsc2.frequency.setValueAtTime(110, audioCtx.currentTime); // Mid A

            // Low-pass filter for smooth warmth
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(220, audioCtx.currentTime);

            droneOsc1.connect(filter);
            droneOsc2.connect(filter);
            filter.connect(masterGain);

            droneOsc1.start();
            droneOsc2.start();
        } catch (e) {
            console.log('AudioContext not supported or blocked');
        }
    }

    function toggleAudio() {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const hearBtn = document.getElementById('hear');
        const stormBtn = document.getElementById('stormBtn');

        if (!isPlaying) {
            isPlaying = true;
            if (masterGain) {
                masterGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.8);
            }
            if (hearBtn) hearBtn.setAttribute('aria-pressed', 'true');
            if (stormBtn) stormBtn.setAttribute('aria-pressed', 'true');
        } else {
            isPlaying = false;
            if (masterGain) {
                masterGain.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.5);
            }
            if (hearBtn) hearBtn.setAttribute('aria-pressed', 'false');
            if (stormBtn) stormBtn.setAttribute('aria-pressed', 'false');
        }
    }

    const hearBtn = document.getElementById('hear');
    const stormBtn = document.getElementById('stormBtn');

    if (hearBtn) hearBtn.addEventListener('click', toggleAudio);
    if (stormBtn) stormBtn.addEventListener('click', toggleAudio);


    /* ══════════════════════════════════════════════════════════
       3. AMBIENT LIGHTNING FLASH EFFECT
       ══════════════════════════════════════════════════════════ */
    const ambientFlash = document.getElementById('ambientFlash');
    function triggerRandomFlash() {
        if (!ambientFlash) return;
        ambientFlash.style.opacity = (Math.random() * 0.4 + 0.3).toString();
        setTimeout(() => {
            ambientFlash.style.opacity = '0';
        }, 120);

        const nextFlash = Math.random() * 8000 + 6000;
        setTimeout(triggerRandomFlash, nextFlash);
    }
    setTimeout(triggerRandomFlash, 4000);


    /* ══════════════════════════════════════════════════════════
       4. FLOATING PARTICLES & EMBERS
       ══════════════════════════════════════════════════════════ */
    const leavesBg = document.getElementById('leavesBg');
    if (leavesBg) {
        const emberCount = 20;
        for (let i = 0; i < emberCount; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember';
            ember.style.left = Math.random() * 100 + '%';
            ember.style.animationDuration = (Math.random() * 9 + 8) + 's';
            ember.style.animationDelay = (Math.random() * 8) + 's';
            leavesBg.appendChild(ember);
        }
    }


    /* ══════════════════════════════════════════════════════════
       5. INTERACTIVE CANVAS SMOKE / MIST
       ══════════════════════════════════════════════════════════ */
    const smokeCanvas = document.getElementById('smokeCanvas');
    if (smokeCanvas) {
        const ctx = smokeCanvas.getContext('2d');
        let width = smokeCanvas.width = window.innerWidth;
        let height = smokeCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = smokeCanvas.width = window.innerWidth;
            height = smokeCanvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 80 + 40,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.4 - 0.1,
                alpha: Math.random() * 0.08 + 0.03
            });
        }

        function renderSmoke() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.y + p.radius < 0) {
                    p.y = height + p.radius;
                    p.x = Math.random() * width;
                }
                if (p.x + p.radius < 0) p.x = width + p.radius;
                if (p.x - p.radius > width) p.x = -p.radius;

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `rgba(53, 195, 159, ${p.alpha})`);
                grad.addColorStop(1, 'rgba(4, 8, 7, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(renderSmoke);
        }
        renderSmoke();
    }


    /* ══════════════════════════════════════════════════════════
       6. ASK ANISUR (CHARMS / FAQ EXPANSION)
       ══════════════════════════════════════════════════════════ */
    const charms = document.querySelectorAll('.charm');
    const seerSub = document.getElementById('seerSub');
    const seer = document.getElementById('seer');

    charms.forEach(charm => {
        const btn = charm.querySelector('.charm-b');
        btn.addEventListener('click', () => {
            const isActive = charm.classList.contains('active');

            // Close all charms
            charms.forEach(c => c.classList.remove('active'));

            if (!isActive) {
                charm.classList.add('active');

                // Animate seer pulse
                if (seer) {
                    seer.style.transform = 'scale(1.1)';
                    seer.style.boxShadow = '0 0 50px rgba(53,195,159,0.7)';
                    setTimeout(() => {
                        seer.style.transform = 'scale(1)';
                        seer.style.boxShadow = '0 0 30px rgba(53,195,159,0.4)';
                    }, 400);
                }

                if (seerSub) {
                    const qText = charm.querySelector('.charm-t').textContent;
                    seerSub.textContent = `Answering: "${qText}"`;
                }
            } else {
                if (seerSub) {
                    seerSub.textContent = 'Click on any charm around to unlock the answer.';
                }
            }
        });
    });


    /* ══════════════════════════════════════════════════════════
       7. BENTO 3D CARD TILT ON MOUSEMOVE
       ══════════════════════════════════════════════════════════ */
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            // Position glow
            const glow = card.querySelector('.b-card-glow');
            if (glow) {
                glow.style.left = `${x - 125}px`;
                glow.style.top = `${y - 125}px`;
                glow.style.right = 'auto';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });


    /* ══════════════════════════════════════════════════════════
       8. SCROLL REVEAL OBSERVER
       ══════════════════════════════════════════════════════════ */
    const reveals = document.querySelectorAll('.reveal');

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.9;

        reveals.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollReveal, { passive: true });
    handleScrollReveal();


    /* ══════════════════════════════════════════════════════════
       9. LIVE CAPTION BANNER ROTATOR
       ══════════════════════════════════════════════════════════ */
    const captionEl = document.querySelector('.caption-text');
    if (captionEl) {
        const slogans = [
            "স্ক্রল কম, ইনকাম বেশি — Fast Apps · Viral Content · Scaled Commerce",
            "MD Anisur Rahaman · App & Web Developer & Sub Co-Founder",
            "Direct Deals · High Conversion · WhatsApp Direct Connection",
            "Nursery Business & E-Commerce Scalable Systems"
        ];
        let sloganIndex = 0;

        setInterval(() => {
            sloganIndex = (sloganIndex + 1) % slogans.length;
            captionEl.style.opacity = '0';
            setTimeout(() => {
                captionEl.textContent = slogans[sloganIndex];
                captionEl.style.opacity = '1';
            }, 300);
        }, 5000);
    }

});
