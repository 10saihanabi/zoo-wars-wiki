(() => {
  const config = window.DBW_SUPABASE || {};
  const todayRoot = document.getElementById('todayPost');
  const listRoot = document.getElementById('communityList');

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderPost = (post, featured = false) => {
    const image = post.image_url
      ? `
        <div class="community-image-wrap">
          <img
            class="community-image"
            src="${escapeHtml(post.image_url)}"
            alt="${escapeHtml(post.title || '投稿画像')}"
            loading="lazy"
          >
        </div>
      `
      : '';

    return `
      <article class="community-post${featured ? ' featured' : ''}">
        <div class="community-post-meta">
          <span class="badge community">${escapeHtml(post.category)}</span>
          <span>${escapeHtml(post.author_name || '匿名')}</span>
        </div>
        <h2>${escapeHtml(post.title)}</h2>
        ${image}
        <p class="community-body">${escapeHtml(post.body)}</p>
      </article>
    `;
  };

  const showSetupMessage = (root) => {
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="box info">
        投稿機能は準備済みです。
        Supabase接続後にユーザー投稿が表示されます。
      </div>
    `;
  };

  if (!config.url || !config.anonKey || !window.supabase) {
    showSetupMessage(todayRoot);
    showSetupMessage(listRoot);
    return;
  }

  const client = window.supabase.createClient(
    config.url,
    config.anonKey,
  );

  const loadToday = async () => {
    if (!todayRoot) {
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    let { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('status', 'approved')
      .eq('featured_date', today)
      .order('approved_at', { ascending: false })
      .limit(1);

    if (!error && (!data || data.length === 0)) {
      const fallback = await client
        .from('community_posts')
        .select('*')
        .eq('status', 'approved')
        .not('featured_date', 'is', null)
        .order('featured_date', { ascending: false })
        .limit(1);

      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      todayRoot.innerHTML = `
        <div class="box warn">
          今日の1枚を読み込めませんでした。
        </div>
      `;
      return;
    }

    if (!data || data.length === 0) {
      todayRoot.innerHTML = `
        <div class="box info">
          今日の1枚はまだありません。
          最初の投稿をお待ちしています。
        </div>
      `;
      return;
    }

    todayRoot.innerHTML = renderPost(data[0], true);
  };

  const loadCommunity = async () => {
    if (!listRoot) {
      return;
    }

    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false })
      .limit(50);

    if (error) {
      listRoot.innerHTML = `
        <div class="box warn">
          投稿一覧を読み込めませんでした。
        </div>
      `;
      return;
    }

    if (!data || data.length === 0) {
      listRoot.innerHTML = `
        <div class="box info">
          承認済みの投稿はまだありません。
        </div>
      `;
      return;
    }

    listRoot.innerHTML = data
      .map((post) => renderPost(post))
      .join('');
  };

  loadToday();
  loadCommunity();
})();
