(()=>{
const sidebar=document.querySelector('.sidebar');
if(!sidebar)return;
sidebar.innerHTML=`
<div class="sidebox"><h2>Wiki内検索</h2><input id="searchInput" class="search" type="search" placeholder="カード・項目を検索"><div id="searchResults" class="search-results" hidden></div></div>
<nav class="sidebox"><h2>メニュー</h2>
<h3>★はじめに</h3><ul><li><a href="beginner.html">初心者はこちら</a></li></ul><hr>
<h3>★カード</h3><ul><li><a href="cards.html">カード一覧</a></li></ul><hr>
<h3>★攻略</h3><ul><li><a href="quiz.html">勝つのはどっち？</a></li><li><a href="trivia.html">豆知識</a></li></ul><hr>
<h3>★その他</h3><ul><li><a href="index.html#poll">環境アンケート</a></li><li><a href="updates.html">アップデート履歴</a></li></ul>
</nav>`;
const items=[['初心者はこちら','beginner.html'],['カード一覧','cards.html'],['勝つのはどっち？','quiz.html'],['豆知識','trivia.html'],['環境アンケート','index.html#poll'],['アップデート履歴','updates.html'],['ネズミ','nezumi.html'],['コウモリ','koumori.html'],['ウサギ','usagi.html'],['モグラ','mogura.html'],['サル','saru.html'],['シロクマ','shirokuma.html'],['タカ','taka.html'],['コアラ','koala.html'],['ニワトリ','niwatori.html'],['イノシシ','inoshishi.html'],['パンダ','panda.html'],['トラ','tora.html'],['ライオン','lion.html'],['キリン','kirin.html'],['ゾウ','zou.html'],['リンゴ','ringo.html'],['レモン','lemon.html'],['メロン','melon.html'],['パイナポー','pine.html'],['ブドウ','budou.html'],['スイカ','suika.html']];
const input=document.getElementById('searchInput'),results=document.getElementById('searchResults');
input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(!q){results.hidden=true;results.innerHTML='';return;}const hits=items.filter(([name])=>name.toLowerCase().includes(q)).slice(0,10);results.innerHTML=hits.map(([name,url])=>`<a href="${url}">${name}</a>`).join('')||'該当なし';results.hidden=false;});
window.__wikiMenuLoaded=true;
})();