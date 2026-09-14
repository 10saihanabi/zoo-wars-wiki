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

  if (
    Array.isArray(D.updates) &&
    !D.updates.some((row) => row[1] === '1.3.1')
  ) {
    D.updates.unshift([
      '2026-09-13',
      '1.3.1',
      'ブドウの粒の数を5から4に変更。',
    ]);
  }

  const budou = D.cards.find((card) => card.slug === 'budou');

  if (budou) {
    budou.extra = 'ターゲット：動物 / 粒ダメージ：80×4';
  }

  D.rules = D.rules.map((row) => (
    row[0] === 'コスト自然回復速度'
      ? [
        'コスト自然回復速度',
        '2秒に1コスト',
        'game',
        'ゲーム内確認',
      ]
      : row
  ));

  D.wanted = D.wanted.filter(
    (item) => !item.includes('コスト自然回復速度'),
  );

  const pollOptions = [
    ['ブドウ', 'assets/poll/budou-icon.svg'],
    ['トラ', 'assets/poll/tora-icon.svg'],
    ['スイカ', 'assets/poll/suika-icon2.svg'],
    ['モグラ', 'assets/poll/mogura-icon2.svg'],
    ['その他', null],
  ];

  const icon = (name, src) => {
    if (!src) {
      return `
        <span
          class="poll-card-icon poll-card-other"
          aria-hidden="true"
        >
          ？
        </span>
      `;
    }

    return `
      <img
        src="${src}"
        alt="${name}"
        width="96"
        height="96"
        style="
          display: block;
          width: 96px;
          height: 96px;
          object-fit: cover;
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, .18);
        "
      >
    `;
  };

  document.getElementById('content').innerHTML = `
    <h1>現行環境</h1>

    <div class="box current">
      <strong>Ver.1.3.1 / 2026-09-13</strong><br>
      ブドウの粒の数が5から4に変更されました。
      Ver.1.3.0からブドウの処理性能が下がっているため、
      旧環境の記事や評価を見る際はバージョンに注意してください。
    </div>

    <p>
      <a href="updates.html">アップデート履歴を見る →</a>
    </p>

    <h1>環境アンケート</h1>
    <section id="poll" class="poll-section">
      <div class="poll-box">
        <div class="poll-title">絶対外せないのは？</div>
        <div class="poll-sub">Ver.1.3.1</div>

        <div class="poll-options">
          ${pollOptions.map(([name, src]) => `
            <button
              type="button"
              class="poll-option"
              data-poll="${name}"
            >
              ${icon(name, src)}
              <span class="poll-option-label">${name}</span>
            </button>
          `).join('')}
        </div>

        <div id="pollMessage" class="poll-message">
          集計機能は準備中です。
          回答先を接続後、そのまま投票できるようにします。
        </div>
      </div>
    </section>
  `;

  const message = document.getElementById('pollMessage');
  const buttons = document.querySelectorAll('.poll-option');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');

      message.textContent =
        `「${button.dataset.poll}」を選択中。` +
        '集計先を接続後、このボタンから投票できます。';

      localStorage.setItem('zooPollDraft', button.dataset.poll);
    });
  });

  const draft = localStorage.getItem('zooPollDraft');

  if (draft) {
    const selected = [...buttons].find(
      (button) => button.dataset.poll === draft,
    );

    if (selected) {
      selected.classList.add('selected');
      message.textContent =
        `「${draft}」を選択中。` +
        '集計先を接続後、このボタンから投票できます。';
    }
  }
})();
