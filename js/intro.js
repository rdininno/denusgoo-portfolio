// ============================================
// INTRO ANIMATION
// ============================================

function initIntroAnimation() {
    const intro = document.querySelector('.intro');
    const introName = document.querySelector('.intro-name');
    const introBg = document.querySelector('.intro-bg');

    if (!intro || !introName || !introBg) return;

    console.log('Intro animation initialized');

    // Phase 1: Name slides in from the right
    gsap.set(introName, { xPercent: 100 });

    gsap.to(introName, {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: intro,
            start: 'top top',
            end: '50% top',
            scrub: 1,
            markers: true, // Remove this after testing
        },
    });

    // Phase 2: Background fades out
    gsap.to(introBg, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: intro,
            start: '50% top',
            end: 'bottom top',
            scrub: 1,
            markers: true, // Remove this after testing
        },
    });
}

document.addEventListener('DOMContentLoaded', initIntroAnimation);
