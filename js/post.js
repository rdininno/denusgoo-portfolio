// ============================================
// SINGLE POST LOADER (API V2)
// ============================================

const TUMBLR_API_KEY = 'EBU8xEbFKnri6GtYbGI1tPlJn1QDTe1c6SN969IYncxZpoj6Jc';

async function loadPost(blog, postId) {
    const container = document.getElementById('single-post');
    if (!container) return;

    try {
        const url = `https://api.tumblr.com/v2/blog/${blog}.tumblr.com/posts?api_key=${TUMBLR_API_KEY}&id=${postId}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.meta.status !== 200 || !data.response.posts.length) {
            throw new Error('Post not found');
        }

        const post = data.response.posts[0];

        // Update page title
        document.title = getPostTitle(post) + ' — Denusgoo';

        // Render the post
        container.innerHTML = renderPost(post);

        // Animate in
        gsap.from(container.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
        });
    } catch (error) {
        console.error('Error loading post:', error);
        container.innerHTML = `<div class="loading">Error: ${error.message}</div>`;
    }
}

function getPostTitle(post) {
    if (post.type === 'photo') {
        return stripHtml(post.caption).substring(0, 50) || 'Photo';
    } else if (post.type === 'video') {
        return stripHtml(post.caption).substring(0, 50) || 'Video';
    } else if (post.type === 'text') {
        return post.title || 'Post';
    }
    return 'Post';
}

function renderPost(post) {
    let html = '';

    const date = new Date(post.timestamp * 1000);
    const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    if (post.type === 'photo') {
        const imageUrl = post.photos?.[0]?.original_size?.url || '';
        const caption = post.caption || '';

        html = `
            <div class="single-post-image">
                <img src="${imageUrl}" alt="">
            </div>
            <div class="single-post-meta">
                <span class="single-post-date">${dateStr}</span>
                ${renderTags(post.tags)}
            </div>
            ${caption ? `<div class="single-post-body">${caption}</div>` : ''}
        `;
    } else if (post.type === 'video') {
        const videoEmbed = post.player?.[post.player.length - 1]?.embed_code || '';
        const caption = post.caption || '';

        html = `
            <div class="single-post-video">${videoEmbed}</div>
            <div class="single-post-meta">
                <span class="single-post-date">${dateStr}</span>
                ${renderTags(post.tags)}
            </div>
            ${caption ? `<div class="single-post-body">${caption}</div>` : ''}
        `;
    } else if (post.type === 'text') {
        const title = post.title || '';
        const body = post.body || '';

        html = `
            ${title ? `<h1 class="single-post-title">${escapeHtml(title)}</h1>` : ''}
            <div class="single-post-meta">
                <span class="single-post-date">${dateStr}</span>
                ${renderTags(post.tags)}
            </div>
            <div class="single-post-body">${body}</div>
        `;
    }

    html += `
        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(0,0,0,0.1);">
            <a href="javascript:history.back()" style="opacity: 0.6;">← Back</a>
        </div>
    `;

    return html;
}

function renderTags(tags) {
    if (!tags || tags.length === 0) return '';
    return `
        <div class="post-card-tags">
            ${tags.map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
    `;
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

// Init
(function () {
    const container = document.getElementById('single-post');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        container.innerHTML = '<div class="loading">No post ID specified.</div>';
        return;
    }

    const blog = window.TUMBLR_BLOG || 'denusgoo';
    loadPost(blog, postId);
})();
