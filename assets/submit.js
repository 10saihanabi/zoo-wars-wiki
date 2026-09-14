(() => {
  const form = document.getElementById('communityForm');
  const message = document.getElementById('submitMessage');
  const config = window.DBW_SUPABASE || {};

  if (!form || !message) {
    return;
  }

  const setMessage = (text, type = '') => {
    message.className = `community-submit-message ${type}`.trim();
    message.textContent = text;
  };

  if (!config.url || !config.anonKey || !window.supabase) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setMessage(
        '投稿機能は準備済みです。Supabase接続後に送信できます。',
        'warn',
      );
    });
    return;
  }

  const client = window.supabase.createClient(
    config.url,
    config.anonKey,
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('送信しています…');

    const data = new FormData(form);
    const image = data.get('image');
    let imageUrl = null;

    try {
      if (image && image.size > 0) {
        if (image.size > 8 * 1024 * 1024) {
          throw new Error('画像は8MB以下にしてください。');
        }

        const extension = image.name.split('.').pop().toLowerCase();
        const safeExtension = ['jpg', 'jpeg', 'png', 'webp', 'gif']
          .includes(extension)
          ? extension
          : 'jpg';
        const fileName = `${crypto.randomUUID()}.${safeExtension}`;

        const upload = await client.storage
          .from('community-images')
          .upload(`pending/${fileName}`, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (upload.error) {
          throw upload.error;
        }

        const publicUrl = client.storage
          .from('community-images')
          .getPublicUrl(upload.data.path);

        imageUrl = publicUrl.data.publicUrl;
      }

      const payload = {
        author_name: String(data.get('author_name') || '').trim() || '匿名',
        category: String(data.get('category') || '').trim(),
        title: String(data.get('title') || '').trim(),
        body: String(data.get('body') || '').trim(),
        image_url: imageUrl,
        rights_confirmed: data.get('rights_confirmed') === 'on',
        status: 'pending',
      };

      const insert = await client
        .from('community_posts')
        .insert(payload);

      if (insert.error) {
        throw insert.error;
      }

      form.reset();
      setMessage(
        '投稿しました。管理者の確認後に公開されます。',
        'success',
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || '投稿に失敗しました。時間をおいて再度お試しください。',
        'warn',
      );
    }
  });
})();
