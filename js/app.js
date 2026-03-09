// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // LANDING PAGE ANIMATIONS
    // ============================================
    const landing = document.querySelector('.landing');

    if (landing) {
        const name = document.querySelector('.landing-name');
        const tagline = document.querySelector('.landing-tagline');
        const btnDrawings = document.querySelector('.btn-drawings');
        const btnVideos = document.querySelector('.btn-videos');

        // 1. NAME: Expands from center on page load
        gsap.to(name, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
        });

        // 2. TAGLINE: Scrolls up into view
        if (tagline) {
            gsap.to(tagline, {
                scrollTrigger: {
                    trigger: landing,
                    start: 'top top',
                    end: '25% top',
                    scrub: 1,
                },
                y: 0,
                opacity: 1,
            });
        }

        // 3. DRAWINGS BUTTON: Scrolls up after tagline
        if (btnDrawings) {
            gsap.to(btnDrawings, {
                scrollTrigger: {
                    trigger: landing,
                    start: '25% top',
                    end: '40% top',
                    scrub: 1,
                },
                y: 0,
                opacity: 1,
            });
        }

        // 4. VIDEOS BUTTON: Scrolls up staggered
        if (btnVideos) {
            gsap.to(btnVideos, {
                scrollTrigger: {
                    trigger: landing,
                    start: '35% top',
                    end: '50% top',
                    scrub: 1,
                },
                y: 0,
                opacity: 1,
            });
        }
    }

    // ============================================
    // LOTTERY TEXT EFFECT (with magnetic on duplicates)
    // ============================================
    const lotteryElements = document.querySelectorAll('[data-lottery]');

    lotteryElements.forEach((el) => {
        const text = el.textContent;
        el.textContent = '';

        [...text].forEach((char) => {
            if (char === ' ') {
                const space = document.createElement('span');
                space.className = 'lottery-space';
                el.appendChild(space);
            } else {
                const wrapper = document.createElement('span');
                wrapper.className = 'lottery-char';

                const inner = document.createElement('span');
                inner.className = 'lottery-char-inner';
                inner.textContent = char;

                // Create duplicate as real element
                const duplicate = document.createElement('span');
                duplicate.className = 'lottery-char-duplicate';
                duplicate.textContent = char;

                inner.appendChild(duplicate);
                wrapper.appendChild(inner);
                el.appendChild(wrapper);

                // Lottery spin effect
                wrapper.addEventListener('mouseenter', function () {
                    gsap.to(inner, {
                        yPercent: -100,
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                });

                // Magnetic effect on duplicate only
                wrapper.addEventListener('mousemove', function (e) {
                    const rect = wrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;

                    gsap.to(duplicate, {
                        x: x * 0.4,
                        duration: 0.2,
                        ease: 'power2.out',
                    });
                });

                wrapper.addEventListener('mouseleave', function () {
                    gsap.to(inner, {
                        yPercent: 0,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.5)',
                    });
                    gsap.to(duplicate, {
                        x: 0,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.5)',
                    });
                });
            }
        });
    });

    // ============================================
    // MAGNETIC EFFECT
    // ============================================
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', function (e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out',
            });
        });

        el.addEventListener('mouseleave', function () {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)',
            });
        });
    });

    // ============================================
    // BLOB ANIMATIONS
    // ============================================
    const blobs = document.querySelectorAll('.blob');

    blobs.forEach((blob, i) => {
        // Morph shape
        gsap.to(blob, {
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            duration: 8 + i * 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Gentle float
        gsap.to(blob, {
            x: 'random(-50, 50)',
            y: 'random(-50, 50)',
            duration: 6 + i,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });
    });
});

// ============================================
// HELPER: Reveal post cards with stagger
// ============================================
function revealPostCards() {
    const cards = document.querySelectorAll('.post-card');

    cards.forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.1 + i * 0.08,
            onComplete: () => card.classList.add('revealed'),
        });
    });
}
