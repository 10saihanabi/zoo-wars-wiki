(() => {
  const data = window.DBW_COMMUNITY || {
    featuredId: null,
    posts: [],
  };

  const todayRoot = document.getElementById('todayPost');
  const listRoot = document.getElementById('communityList');

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderPost = (post, featured = false) => {
    const image = post.image
      ? `
        <div class="community-image-wrap">
          <img
            class="community-image"
            src="${escapeHtml(post.image)}"
            alt="${escapeHtml(post.title || '投稿画像')}"
            loading="lazy"
          >
        </div>
      `
      : '';

    const date = post.publishedAt
      ? `<span>${escapeHtml(post.publishedAt)}</span>`
      : '';

    return `
      <article class="community-post${featured ? ' featured' : ''}">
        <div class="community-post-meta">
          <span class="badge community">
            ${escapeHtml(post.category || 'その他')}
          </span>
          <span>${escapeHtml(post.author || '匿名')}</span>
          ${date}
        </div>
        <h2>${escapeHtml(post.title || '')}</h2>
        ${image}
        <p class="community-body">${escapeHtml(post.body || '')}</p>
      </article>
    `;
  };

  const posts = Array.isArray(data.posts)
    ? [...data.posts]
    : [];

  posts.sort((a, b) => String(b.publishedAt || '')
    .localeCompare(String(a.publishedAt || '')));

  if (todayRoot) {
    const featured = posts.find(
      (post) => post.id === data.featuredId,
    ) || posts[0];

    todayRoot.innerHTML = featured
      ? renderPost(featured, true)
      : `
        <div class="box info">
          今日の1枚はまだありません。<br>
          攻略、小ネタ、デッキ、ファンアートを募集中です。
        </div>
      `;
  }

  if (listRoot) {
    listRoot.innerHTML = posts.length
      ? posts.map((post) => renderPost(post)).join('')
      : `
        <div class="box info">
          掲載中の投稿はまだありません。<br>
          最初の投稿をお待ちしています。
        </div>
      `;
  }
})();
