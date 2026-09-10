(()=> {
  const D = window.ZOO_WIKI;
  const esc = v => String(v ?? '—');
  const badge=(cls,text)=>`<span class="badge ${cls}">${text}</span>`;
  const top='<a class="toplink" href="#top">▲上へ</a>';
  const table=(heads,rows,cls='')=>`<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;

  const cardRows=D.cards.map(c=>`<tr>
    <td class="card-name">${c.name}</td>
    <td>${c.kind}</td>
    <td>${c.cost}</td>
    <td>${esc(c.hp)}</td>
    <td>${esc(c.damage)}</td>
    <td>${esc(c.dps)}</td>
    <td>${esc(c.speed)}</td>
    <td>${esc(c.extra)}</td>
    <td>${c.desc}</td>
  </tr>`);
  const roleRows=D.roles.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
  const counterRows=D.counters.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${badge(r[3],r[4])}</td></tr>`);
  const ruleRows=D.rules.map(r=>`<tr><td>${r[0]}</td><td class="${r[1]==='—'?'blank':''}">${r[1]}</td><td>${badge(r[2],r[3])}</td></tr>`);
  const updateRows=D.updates.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
  const sourceRows=D.sources.map(s=>{
    const title=s[3]?`<a href="${s[3]}" target="_blank" rel="noopener">${s[2]}</a>`:s[2];
    return `<li>${badge(s[0],s[1])} ${title} — ${s[4]}。</li>`;
  }).join('');

  document.getElementById('content').innerHTML=`
    <h1>動物園ウォーズ攻略Wiki</h1>
    <p class="lead">『動物園ウォーズ（Zoo Wars）』の非公式攻略Wikiです。公開情報と、Ver.1.3.0のゲーム内表示を分けて記録しています。</p>
    <div class="box current">
      <strong>現行：Ver.1.3.0（2026-09-07）</strong><br>
      新カード「ブドウ」、対戦履歴・リプレイ機能を追加。シロクマとライオンが強化されています。
      <div class="small">情報確認日：${D.lastChecked}</div>
    </div>

    <section id="version-detail"><h2>バージョン情報</h2><div id="versionDetail" class="box info"></div></section>

    <section id="meta">
      <h2>現環境 ${top}</h2>
      <div class="box warn"><strong>Ver.1.3.0 Tier：未掲載</strong><br>公開されたばかりで、信頼できる現行Tierをまだ確認できていません。管理人Tierまたは十分な対戦データが得られるまで空欄にします。</div>
      <h3>直前環境 Ver.1.2.1</h3>
      <p>直前環境の振り返り記事では、筆者個人の見解として「ゾウ＋サル」を軸にした構成が環境の中心だったとされています。ニワトリはヒヨコが蓄積すると圧力が増す一方、メロンでまとめて処理できるという評価でした。 ${badge('community','個人攻略記事')}</p>
    </section>

    <section id="cards">
      <h2>カード一覧・現行ステータス ${top}</h2>
      <p><strong>Ver.1.3.0のゲーム内カード詳細画面（2026-09-10録画）を優先</strong>しています。現在確認できる全21カードを掲載しています。</p>
      ${table(['カード','種別','コスト','HP','ダメージ','毎秒ダメージ','移動速度','特殊値 / 対象','概要'],cardRows)}
      <p class="small">※「—」はカード詳細画面にその項目が表示されない、または現時点で確認できないものです。毎秒ダメージから攻撃間隔を逆算した値など、推測値は入れていません。</p>
    </section>

    <section id="beginner">
      <h2>初心者向け ${top}</h2>
      <p>まずは「低コスト」「前衛」「対空」「大型処理」「範囲処理」「即時干渉」を6枚の中でどう分担するかを見ると、相手の特定カードだけで崩壊するデッキを避けやすくなります。</p>
      <div class="box info">現行Ver.1.3.0の初心者向け固定6枚は、環境が固まるまで断定せず保留します。</div>
    </section>

    <section id="roles"><h2>役割別 ${top}</h2>${table(['役割','代表例','説明'],roleRows)}</section>

    <section id="deck">
      <h2>デッキ構築 ${top}</h2>
      <p>公開攻略では、カード単体のTier以上に「弱点を別カードで補う」構築が重視されています。Ver.1.2.1ではゾウ＋サル、キリン＋タカ、キリン＋レモンなどが環境例として挙げられました。Ver.1.3.0ではシロクマ・ライオン強化とブドウ追加が入ったため、現行で再検証します。</p>
    </section>

    <section id="counters">
      <h2>相性・対策 ${top}</h2>
      <p>旧環境の知見は消さず、バージョンを明示して残します。Ver.1.3.0で再確認できたものから現行扱いへ更新します。</p>
      ${table(['相手','候補','考え方','状態'],counterRows)}
    </section>

    <section id="rules"><h2>ルール・仕様 ${top}</h2>${table(['項目','確認内容','根拠'],ruleRows)}</section>

    <section id="kifu">
      <h2>棋譜 ${top}</h2>
      <p>コスト消費・動物/動物園HP変化・撃破などの重要イベントを「1手」とし、その瞬間のHP、コスト、場の動物、各個体の位置を保存して局面を再現する形式を試作しています。</p>
      <p><a href="kifu-001.html"><strong>▶ 第1局の棋譜を再生する</strong></a></p>
    </section>

    <section id="updates"><h2>アップデート履歴 ${top}</h2>${table(['日付','Ver.','主な内容'],updateRows,'updates')}</section>

    <section id="wanted">
      <h2>情報募集中 ${top}</h2>
      <div class="box missing"><strong>ここは推測で埋めていません。</strong> 現行ゲーム内表示や公式テキストで確認できなかった項目です。</div>
      <ul>${D.wanted.map(x=>`<li>${x}</li>`).join('')}</ul>
    </section>

    <section id="sources">
      <h2>出典 ${top}</h2>
      <p>現行ステータスはゲーム内表示を最優先し、公式更新履歴で変更経緯を補完しています。攻略記事の評価・相性は、その記事のバージョンに限定して扱います。</p>
      <ul class="source-list">${sourceRows}</ul>
    </section>`;

  const sel=document.getElementById('versionSelect'),note=document.getElementById('versionNote'),detail=document.getElementById('versionDetail');
  D.versions.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.label;sel.appendChild(o)});
  function renderVersion(){
    const v=D.versions.find(x=>x.id===sel.value)||D.versions[0];
    note.textContent=v.date;
    detail.innerHTML=`<strong>${v.label}</strong> <span class="small">${v.date}</span><br>${v.text}`;
    localStorage.setItem('zooWikiVersion',v.id);
  }
  const saved=localStorage.getItem('zooWikiVersion');
  if(saved&&D.versions.some(v=>v.id===saved)) sel.value=saved; else sel.value=D.currentVersion;
  sel.addEventListener('change',renderVersion); renderVersion();

  const targets=[...document.querySelectorAll('main section')].map(s=>({id:s.id,title:(s.querySelector('h2')?.textContent||s.id).replace('▲上へ','').trim(),text:s.textContent}));
  const input=document.getElementById('searchInput'),results=document.getElementById('searchResults');
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){results.hidden=true;results.innerHTML='';return}
    const cardHits=D.cards.filter(c=>JSON.stringify(c).toLowerCase().includes(q)).slice(0,8);
    const secHits=targets.filter(x=>x.text.toLowerCase().includes(q)).slice(0,5);
    const links=[
      ...cardHits.map(c=>`<a href="#cards">${c.name}（コスト${c.cost}）</a>`),
      ...secHits.map(x=>`<a href="#${x.id}">${x.title}</a>`)
    ];
    results.innerHTML=links.length?links.slice(0,10).join(''):'該当なし';
    results.hidden=false;
  });
})();