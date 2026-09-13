(()=>{
const D=window.ZOO_WIKI;
D.rules=D.rules.map(r=>r[0]==='コスト自然回復速度'?['コスト自然回復速度','2秒に1コスト','game','ゲーム内確認']:r);
D.wanted=D.wanted.filter(x=>!x.includes('コスト自然回復速度'));
const pollOptions=[
{name:'ブドウ',pos:'-314.6px -240px'},
{name:'トラ',pos:'-314.6px -125.5px'},
{name:'スイカ',pos:'-415.8px -240px'},
{name:'モグラ',pos:'-314.6px -11.1px'},
{name:'その他'}
];
const pollButton=o=>`<button type="button" class="poll-option" data-poll="${o.name}">${o.pos?`<span class="poll-card-icon" aria-hidden="true" style="background-size:831.5px 347.8px;background-position:${o.pos}"></span>`:`<span class="poll-card-icon poll-card-other" aria-hidden="true">？</span>`}<span class="poll-option-label">${o.name}</span></button>`;
document.getElementById('content').innerHTML=`<h1>環境アンケート</h1><section id="poll" class="poll-section"><div class="poll-box"><div class="poll-title">絶対外せないのは？</div><div class="poll-sub">Ver.1.3.0</div><div class="poll-options">${pollOptions.map(pollButton).join('')}</div><div id="pollMessage" class="poll-message">集計機能は準備中です。回答先を接続後、そのまま投票できるようにします。</div></div></section>`;
const pollMessage=document.getElementById('pollMessage');document.querySelectorAll('.poll-option').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.poll-option').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');pollMessage.textContent=`「${btn.dataset.poll}」を選択中。集計先を接続後、このボタンから投票できます。`;localStorage.setItem('zooPollDraft',btn.dataset.poll)}));const draft=localStorage.getItem('zooPollDraft');if(draft){const b=[...document.querySelectorAll('.poll-option')].find(x=>x.dataset.poll===draft);if(b){b.classList.add('selected');pollMessage.textContent=`「${draft}」を選択中。集計先を接続後、このボタンから投票できます。`;}}
})();