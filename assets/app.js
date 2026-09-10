(()=>{
const D=window.ZOO_WIKI;
const badge=(cls,text)=>`<span class="badge ${cls}">${text}</span>`;
const table=(heads,rows,cls='')=>`<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const cardLink=c=>`<a class="card-name" href="${c.slug}.html">${c.name}</a>`;
const animals=D.cards.filter(c=>c.kind.startsWith('動物'));
const fruits=D.cards.filter(c=>c.kind==='果物');
const animalRows=animals.map(c=>`<tr><td>${cardLink(c)}</td><td>${c.cost}</td><td>${c.kind.replace('動物・','')}</td><td>${c.desc}</td></tr>`);
const fruitRows=fruits.map(c=>`<tr><td>${cardLink(c)}</td><td>${c.cost}</td><td>${c.damage}</td><td>${c.extra}</td></tr>`);
const roleRows=D.roles.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
const counterRows=D.counters.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${badge(r[3],r[4])}</td></tr>`);
const ruleRows=D.rules.map(r=>`<tr><td>${r[0]}</td><td class="${r[1]==='—'?'blank':''}">${r[1]}</td><td>${badge(r[2],r[3])}</td></tr>`);
const sourceRows=D.sources.map(s=>`<li>${badge(s[0],s[1])} ${s[3]?`<a href="${s[3]}" target="_blank" rel="noopener">${s[2]}</a>`:s[2]} — ${s[4]}</li>`).join('');
document.getElementById('content').innerHTML=`
<h1>動物園ウォーズ攻略Wiki</h1><p class="lead">『動物園ウォーズ（Zoo Wars）』の非公式攻略Wikiです。現行カード性能、対人戦の考え方、相性検証、棋譜研究をまとめます。</p>
<div class="box current"><strong>現行：Ver.1.3.0</strong>（2026-09-07）<br>ブドウ追加、対戦履歴・リプレイ追加。シロクマとライオンが強化されています。<div class="small">最終情報確認：${D.lastChecked}</div></div>
<div class="quick-start"><div><strong>初めての方へ</strong><br>ルール、デッキの考え方、最初に覚えるポイントをまとめています。<br><a href="beginner.html">▶ 初心者の手引きを読む</a></div><div><strong>買わなくてもフレンド対戦できます</strong><br>持っている人から招待URLをもらえば、ゲーム未所持でもブラウザから参加できます。<br><a href="beginner.html#free-friend">▶ 無料で試す方法</a></div></div>
<section id="meta"><h2>現環境</h2><div id="versionDetail" class="box info"></div><div class="box warn"><strong>Ver.1.3.0 Tier：情報収集中</strong><br>アップデート直後のため、根拠の薄い順位付けは掲載していません。</div></section>
<section id="cards"><h2>カード一覧</h2><p>カード名を押すと、画像・現行ステータス・使い方・調整履歴の個別ページを開きます。</p><h3>動物</h3>${table(['カード','コスト','タイプ','概要'],animalRows)}<h3>果物</h3>${table(['カード','コスト','ダメージ','効果・対象'],fruitRows)}</section>
<section id="roles"><h2>役割別</h2>${table(['役割','代表例','説明'],roleRows)}</section>
<section id="deck"><h2>デッキ構築</h2><p>6枚すべてを単体の強さだけで選ぶより、「低コスト」「前衛」「対空」「大型への回答」「範囲処理」「即時干渉」など、相手の攻めに回答できる役割を分散させる方が扱いやすいです。</p><p><a href="beginner.html#deck">初心者向けのデッキ構築解説 →</a></p></section>
<section id="counters"><h2>相性・対策</h2><p>旧環境の知見を含みます。Ver.1.3.0の棋譜・実戦で確認できたものから現行扱いへ更新します。</p>${table(['相手','候補','考え方','状態'],counterRows)}</section>
<section id="rules"><h2>ルール・仕様</h2>${table(['項目','確認内容','根拠'],ruleRows)}</section>
<section id="kifu"><h2>棋譜</h2><p>コスト消費・HP変化・撃破などを「1手」とし、その瞬間の盤面を再現する形式を試作しています。</p><p><a href="kifu-001.html"><strong>▶ 第1局の棋譜を再生する</strong></a></p></section>
<section id="wanted"><h2>情報募集中</h2><div class="box missing">推測値は入れず、確認できていないものは空欄にしています。</div><ul>${D.wanted.map(x=>`<li>${x}</li>`).join('')}</ul></section>
<section id="sources"><h2>出典</h2><ul class="source-list">${sourceRows}</ul><p><a href="updates.html">アップデート履歴は別ページに移動しました →</a></p></section>`;
const sel=document.getElementById('versionSelect'),note=document.getElementById('versionNote'),detail=document.getElementById('versionDetail');D.versions.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.label;sel.appendChild(o)});function render(){const v=D.versions.find(x=>x.id===sel.value)||D.versions[0];note.textContent=v.date;detail.innerHTML=`<strong>${v.label}</strong><br>${v.text}`;localStorage.setItem('zooWikiVersion',v.id)}const saved=localStorage.getItem('zooWikiVersion');if(saved&&D.versions.some(v=>v.id===saved))sel.value=saved;sel.addEventListener('change',render);render();
const targets=[...document.querySelectorAll('main section')].map(s=>({id:s.id,title:s.querySelector('h2')?.textContent||s.id,text:s.textContent}));const input=document.getElementById('searchInput'),results=document.getElementById('searchResults');input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(!q){results.hidden=true;results.innerHTML='';return}const cardHits=D.cards.filter(c=>c.name.toLowerCase().includes(q)).slice(0,5).map(c=>`<a href="${c.slug}.html">${c.name}</a>`);const secHits=targets.filter(x=>x.text.toLowerCase().includes(q)).slice(0,5).map(x=>`<a href="#${x.id}">${x.title}</a>`);results.innerHTML=[...cardHits,...secHits].join('')||'該当なし';results.hidden=false});})();