(() => {
  if (!window.__wikiMenuLoaded) {
    const menuScript = document.createElement('script');
    menuScript.src = 'assets/common-menu.js?v=20260914-1';
    document.head.appendChild(menuScript);
  }

  const D = window.ZOO_WIKI;
  D.currentVersion = '1.3.1';
  D.lastChecked = '2026-09-14';

  const slug =
    document.body.dataset.slug ||
    new URLSearchParams(location.search).get('card');

  const card = D.cards.find((item) => item.slug === slug);

  if (!card) {
    document.getElementById('content').innerHTML =
      '<h1>カードが見つかりません</h1>';
    return;
  }

  let guide = window.CARD_GUIDES[slug] || [
    '情報整理中。',
    '実戦データを募集中です。',
  ];

  let history = window.CARD_HISTORY[slug] || [
    '現時点で、公式公開テキストから個別の調整履歴は確認できていません。',
  ];

  if (slug === 'budou') {
    card.extra = 'ターゲット：動物 / 粒ダメージ：80×4';

    guide = [
      '3コストで対象へ300ダメージ。命中後に80ダメージの粒が4つ飛び散る。Ver.1.3.1で粒の数が5から4へ減少した。',
      '最初の対象だけでなく後方の敵へ追加価値を出せる点は同じだが、Ver.1.3.0より総ダメージ期待値は低下している。並び方と4粒の当たり方を前提に再検証が必要。',
    ];

    history = [
      ...history.filter((item) => !item.includes('Ver.1.3.1')),
      'Ver.1.3.1：粒の数を5→4に変更。',
    ];
  }

  const position = window.CARD_SPRITE[slug] || [0, 0];

  const value = (item) => (
    item === undefined || item === null ? '—' : item
  );

  const sameCostCards = D.cards
    .filter((item) => item.cost === card.cost && item.slug !== slug)
    .slice(0, 8);

  document.title = `${card.name} - 動物園ウォーズ攻略Wiki`;

  document.getElementById('content').innerHTML = `
    <nav class="crumb">
      <a href="index.html">トップ</a>
      &gt;
      <a href="cards.html">カード一覧</a>
      &gt;
      ${card.name}
    </nav>

    <h1>${card.name}</h1>

    <div class="card-hero">
      <div
        class="card-hero-icon"
        role="img"
        aria-label="${card.name}のカード画像"
        style="--card-col:${position[0]};--card-row:${position[1]}"
      ></div>

      <div class="card-hero-copy">
        <div class="card-kicker">
          Ver.${D.currentVersion} 現行データ
        </div>
        <p class="card-lead">${card.desc}</p>
        <p class="small">
          基本数値は2026-09-10のゲーム内表示から確認。
          Ver.1.3.1ではブドウの粒数のみ5→4に変更。
        </p>
      </div>
    </div>

    <h2>基本性能</h2>
    <div class="table-wrap">
      <table class="stats-table">
        <tbody>
          <tr>
            <th>コスト</th>
            <td>${card.cost}</td>
            <th>種別</th>
            <td>${card.kind}</td>
          </tr>
          <tr>
            <th>体力</th>
            <td>${value(card.hp)}</td>
            <th>移動速度</th>
            <td>${value(card.speed)}</td>
          </tr>
          <tr>
            <th>ダメージ</th>
            <td>${value(card.damage)}</td>
            <th>毎秒ダメージ</th>
            <td>${value(card.dps)}</td>
          </tr>
          <tr>
            <th>特殊値・対象</th>
            <td colspan="3">${value(card.extra)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>特徴</h2>
    <p>${guide[0]}</p>

    <h2>使い方・考察</h2>
    <p>${guide[1]}</p>

    <div class="box warn">
      <strong>相性表は検証中です。</strong><br>
      「このカードが何に勝つ/負けるか」は、
      配置、残コスト、周囲の動物で変わります。
      現行Ver.${D.currentVersion}の実戦・棋譜から順次追記します。
    </div>

    <h2>調整履歴</h2>
    <ul>
      ${history.map((item) => `<li>${item}</li>`).join('')}
    </ul>

    <h2>同コストのカード</h2>
    <div class="mini-card-grid">
      ${sameCostCards.map((item) => `
        <a href="${item.slug}.html">
          ${item.name}
          <span>コスト${item.cost}</span>
        </a>
      `).join('') || 'なし'}
    </div>

    <h2>出典・確認状況</h2>
    <ul>
      <li>
        基本ステータス：ゲーム内カード詳細画面
        （2026-09-10確認）
      </li>
      <li>
        Ver.1.3.1調整：Studio GG公式アップデート
        （2026-09-13）
      </li>
    </ul>

    <p class="small">
      <a href="cards.html">← カード一覧へ戻る</a>
    </p>
  `;
})();
