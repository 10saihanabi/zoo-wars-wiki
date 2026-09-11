(()=>{
const D=window.ZOO_WIKI;
D.rules=D.rules.map(r=>r[0]==='コスト自然回復速度'?['コスト自然回復速度','2秒に1コスト','game','ゲーム内確認']:r);
D.wanted=D.wanted.filter(x=>!x.includes('コスト自然回復速度'));
const badge=(cls,text)=>`<span class="badge ${cls}">${text}</span>`;
const table=(heads,rows,cls='')=>`<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const roleRows=D.roles.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
const counterRows=D.counters.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${badge(r[3],r[4])}</td></tr>`);
const ruleRows=D.rules.map(r=>`<tr><td>${r[0]}</td><td class="${r[1]==='—'?'blank':''}">${r[1]}</td><td>${badge(r[2],r[3])}</td></tr>`);
const sourceRows=D.sources.map(s=>`<li>${badge(s[0],s[1])} ${s[3]?`<a href="${s[3]}" target="_blank" rel="noopener">${s[2]}</a>`:s[2]} — ${s[4]}</li>`).join('');
const pollOptions=['ブドウ','トラ','スイカ','モグラ','その他'];
document.getElementById('content').innerHTML=`
<h1>動物園ウォーズ攻略Wiki</h1><p class="lead">『動物園ウォーズ（Zoo Wars）』の非公式攻略Wikiです。</p>
<div class="quick-start"><div><strong>初めての方へ</strong><br><a href="beginner.html">▶ 初心者の手引き</a></div><div><strong>買わなくてもフレンド対戦できます</strong><br><a href="beginner.html#free-friend">▶ 無料で試す方法</a></div></div>
<section id="poll" class="poll-section"><h2>環境アンケート</h2><div class="poll-box"><div class="poll-title">絶対外せないのは？</div><div class="poll-sub">Ver.1.3.0</div><div class="poll-options">${pollOptions.map(x=>`<button type="button" class="poll-option" data-poll="${x}">${x}</button>`).join('')}</div><div id="pollMessage" class="poll-message">集計機能は準備中です。回答先を接続後、そのまま投票できるようにします。</div></div></section>
<section id="meta"><h2>現環境</h2><div id="versionDetail" class="box info"></div><div class="box warn"><strong>Ver.1.3.0 Tier：情報収集中</strong></div></section>
<section id="cards"><h2>カード</h2><p><a href="cards.html"><strong>▶ カード一覧</strong></a></p></section>
<section id="roles"><h2>役割別</h2>${table(['役割','代表例','説明'],roleRows)}</section>
<section id="deck"><h2>デッキ構築</h2><p><a href="beginner.html#deck">初心者向けのデッキ構築解説 →</a></p></section>
<section id="counters"><h2>相性・対策</h2>${table(['相手','候補','考え方','状態'],counterRows)}</section>
<section id="rules"><h2>ルール・仕様</h2>${table(['項目','確認内容','根拠'],ruleRows)}</section>
<section id="kifu"><h2>棋譜</h2><p><a href="kifu-001.html"><strong>▶ 第1局の棋譜を再生する</strong></a></p></section>
<section id="wanted"><h2>情報募集中</h2><ul>${D.wanted.map(x=>`<li>${x}</li>`).join('')}</ul></section>
<section id="sources"><h2>出典</h2><ul class="source-list">${sourceRows}</ul></section>`;
const pollMessage=document.getElementById('pollMessage');document.querySelectorAll('.poll-option').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.poll-option').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');pollMessage.textContent=`「${btn.dataset.poll}」を選択中。集計先を接続後、このボタンから投票できます。`;localStorage.setItem('zooPollDraft',btn.dataset.poll)}));const draft=localStorage.getItem('zooPollDraft');if(draft){const b=[...document.querySelectorAll('.poll-option')].find(x=>x.dataset.poll===draft);if(b){b.classList.add('selected');pollMessage.textContent=`「${draft}」を選択中。集計先を接続後、このボタンから投票できます。`;}}
const sel=document.getElementById('versionSelect'),note=document.getElementById('versionNote'),detail=document.getElementById('versionDetail');D.versions.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.label;sel.appendChild(o)});function render(){const v=D.versions.find(x=>x.id===sel.value)||D.versions[0];note.textContent=v.date;detail.innerHTML=`<strong>${v.label}</strong><br>${v.text}`;localStorage.setItem('zooWikiVersion',v.id)}const saved=localStorage.getItem('zooWikiVersion');if(saved&&D.versions.some(v=>v.id===saved))sel.value=saved;sel.addEventListener('change',render);render();
const targets=[...document.querySelectorAll('main section')].map(s=>({id:s.id,title:s.querySelector('h2')?.textContent||s.id,text:s.textContent}));const input=document.getElementById('searchInput'),results=document.getElementById('searchResults');input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(!q){results.hidden=true;results.innerHTML='';return}const cardHits=D.cards.filter(c=>c.name.toLowerCase().includes(q)).slice(0,5).map(c=>`<a href="${c.slug}.html">${c.name}</a>`);const secHits=targets.filter(x=>x.text.toLowerCase().includes(q)).slice(0,5).map(x=>`<a href="#${x.id}">${x.title}</a>`);results.innerHTML=[...cardHits,...secHits].join('')||'該当なし';results.hidden=false});})();