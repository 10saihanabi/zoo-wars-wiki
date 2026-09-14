(() => {
  const D = window.ZOO_WIKI;

  D.currentVersion = '1.3.1';
  D.lastChecked = '2026-09-14';

  D.versions = D.versions.map((version) => {
    if (version.id !== '1.3.0') {
      return version;
    }

    return {
      ...version,
      label: 'Ver.1.3.0',
    };
  });

  if (!D.versions.some((version) => version.id === '1.3.1')) {
    D.versions.unshift({
      id: '1.3.1',
      label: 'Ver.1.3.1（現行）',
      date: '2026-09-13',
      text: 'ブドウの粒の数を5から4に変更。',
    });
  }

  const budou = D.cards.find((card) => card.slug === 'budou');

  if (budou) {
    budou.extra = 'ターゲット：動物 / 粒ダメージ：80×4';
  }

  document.getElementById('content').innerHTML = `
    <section id="today-post">
      <h1>今日の1枚</h1>
      <div id="todayPost" class="community-feature">
        <p class="small">投稿を読み込んでいます…</p>
      </div>
      <p class="community-actions">
        <a class="button-link" href="submit.html">投稿する</a>
        <a href="community.html">みんなの投稿を見る →</a>
      </p>
    </section>

    <h1>現行環境</h1>
    <div class="box current">
      <strong>Ver.1.3.1 / 2026-09-13</strong><br>
      ブドウの粒の数が5から4に変更されました。
      旧環境の記事や評価を見る際はバージョンに注意してください。
    </div>

    <p>
      <a href="updates.html">アップデート履歴を見る →</a>
    </p>
  `;
})();
