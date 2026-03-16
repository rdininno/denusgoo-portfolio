// ============================================
// FEATURED GALLERY (Homepage - Stacking Slides)
// ============================================

const TUMBLR_API_KEY = 'EBU8xEbFKnri6GtYbGI1tPlJn1QDTe1c6SN969IYncxZpoj6Jc';
const TUMBLR_BLOG = 'denusgoo';

async function loadFeaturedGallery() {
    const container = document.getElementById('featured-gallery');
    if (!container) return;

    try {
        const url = `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG}.tumblr.com/posts?api_key=${TUMBLR_API_KEY}&limit=50`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.meta.status !== 200) {
            throw new Error(data.meta.msg);
        }

        const posts = data.response.posts;

        // Extract images from all posts
        const images = [];

        posts.forEach((post) => {
            if (post.type === 'photo' && post.photos?.length > 0) {
                images.push(post.photos[0].original_size.url);
            } else if (post.type === 'text' && post.body) {
                const imgMatch = post.body.match(/<img[^>]+src="([^"]+)"/);
                if (imgMatch) {
                    images.push(imgMatch[1]);
                }
            }
        });

        // Shuffle and pick 4
        const shuffled = images.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        // Apply images to slides (including first image)
        const slides = container.querySelectorAll('.featured-slide');
        selected.forEach((imgUrl, i) => {
            if (slides[i]) {
                slides[i].style.backgroundImage = `url(${imgUrl})`;
            }
        });

        // Initialize animations
        initGalleryAnimations();
    } catch (error) {
        console.error('Error loading featured gallery:', error);
    }
}

function initGalleryAnimations() {
    const slides = document.querySelectorAll('.featured-slide');

    slides.forEach((slide, i) => {});
}

document.addEventListener('DOMContentLoaded', loadFeaturedGallery);
