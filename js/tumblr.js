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
        
        posts.forEach(post => {
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
    const article = document.createElement('article');
    article.className = 'post-card';
    
    let imageUrl = '';
    let title = '';
    
    // Handle different post types
    if (post.type === 'photo') {
        // Native photo post
        imageUrl = post.photos?.[0]?.original_size?.url || '';
        title = stripHtml(post.caption) || '';
    } else if (post.type === 'text') {
        // Text post - extract first image from body HTML
        const imgMatch = post.body?.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
            imageUrl = imgMatch[1];
        }
        title = post.title || stripHtml(post.body).substring(0, 100) || '';
    } else if (post.type === 'video') {
        imageUrl = post.thumbnail_url || '';
        title = stripHtml(post.caption) || 'Video';
    } else {
        return null;
    }
    
    article.innerHTML = `
        <a href="post.html?id=${post.id_string || post.id}">
            ${imageUrl ? `
                <div class="post-card-image">
                    <img src="${imageUrl}" alt="${escapeHtml(title)}" loading="lazy">
                </div>
            ` : ''}
            <div class="post-card-content">
                ${post.tags && post.tags.length > 0 ? `
                    <div class="post-card-tags">
                        ${post.tags.slice(0, 3).map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                ${title ? `<h2 class="post-card-title">${escapeHtml(truncate(title, 80))}</h2>` : ''}
            </div>
        </a>
    `;
    
    return article;
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

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    
    const blog = window.TUMBLR_BLOG || 'denusgoo';
    const tag = window.CURRENT_TAG || '';
    
    console.log('Blog:', blog, 'Tag:', tag);
    
    fetchPosts(blog, tag);
});