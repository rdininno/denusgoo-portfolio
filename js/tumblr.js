// ============================================
// TUMBLR API V2 INTEGRATION
// ============================================

const TUMBLR_API_KEY = 'EBU8xEbFKnri6GtYbGI1tPlJn1QDTe1c6SN969IYncxZpoj6Jc';

async function fetchPosts(blog, tag) {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;

    try {
        const url = `https://api.tumblr.com/v2/blog/${blog}.tumblr.com/posts?api_key=${TUMBLR_API_KEY}&tag=${encodeURIComponent(tag)}&limit=20`;

        console.log('Fetching:', url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('API Response:', data);
        console.log('Posts:', data.response?.posts);

        if (data.meta.status !== 200) {
            throw new Error(data.meta.msg);
        }

        grid.innerHTML = '';

        const posts = data.response.posts;

        console.log('Number of posts:', posts?.length);

        if (!posts || posts.length === 0) {
            grid.innerHTML = '<div class="loading">No posts found.</div>';
            return;
        }

        posts.forEach((post) => {
            console.log('Processing post:', post.id, post.type, post.tags);
            const card = createPostCard(post);
            if (card) {
                grid.appendChild(card);
            }
        });

        setTimeout(revealPostCards, 100);
    } catch (error) {
        console.error('Error fetching posts:', error);
        grid.innerHTML = `<div class="loading">Error loading posts: ${error.message}</div>`;
    }
}
function createPostCard(post) {
    const template = document.getElementById('post-card-template');
    const card = template.content.cloneNode(true);

    // Get the image
    let imageUrl = '';
    if (post.type === 'photo' && post.photos?.[0]) {
        imageUrl = post.photos[0].original_size.url;
    } else if (post.body) {
        const match = post.body.match(/<img[^>]+src="([^"]+)"/);
        if (match) imageUrl = match[1];
    }

    // Fill in the data
    const link = card.querySelector('a');
    link.href = `post.html?id=${post.id}`;

    const img = card.querySelector('.post-card-image img');
    img.src = imageUrl;
    img.alt = stripHtml(post.caption || post.title || '');

    const title = card.querySelector('.post-card-title');
    title.textContent = getCardTitle(post);

    return card;
}

function getCardTitle(post) {
    if (post.type === 'photo') {
        return stripHtml(post.caption) || 'Photo';
    } else if (post.type === 'video') {
        return stripHtml(post.caption) || 'Video';
    } else if (post.type === 'text') {
        return post.title || 'Post';
    }
    return 'Post';
}

function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
}

document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;

    const blog = window.TUMBLR_BLOG || 'denusgoo';
    const tag = window.CURRENT_TAG || '';

    console.log('Blog:', blog, 'Tag:', tag);

    fetchPosts(blog, tag);
});
