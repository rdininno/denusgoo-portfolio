// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('Ready to animate!');

    gsap.set('.intro-name', { xPercent: 100 });

    const slides = gsap.utils.toArray('.featured-slide');

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.intro',
            start: 'top top',
            end: '+=900%',
            scrub: 2,
            pin: true,
        },
    });

    tl.to(
        '.intro-overlay',
        {
            xPercent: -100,
            duration: 2,
        },
        0
    );

    tl.to(
        '.intro-name',
        {
            xPercent: 0,
            duration: 2,
        },
        0
    );

    tl.to(
        '.intro-name',
        {
            backgroundColor: 'transparent',
            color: '#000',
            duration: 4,
        },
        '+=1'
    );

    gsap.set(slides[1], { xPercent: 100 });
    gsap.set(slides[2], { yPercent: 100 });
    gsap.set(slides[3], { xPercent: -100 });

    slides.forEach((slide, i) => {
        if (i === 0) return;

        tl.to(
            slide,
            {
                xPercent: 0,
                yPercent: 0,
                duration: 2,
            },
            `slide-${i}`
        );
    });

    // Phase 4: Hold on last slide briefly
    tl.to({}, { duration: 1 });
});

// ============================================
// HELPER: Reveal post cards (used by tumblr.js)
// ============================================
function revealPostCards() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card) => {
        card.style.opacity = '1';
    });
}
