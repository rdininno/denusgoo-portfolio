// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
    gsap.set('.intro-name', { xPercent: 100 });
    gsap.set('.landing-content', { yPercent: 100, opacity: 0 });

    const slides = gsap.utils.toArray('.featured-slide');
    gsap.set(slides[1], { yPercent: 100 });

    // Build the timeline WITHOUT ScrollTrigger
    let tl = gsap.timeline({ paused: true });

    // Phase 1: Overlay off + text in
    tl.to('.intro-overlay', { xPercent: -100, duration: 2 }, 0);
    tl.to('.intro-name', { xPercent: 0, duration: 2 }, 0);

    // Phase 2: Reveal
    tl.to(
        '.intro-name',
        {
            backgroundColor: 'transparent',
            color: '#000',
            duration: 4,
        },
        '+=1'
    );

    // Phase 3: Second slide
    tl.to(slides[1], {
        yPercent: 0,
        duration: 3,
        ease: 'power2.out',
    });

    // Phase 4: Buttons
    tl.to('.landing-content', {
        yPercent: 0,
        opacity: 1,
        duration: 3,
        ease: 'power2.out',
    });

    tl.to({}, { duration: 1 });

    // Use Observer to drive the timeline
    let progress = 0;
    const speed = 0.0003;

    ScrollTrigger.observe({
        type: 'wheel,touch,pointer',
        onChangeY(self) {
            const multiplier = ScrollTrigger.isTouch === 1 ? 0.0003 : 0.0005;
            progress += self.deltaY * multiplier;
            progress = gsap.utils.clamp(0, 1, progress);
            gsap.to(tl, {
                progress: progress,
                duration: 2,
                ease: 'power2.out',
                overwrite: true,
            });
        },
        tolerance: 5,
        preventDefault: true,
    });
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
