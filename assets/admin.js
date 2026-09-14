(() => {
  const config = window.DBW_SUPABASE || {};
  const loginSection = document.getElementById('adminLogin');
  const panel = document.getElementById('adminPanel');
  const form = document.getElementById('adminLoginForm');
  const loginMessage = document.getElementById('adminLoginMessage');
  const postsRoot = document.getElementById('adminPosts');
  const logoutButton = document.getElementById('adminLogout');

  if (!config.url || !config.anonKey || !window.supabase) {
    loginMessage.textContent =
      'Supabase接続後に管理画面を利用できます。';
    return;
  }

  const client = window.supabase.createClient(
    config.url,
    config.anonKey,
  );

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const setLoginState = (loggedIn) => {
    loginSection.hidden = loggedIn;
    panel.hidden = !loggedIn;
  };

  const renderAdminPost = (post) => {
    const image = post.image_url
      ? `
        <div class="community-image-wrap">
          <img
            class="community-image"
            src="${escapeHtml(post.image_url)}"
            alt="${escapeHtml(post.title)}"
          >
        </div>
      `
      : '';

    return `
      <article class="community-post admin-post" data-id="${post.id}">
        <div class="community-post-meta">
          <span class="badge community">${escapeHtml(post.category)}</span>
          <span>${escapeHtml(post.author_name || '匿名')}</span>
          <span>${escapeHtml(post.created_at || '')}</span>
        </div>
        <h2>${escapeHtml(post.title)}</h2>
        ${image}
        <p class="community-body">${escapeHtml(post.body)}</p>
        <div class="admin-actions">
          <button
            type="button"
            class="answer-button"
            data-action="approve"
          >
            承認
          </button>
          <button
            type="button"
            class="answer-button"
            data-action="reject"
          >
            却下
          </button>
          <label>
            今日の1枚にする日
            <input type="date" data-featured-date>
          </label>
          <button
            type="button"
            class="answer-button"
            data-action="feature"
          >
            日付を設定して承認
          </button>
        </div>
      </article>
    `;
  };

  const loadPending = async () => {
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      postsRoot.innerHTML = `
        <div class="box warn">
          投稿一覧を取得できませんでした。
        </div>
      `;
      return;
    }

    if (!data || data.length === 0) {
      postsRoot.innerHTML = `
        <div class="box info">
          確認待ちの投稿はありません。
        </div>
      `;
      return;
    }

    postsRoot.innerHTML = data
      .map(renderAdminPost)
      .join('');
  };

  const updatePost = async (id, values) => {
    const result = await client
      .from('community_posts')
      .update(values)
      .eq('id', id);

    if (result.error) {
      alert('更新に失敗しました。');
      return false;
    }

    await loadPending();
    return true;
  };

  postsRoot.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const article = button.closest('[data-id]');
    const id = article.dataset.id;
    const action = button.dataset.action;

    if (action === 'approve') {
      await updatePost(id, {
        status: 'approved',
        approved_at: new Date().toISOString(),
      });
      return;
    }

    if (action === 'reject') {
      await updatePost(id, {
        status: 'rejected',
        approved_at: null,
        featured_date: null,
      });
      return;
    }

    if (action === 'feature') {
      const dateInput = article.querySelector('[data-featured-date]');

      if (!dateInput.value) {
        alert('掲載日を選んでください。');
        return;
      }

      await updatePost(id, {
        status: 'approved',
        approved_at: new Date().toISOString(),
        featured_date: dateInput.value,
      });
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = 'ログインしています…';

    const formData = new FormData(form);
    const result = await client.auth.signInWithPassword({
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || ''),
    });

    if (result.error) {
      loginMessage.textContent = 'ログインできませんでした。';
      return;
    }

    loginMessage.textContent = '';
    setLoginState(true);
    await loadPending();
  });

  logoutButton.addEventListener('click', async () => {
    await client.auth.signOut();
    setLoginState(false);
  });

  client.auth.getSession().then(async ({ data }) => {
    const loggedIn = Boolean(data.session);
    setLoginState(loggedIn);

    if (loggedIn) {
      await loadPending();
    }
  });
})();
