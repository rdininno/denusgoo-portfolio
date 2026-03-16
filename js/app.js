// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    ScrollTrigger.normalizeScroll({
        type: 'touch,wheel,pointer',
    });

    ScrollTrigger.config({
        ignoreMobileResize: true,
    });

    gsap.set('.intro-name', { xPercent: 100 });
    gsap.set('.landing-content', { yPercent: 100, opacity: 0 });

    const slides = gsap.utils.toArray('.featured-slide');
    gsap.set(slides[1], { yPercent: 100 });

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.intro',
            start: 'top top',
            end: '+=900%',
            scrub: 2,
            pin: true,
        },
    });

    // Phase 1: Overlay off + text in
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

    // Phase 2: Reveal — bg transparent, text black
    tl.to(
        '.intro-name',
        {
            backgroundColor: 'transparent',
            color: '#000',
            duration: 4,
        },
        '+=1'
    );

    // Phase 3: Second slide up from bottom
    tl.to(slides[1], {
        yPercent: 0,
        duration: 3,
        ease: 'power2.out',
    });

    // Phase 4: Buttons rise up
    tl.to('.landing-content', {
        yPercent: 0,
        opacity: 1,
        duration: 3,
        ease: 'power2.out',
    });

    // Hold
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
