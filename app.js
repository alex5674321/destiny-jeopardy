const KEY='destiny-jeopardy-v1',colors=['#e9c66e','#6aa9ff','#ad7bff','#61d69a','#ff7b73','#f08bd7'];
const id=()=>crypto.randomUUID();
const makeCat=(name,qs,ans)=>({id:id(),name,clues:qs.map((q,i)=>({id:id(),value:(i+1)*200,question:q,answer:ans[i],used:false}))});
const initial={title:'Destiny 2 Jeopardy',players:[{id:id(),name:'Player 1',color:colors[0],score:0},{id:id(),name:'Player 2',color:colors[1],score:0}],categories:[
makeCat('Lore y personajes',['¿Quién es el comandante de la Vanguardia titán?','¿Cómo se llamaba originalmente Savathûn?','¿Quién fue el Príncipe de los Insomnes?','¿Qué discípulo aguarda en la Pirámide lunar?','¿Quién creó a los Exos?'],['Zavala','Sathona','Uldren Sov','Nezarec','Clovis Bray']),
makeCat('Armas exóticas',['Cañón de mano asociado a las Sombras de Yor.','Fusil de pulsos que crea agujeros negros.','Lanzacohetes famoso por sus proyectiles de manada.','Arco pesado vinculado a un dios gusano.','Fusil de fusión lineal de la Incursión Último Deseo.'],['Espino','Graviton Lance','Gjallarhorn','Aliento del Leviatán','Mil Voces']),
makeCat('Raids y mazmorras',['Raid situado en la Ciudad Onírica.','Jefe final de la Cripta de la Piedra Profunda.','Mazmorra ambientada en el reino de los Nueve.','Raid en el que nos enfrentamos a Rhulk.','Jefe final de Jardín de la Salvación.'],['Último Deseo','Taniks, la Abominación','Profecía','Voto del Discípulo','Mente Santificada']),
makeCat('Destinos',['Planeta que albergaba el Bosque Infinito.','Lugar natal de los Insomnes.','Luna de Saturno invadida por la Colmena.','Ciudad oculta de Neptuno.','Nave mundo de Savathûn.'],['Mercurio','El Arrecife','Titán','Neomuna','Mundo Trono de Savathûn']),
makeCat('¿Quién lo dijo?',['“¿De verdad no quedan balas?”','“Los guardianes hacen su propio destino.”','“Devoción inspira valentía.”','“¿Cómo está tu hermana?”','“No tengo tiempo para explicar…”'],['Cayde-6','La Cámara de Cristal','El Orador','Uldren Sov','La Extraña Exo'])]};
let state=load(),active=null,timer;
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.players&&x.categories)return x}catch(e){}return structuredClone(initial)}
function save(msg){localStorage.setItem(KEY,JSON.stringify(state));if(msg)toast(msg)}
function toast(t){const x=document.querySelector('#toast');x.textContent=t;x.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>x.classList.remove('show'),1600)}
const E=(tag,cls)=>{const x=document.createElement(tag);x.className=cls||'';return x};
function showGame(){document.querySelector('#editor').classList.add('hidden');document.querySelector('#game').classList.remove('hidden');renderGame();scrollTo(0,0)}
function showEditor(){document.querySelector('#game').classList.add('hidden');document.querySelector('#editor').classList.remove('hidden');renderEditor();scrollTo(0,0)}
function renderGame(){document.querySelector('#game-title').textContent=state.title||'Destiny 2 Jeopardy';const b=document.querySelector('#board'),cats=state.categories.filter(c=>c.name.trim()&&c.clues.length);b.innerHTML='';if(!cats.length){b.innerHTML='<article class="card">No categories yet. Select “Edit game” to create one.</article>';return}const rows=Math.max(...cats.map(c=>c.clues.length));b.style.gridTemplateColumns='repeat('+cats.length+',minmax(145px,1fr))';cats.forEach(c=>{const h=E('div','cat');h.textContent=c.name;b.append(h)});for(let r=0;r<rows;r++)cats.forEach(c=>{const q=c.clues[r],t=E('button','tile'+(q&&q.used?' used':''));if(q){t.textContent=q.value;t.disabled=q.used;t.onclick=()=>openClue(c,q)}else{t.classList.add('used');t.disabled=true}b.append(t)});renderScores()}
function renderScores(){const box=document.querySelector('#scores');box.innerHTML='';state.players.forEach(p=>{const c=E('article','player-score');c.style.setProperty('--player',p.color);const n=E('span');n.textContent=p.name||'Unnamed';const row=E('div','score-row'),num=E('b','score-num'),controls=E('div'),minus=E('button'),plus=E('button');num.textContent=p.score;minus.textContent='−';plus.textContent='＋';minus.onclick=()=>score(p,-100);plus.onclick=()=>score(p,100);controls.append(minus,plus);row.append(num,controls);c.append(n,row);box.append(c)})}
function score(p,n){p.score+=n;save();renderScores()}
function openClue(c,q){active=q;document.querySelector('#clue-category').textContent=c.name;document.querySelector('#clue-value').textContent=q.value;document.querySelector('#clue-question').textContent=q.question||'No clue text';document.querySelector('#clue-answer').textContent=q.answer||'No answer entered';document.querySelector('#answer-box').classList.add('hidden');document.querySelector('#reveal').classList.remove('hidden');document.querySelector('#finish').classList.add('hidden');document.querySelector('#clue').showModal()}
function closeClue(used){if(active&&used)active.used=true;active=null;document.querySelector('#clue').close();save();renderGame()}
function renderEditor(){document.querySelector('#title').value=state.title;renderPlayers();renderCats()}
function renderPlayers(){const box=document.querySelector('#player-list');box.innerHTML='';state.players.forEach(p=>{const r=E('div','player-edit'),color=E('input'),name=E('input'),del=E('button','remove');color.type='color';color.value=p.color;name.value=p.name;name.placeholder='Player or team name';del.textContent='×';color.oninput=e=>{p.color=e.target.value;save()};name.oninput=e=>{p.name=e.target.value;save()};del.onclick=()=>{state.players=state.players.filter(x=>x.id!==p.id);save();renderPlayers()};r.append(color,name,del);box.append(r)})}
function renderCats(){const box=document.querySelector('#category-list');box.innerHTML='';state.categories.forEach(c=>{const wrap=E('article','category'),head=E('div','category-head'),name=E('input'),del=E('button','remove'),list=E('div','clue-list'),add=E('button','btn add');name.value=c.name;name.placeholder='Category name';del.textContent='×';name.oninput=e=>{c.name=e.target.value;save()};del.onclick=()=>{state.categories=state.categories.filter(x=>x.id!==c.id);save();renderCats()};head.append(name,del);c.clues.forEach(q=>list.append(clueEditor(c,q)));add.textContent='＋ Add clue';add.onclick=()=>{const v=c.clues.length?Math.max(...c.clues.map(x=>Number(x.value)||0))+200:100;c.clues.push({id:id(),value:v,question:'',answer:'',used:false});save();renderCats()};wrap.append(head,list,add);box.append(wrap)})}
function clueEditor(c,q){const r=E('div','clue-edit'),value=E('input'),question=E('textarea'),answer=E('textarea'),del=E('button','remove');value.type='number';value.step=50;value.value=q.value;question.value=q.question;question.placeholder='Question or clue…';answer.value=q.answer;answer.placeholder='Answer…';del.textContent='×';value.oninput=e=>{q.value=Number(e.target.value);save()};question.oninput=e=>{q.question=e.target.value;save()};answer.oninput=e=>{q.answer=e.target.value;save()};del.onclick=()=>{c.clues=c.clues.filter(x=>x.id!==q.id);save();renderCats()};r.append(value,question,answer,del);return r}
document.querySelector('#home').onclick=showGame;document.querySelector('#edit').onclick=showEditor;document.querySelector('#play').onclick=showGame;
document.querySelector('#title').oninput=e=>{state.title=e.target.value;save()};
document.querySelector('#add-player').onclick=()=>{state.players.push({id:id(),name:'Player '+(state.players.length+1),color:colors[state.players.length%colors.length],score:0});save();renderPlayers()};
document.querySelector('#add-category').onclick=()=>{state.categories.push({id:id(),name:'New category',clues:Array.from({length:5},(_,i)=>({id:id(),value:(i+1)*200,question:'',answer:'',used:false}))});save();renderCats()};
document.querySelector('#reset').onclick=()=>{if(confirm('Reset scores and restore every tile?')){state.players.forEach(p=>p.score=0);state.categories.forEach(c=>c.clues.forEach(q=>q.used=false));save('Game reset');renderGame()}};
document.querySelector('#reveal').onclick=()=>{document.querySelector('#answer-box').classList.remove('hidden');document.querySelector('#reveal').classList.add('hidden');document.querySelector('#finish').classList.remove('hidden')};
document.querySelector('#finish').onclick=()=>closeClue(true);document.querySelector('#close').onclick=()=>closeClue(false);document.querySelector('#clue').oncancel=e=>{e.preventDefault();closeClue(false)};
document.querySelector('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='destiny-jeopardy.json';a.click();URL.revokeObjectURL(a.href);toast('Copia exportada')};
document.querySelector('#import').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.players||!x.categories)throw 0;state=x;save('Game imported');renderEditor()}catch(_){alert('This file is not a valid backup.')}};r.readAsText(f);e.target.value=''};
renderGame();

// --- Contenido multimedia (imágenes, avatares y audio) ---
const MEDIA_DB='destiny-jeopardy-media',MEDIA_STORE='assets';
let mediaDbPromise,objectUrls=new Map();
function mediaDb(){if(!mediaDbPromise)mediaDbPromise=new Promise((ok,bad)=>{const r=indexedDB.open(MEDIA_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(MEDIA_STORE,{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>bad(r.error)});return mediaDbPromise}
async function mediaPut(blob,key=id()){const db=await mediaDb();await new Promise((ok,bad)=>{const tx=db.transaction(MEDIA_STORE,'readwrite');tx.objectStore(MEDIA_STORE).put({id:key,blob});tx.oncomplete=ok;tx.onerror=()=>bad(tx.error)});if(objectUrls.has(key)){URL.revokeObjectURL(objectUrls.get(key));objectUrls.delete(key)}return key}
async function mediaGet(key){if(!key)return null;const db=await mediaDb();return new Promise((ok,bad)=>{const r=db.transaction(MEDIA_STORE).objectStore(MEDIA_STORE).get(key);r.onsuccess=()=>ok(r.result?.blob||null);r.onerror=()=>bad(r.error)})}
async function mediaUrl(key){if(!key)return '';if(objectUrls.has(key))return objectUrls.get(key);const blob=await mediaGet(key);if(!blob)return '';const url=URL.createObjectURL(blob);objectUrls.set(key,url);return url}
async function mediaDelete(key){if(!key)return;const db=await mediaDb();await new Promise((ok,bad)=>{const tx=db.transaction(MEDIA_STORE,'readwrite');tx.objectStore(MEDIA_STORE).delete(key);tx.oncomplete=ok;tx.onerror=()=>bad(tx.error)});if(objectUrls.has(key)){URL.revokeObjectURL(objectUrls.get(key));objectUrls.delete(key)}}
async function mediaAll(){const db=await mediaDb();return new Promise((ok,bad)=>{const r=db.transaction(MEDIA_STORE).objectStore(MEDIA_STORE).getAll();r.onsuccess=()=>ok(r.result);r.onerror=()=>bad(r.error)})}
async function mediaClear(){const db=await mediaDb();await new Promise((ok,bad)=>{const tx=db.transaction(MEDIA_STORE,'readwrite');tx.objectStore(MEDIA_STORE).clear();tx.oncomplete=ok;tx.onerror=()=>bad(tx.error)});objectUrls.forEach(URL.revokeObjectURL);objectUrls.clear()}
const blobToData=blob=>new Promise((ok,bad)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>bad(r.error);r.readAsDataURL(blob)});
async function dataToBlob(data){return fetch(data).then(r=>r.blob())}

async function renderScores(){const box=document.querySelector('#scores');box.innerHTML='';for(const p of state.players){const c=E('article','player-score');c.style.setProperty('--player',p.color||'#e9c66e');let avatar=E('div','player-avatar-fallback');avatar.textContent='◆';if(p.avatarId){const url=await mediaUrl(p.avatarId);if(url){avatar=E('img','player-avatar');avatar.src=url;avatar.alt='Avatar de '+(p.name||'jugador')}}const info=E('div','player-info'),n=E('span'),row=E('div','score-row'),num=E('b','score-num'),controls=E('div'),minus=E('button'),plus=E('button');n.textContent=p.name||'Unnamed';num.textContent=p.score;minus.textContent='−';plus.textContent='＋';minus.onclick=()=>score(p,-100);plus.onclick=()=>score(p,100);controls.append(minus,plus);row.append(num,controls);info.append(n,row);c.append(avatar,info);box.append(c)}}

function renderPlayers(){const box=document.querySelector('#player-list');box.innerHTML='';state.players.forEach(p=>{const r=E('div','player-edit'),picker=E('label','avatar-picker'),file=E('input'),mark=E('span'),name=E('input'),del=E('button','remove');file.type='file';file.accept='image/*';file.setAttribute('aria-label','Imagen de '+(p.name||'jugador'));mark.textContent='＋';picker.title='Choose player image';picker.append(mark,file);if(p.avatarId)mediaUrl(p.avatarId).then(url=>{if(url&&picker.isConnected){const img=E('img');img.src=url;img.alt='';picker.append(img)}});name.value=p.name;name.placeholder='Player or team name';del.textContent='×';file.onchange=async e=>{const chosen=e.target.files[0];if(!chosen)return;if(p.avatarId)await mediaDelete(p.avatarId);p.avatarId=await mediaPut(chosen);save('Player image saved');renderPlayers()};name.oninput=e=>{p.name=e.target.value;save()};del.onclick=async()=>{if(p.avatarId)await mediaDelete(p.avatarId);state.players=state.players.filter(x=>x.id!==p.id);save();renderPlayers()};r.append(picker,name,del);box.append(r)})}

function mediaPicker(label,accept,current,onSet,onClear){const wrap=E('div','media-edit'),picker=E('label','media-picker'+(current?' has-file':'')),input=E('input');input.type='file';input.accept=accept;input.setAttribute('aria-label',label);picker.append(document.createTextNode(current?'✓ '+label+' añadida':'＋ '+label),input);input.onchange=async e=>{const file=e.target.files[0];if(!file)return;await onSet(file)};wrap.append(picker);if(current){const clear=E('button','clear-media');clear.textContent='Remove';clear.onclick=onClear;wrap.append(clear)}return wrap}

function clueEditor(c,q){const r=E('div','clue-edit'),value=E('input'),question=E('textarea'),answer=E('textarea'),del=E('button','remove');value.type='number';value.step=50;value.value=q.value;question.value=q.question;question.placeholder='Question or clue…';answer.value=q.answer;answer.placeholder='Answer…';del.textContent='×';value.oninput=e=>{q.value=Number(e.target.value);save()};question.oninput=e=>{q.question=e.target.value;save()};answer.oninput=e=>{q.answer=e.target.value;save()};del.onclick=async()=>{await Promise.all([mediaDelete(q.imageId),mediaDelete(q.audioId)]);c.clues=c.clues.filter(x=>x.id!==q.id);save();renderCats()};const image=mediaPicker('Imagen','image/*',q.imageId,async file=>{if(q.imageId)await mediaDelete(q.imageId);q.imageId=await mediaPut(file);save('Image added');renderCats()},async()=>{await mediaDelete(q.imageId);delete q.imageId;save();renderCats()});const audio=mediaPicker('Audio','audio/*',q.audioId,async file=>{if(q.audioId)await mediaDelete(q.audioId);q.audioId=await mediaPut(file);save('Audio clip added');renderCats()},async()=>{await mediaDelete(q.audioId);delete q.audioId;save();renderCats()});r.append(value,question,answer,del,image,audio);return r}

async function openClue(c,q){active=q;document.querySelector('#clue-category').textContent=c.name;document.querySelector('#clue-value').textContent=q.value;document.querySelector('#clue-question').textContent=q.question||(q.audioId?'Listen to the clip.':'No clue text');document.querySelector('#clue-answer').textContent=q.answer||'No answer entered';document.querySelector('#answer-box').classList.add('hidden');document.querySelector('#reveal').classList.remove('hidden');document.querySelector('#finish').classList.add('hidden');const media=document.querySelector('#clue-media'),image=document.querySelector('#clue-image'),stage=document.querySelector('#audio-stage'),audio=document.querySelector('#clue-audio');media.classList.add('hidden');image.classList.add('hidden');stage.classList.add('hidden');image.removeAttribute('src');audio.pause();audio.removeAttribute('src');document.querySelector('#clue').showModal();let visible=false;if(q.imageId){const url=await mediaUrl(q.imageId);if(url&&active===q){image.src=url;image.classList.remove('hidden');visible=true}}if(q.audioId){const url=await mediaUrl(q.audioId);if(url&&active===q){audio.src=url;stage.classList.remove('hidden');visible=true}}if(visible&&active===q)media.classList.remove('hidden')}

function closeClue(used){const audio=document.querySelector('#clue-audio');audio.pause();audio.currentTime=0;if(active&&used)active.used=true;active=null;document.querySelector('#clue').close();save();renderGame()}

document.querySelector('#add-music-category').onclick=()=>{state.categories.push({id:id(),name:'Música de Destiny',clues:Array.from({length:5},(_,i)=>({id:id(),value:(i+1)*200,question:'Listen to the clip and name the track.',answer:'',used:false}))});save('Music category created');renderCats()};

document.querySelector('#export').onclick=async()=>{const records=await mediaAll(),packed=[];for(const item of records)packed.push({id:item.id,data:await blobToData(item.blob)});const payload={version:2,state,media:packed},blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='destiny-jeopardy-completo.json';a.click();URL.revokeObjectURL(a.href);toast('Complete backup exported')};
document.querySelector('#import').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=async()=>{try{const imported=JSON.parse(reader.result),next=imported.state||imported;if(!next.players||!next.categories)throw new Error();if(imported.media){await mediaClear();for(const item of imported.media)await mediaPut(await dataToBlob(item.data),item.id)}state=next;save('Game imported');renderEditor()}catch(_){alert('This file is not a valid backup.')}};reader.readAsText(file);e.target.value=''};


// --- Plantillas de categorys y respuestas reveladas ---
const MODE_INFO={
  classic:{label:'Classic'},
  lofi:{label:'Lo-Fi / music'},
  exotic:{label:'Poorly explained exotic'},
  mspaint:{label:'MS Paint'},
  byf:{label:'MynameisByf'}
};
function modeQuestion(mode){
  return mode==='lofi'?'Listen to the clip and name the track.':
    mode==='exotic'?'Describe the exotic as poorly as possible.':
    mode==='mspaint'?'What does this drawing represent?':
    mode==='byf'?'Describe the lore moment here.':'';
}
function newModeCategory(name,mode){return{id:id(),name,mode,clues:Array.from({length:5},(_,i)=>({id:id(),value:(i+1)*200,question:modeQuestion(mode),answer:'',used:false}))}}
function ensureCategoryTemplates(){
  const names=state.categories.map(c=>c.name.toLowerCase());
  let lofi=state.categories.find(c=>c.name.toLowerCase()==='lo-fi beats to wipe');
  if(!lofi){lofi=state.categories.find(c=>c.name.toLowerCase()==='música de destiny');if(lofi)lofi.name='Lo-Fi Beats to Wipe'}
  if(lofi)lofi.mode='lofi';else state.categories.push(newModeCategory('Lo-Fi Beats to Wipe','lofi'));
  const wanted=[['Poorly Explained Exotics','exotic'],['MS Paint','mspaint'],['MynameisByf Moment','byf']];
  wanted.forEach(([name,mode])=>{let c=state.categories.find(x=>x.name.toLowerCase()===name.toLowerCase());if(c)c.mode=mode;else state.categories.push(newModeCategory(name,mode))});
  save();
}

function renderCats(){
  const box=document.querySelector('#category-list');box.innerHTML='';
  state.categories.forEach(c=>{
    c.mode=c.mode||'classic';
    const wrap=E('article','category'),head=E('div','category-head'),name=E('input'),mode=E('select','category-mode'),del=E('button','remove'),list=E('div','clue-list'),add=E('button','btn add');
    name.value=c.name;name.placeholder='Category name';del.textContent='×';
    Object.entries(MODE_INFO).forEach(([value,info])=>{const o=E('option');o.value=value;o.textContent=info.label;o.selected=c.mode===value;mode.append(o)});
    name.oninput=e=>{c.name=e.target.value;save()};
    mode.onchange=e=>{c.mode=e.target.value;save('Category type updated');renderCats()};
    del.onclick=async()=>{for(const q of c.clues)await Promise.all([mediaDelete(q.imageId),mediaDelete(q.answerImageId),mediaDelete(q.audioId)]);state.categories=state.categories.filter(x=>x.id!==c.id);save();renderCats()};
    head.append(name,mode,del);
    c.clues.forEach(q=>list.append(clueEditor(c,q)));
    add.textContent='＋ Add clue';
    add.onclick=()=>{const v=c.clues.length?Math.max(...c.clues.map(x=>Number(x.value)||0))+200:100;c.clues.push({id:id(),value:v,question:modeQuestion(c.mode),answer:'',used:false});save();renderCats()};
    wrap.append(head,list,add);box.append(wrap);
  });
}

function clueEditor(c,q){
  const r=E('div','clue-edit'),value=E('input'),question=E('textarea'),answer=E('textarea'),del=E('button','remove');
  value.type='number';value.step=50;value.value=q.value;
  question.value=q.question;answer.value=q.answer;
  question.placeholder=c.mode==='exotic'?'Poorly explained description…':c.mode==='byf'?'Image and moment description…':'Question or clue…';
  answer.placeholder=c.mode==='lofi'?'Track name…':c.mode==='exotic'?'Exotic name…':c.mode==='mspaint'?'Title or description shown over the image…':'Answer…';
  del.textContent='×';
  value.oninput=e=>{q.value=Number(e.target.value);save()};
  question.oninput=e=>{q.question=e.target.value;save()};
  answer.oninput=e=>{q.answer=e.target.value;save()};
  del.onclick=async()=>{await Promise.all([mediaDelete(q.imageId),mediaDelete(q.answerImageId),mediaDelete(q.audioId)]);c.clues=c.clues.filter(x=>x.id!==q.id);save();renderCats()};
  r.append(value,question,answer,del);
  const promptImage=()=>mediaPicker('Clue image','image/*',q.imageId,async file=>{if(q.imageId)await mediaDelete(q.imageId);q.imageId=await mediaPut(file);save('Clue image added');renderCats()},async()=>{await mediaDelete(q.imageId);delete q.imageId;save();renderCats()});
  const answerImage=()=>mediaPicker('Answer image','image/*',q.answerImageId,async file=>{if(q.answerImageId)await mediaDelete(q.answerImageId);q.answerImageId=await mediaPut(file);save('Answer image added');renderCats()},async()=>{await mediaDelete(q.answerImageId);delete q.answerImageId;save();renderCats()});
  const audio=()=>mediaPicker('Music clip','audio/*',q.audioId,async file=>{if(q.audioId)await mediaDelete(q.audioId);q.audioId=await mediaPut(file);save('Music clip added');renderCats()},async()=>{await mediaDelete(q.audioId);delete q.audioId;save();renderCats()});
  if(c.mode==='lofi')r.append(audio(),answerImage());
  else if(c.mode==='exotic')r.append(answerImage());
  else if(c.mode==='mspaint')r.append(promptImage());
  else if(c.mode==='byf')r.append(promptImage());
  else r.append(promptImage(),audio(),answerImage());
  return r;
}

async function openClue(c,q){
  active={category:c,clue:q};
  document.querySelector('#clue-category').textContent=c.name;
  document.querySelector('#clue-value').textContent=q.value;
  document.querySelector('#clue-question').textContent=q.question||(q.audioId?'Listen to the clip.':'No clue text');
  document.querySelector('#clue-answer').textContent=q.answer||'No answer entered';
  const answerBox=document.querySelector('#answer-box'),media=document.querySelector('#clue-media'),imageStage=document.querySelector('#image-stage'),image=document.querySelector('#clue-image'),overlay=document.querySelector('#image-answer-overlay'),answerImage=document.querySelector('#answer-image'),audioStage=document.querySelector('#audio-stage'),audio=document.querySelector('#clue-audio');
  answerBox.className='answer hidden mode-'+c.mode;media.classList.add('hidden');imageStage.classList.add('hidden');overlay.classList.add('hidden');overlay.textContent='';answerImage.classList.add('hidden');answerImage.removeAttribute('src');image.removeAttribute('src');audioStage.classList.add('hidden');audio.pause();audio.removeAttribute('src');
  document.querySelector('#reveal').classList.remove('hidden');document.querySelector('#finish').classList.add('hidden');
  document.querySelector('#clue').showModal();
  let visible=false;
  if(q.imageId){const url=await mediaUrl(q.imageId);if(url&&active?.clue===q){image.src=url;imageStage.classList.remove('hidden');visible=true}}
  if(q.audioId){const url=await mediaUrl(q.audioId);if(url&&active?.clue===q){audio.src=url;audioStage.classList.remove('hidden');visible=true}}
  if(q.answerImageId){const url=await mediaUrl(q.answerImageId);if(url&&active?.clue===q)answerImage.src=url}
  if(visible&&active?.clue===q)media.classList.remove('hidden');
}

function revealCurrentAnswer(){
  if(!active)return;
  const {category:c,clue:q}=active,answerBox=document.querySelector('#answer-box'),answerImage=document.querySelector('#answer-image'),overlay=document.querySelector('#image-answer-overlay'),imageStage=document.querySelector('#image-stage');
  if(c.mode==='mspaint'&&!imageStage.classList.contains('hidden')){overlay.textContent=q.answer||'No answer entered';overlay.classList.remove('hidden')}else{answerBox.classList.remove('hidden');if(q.answerImageId&&answerImage.getAttribute('src'))answerImage.classList.remove('hidden')}
  document.querySelector('#reveal').classList.add('hidden');document.querySelector('#finish').classList.remove('hidden');
}

function closeClue(used){
  const audio=document.querySelector('#clue-audio');audio.pause();audio.currentTime=0;
  if(active&&used)active.clue.used=true;active=null;document.querySelector('#clue').close();save();renderGame();
}

document.querySelector('#reveal').onclick=revealCurrentAnswer;
document.querySelector('#add-category').onclick=()=>{state.categories.push(newModeCategory('New category','classic'));save();renderCats()};
document.querySelector('#add-music-category').onclick=()=>{state.categories.push(newModeCategory('Lo-Fi Beats to Wipe','lofi'));save('Lo-Fi category created');renderCats()};
ensureCategoryTemplates();
if(!document.querySelector('#editor').classList.contains('hidden'))renderEditor();else renderGame();


// Limpieza solicitada: conservar únicamente las cuatro categorys definitivas.
const CATEGORY_CLEANUP_KEY='destiny-jeopardy-four-categories-v1';
if(!localStorage.getItem(CATEGORY_CLEANUP_KEY)){
  const allowed=new Set(['lo-fi beats to wipe','poorly explained exotics','ms paint','mynameisbyf moment']);
  state.categories=state.categories.filter(c=>allowed.has(c.name.trim().toLowerCase()));
  localStorage.setItem(CATEGORY_CLEANUP_KEY,'1');
  save();
  if(document.querySelector('#clue').open)document.querySelector('#clue').close();
  renderGame();
}


// --- English UI, exact casing, Lumen values ---
function renderGame(){
  document.querySelector('#game-title').textContent=state.title||'Destiny 2 Jeopardy';
  const board=document.querySelector('#board'),cats=state.categories.filter(c=>c.name.trim()&&c.clues.length);board.innerHTML='';
  if(!cats.length){board.innerHTML='<article class="card">No categories yet. Select “Edit game” to create one.</article>';return}
  const rows=Math.max(...cats.map(c=>c.clues.length));board.style.gridTemplateColumns='repeat('+cats.length+',minmax(145px,1fr))';
  cats.forEach(c=>{const head=E('div','cat');head.textContent=c.name;board.append(head)});
  for(let row=0;row<rows;row++)cats.forEach(c=>{const q=c.clues[row],tile=E('button','tile'+(q&&q.used?' used':''));if(q){const icon=E('img','lumen-icon'),amount=E('span');icon.src='assets/lumen.png';icon.alt='';amount.textContent=q.value;tile.setAttribute('aria-label',q.value+' Lumen');tile.append(icon,amount);tile.disabled=q.used;tile.onclick=()=>openClue(c,q)}else{tile.classList.add('used');tile.disabled=true}board.append(tile)});
  renderScores();
}
const ENGLISH_VALUE_KEY='destiny-jeopardy-english-values-v1';
if(!localStorage.getItem(ENGLISH_VALUE_KEY)){
  state.categories.forEach(c=>c.clues.forEach((q,i)=>{q.value=(i+1)*200;
    const translations={
      'Escucha la pista y di el título.':'Listen to the clip and name the track.',
      'Describe aquí el exótico de la peor forma posible.':'Describe the exotic as poorly as possible.',
      '¿Qué representa este dibujo?':'What does this drawing represent?',
      'Describe aquí el momento de lore.':'Describe the lore moment here.'
    };if(translations[q.question])q.question=translations[q.question];
  }));
  localStorage.setItem(ENGLISH_VALUE_KEY,'1');save();
}
MODE_INFO.classic.label='Classic';MODE_INFO.lofi.label='Lo-Fi / music';MODE_INFO.exotic.label='Poorly explained exotic';MODE_INFO.mspaint.label='MS Paint';MODE_INFO.byf.label='MynameisByf';
renderGame();

const SAVED_NAMES_ENGLISH_KEY='destiny-jeopardy-saved-names-english-v1';
if(!localStorage.getItem(SAVED_NAMES_ENGLISH_KEY)){
  state.players.forEach(p=>{const match=(p.name||'').match(/^Guardián (\d+)$/);if(match)p.name='Player '+match[1]});
  state.categories.forEach(c=>{if(c.name==='MynameisByf Momento')c.name='MynameisByf Moment'});
  localStorage.setItem(SAVED_NAMES_ENGLISH_KEY,'1');save();renderGame();
}


// --- Live scoring inside every clue ---
async function scoreAvatar(player,sizeClass){
  if(player.avatarId){const url=await mediaUrl(player.avatarId);if(url){const img=E('img','player-avatar '+(sizeClass||''));img.src=url;img.alt='Avatar for '+(player.name||'player');return img}}
  const fallback=E('div','player-avatar-fallback '+(sizeClass||''));fallback.textContent='◆';return fallback;
}
function manualScoreInput(player){
  const input=E('input','score-input');input.type='number';input.step='1';input.value=player.score;input.setAttribute('aria-label','Score for '+(player.name||'player'));
  input.onchange=()=>setExactScore(player,input.value);input.onkeydown=e=>{if(e.key==='Enter')input.blur()};return input;
}
function setExactScore(player,value){
  const number=Number(value);if(!Number.isFinite(number))return;player.score=Math.trunc(number);save();renderScores();if(active)renderDialogScores();
}
function changePlayerScore(player,amount){
  player.score=(Number(player.score)||0)+amount;save();renderScores();if(active)renderDialogScores();
}
score=function(player,amount){changePlayerScore(player,amount)};

renderScores=async function(){
  const box=document.querySelector('#scores');box.innerHTML='';
  for(const player of state.players){
    const card=E('article','player-score');card.style.setProperty('--player',player.color||'#e9c66e');
    const avatar=await scoreAvatar(player),info=E('div','player-info'),name=E('span'),row=E('div','score-row'),controls=E('div'),minus=E('button'),plus=E('button'),input=manualScoreInput(player),hint=E('small','manual-hint');
    name.textContent=player.name||'Unnamed';minus.textContent='−';plus.textContent='＋';minus.setAttribute('aria-label','Subtract 100 from '+name.textContent);plus.setAttribute('aria-label','Add 100 to '+name.textContent);minus.onclick=()=>changePlayerScore(player,-100);plus.onclick=()=>changePlayerScore(player,100);hint.textContent='Click the score to type any value';controls.append(minus,plus);row.append(input,controls);info.append(name,row,hint);card.append(avatar,info);box.append(card);
  }
};

async function renderDialogScores(){
  if(!active)return;
  const step=Number(active.clue.value)||0,box=document.querySelector('#dialog-scores');document.querySelector('#active-score-value').textContent='±'+step;box.innerHTML='';
  for(const player of state.players){
    const card=E('article','dialog-player');card.style.setProperty('--player',player.color||'#e9c66e');
    const avatar=await scoreAvatar(player),identity=E('div'),name=E('span','dialog-player-name'),hint=E('small','manual-hint'),controls=E('div','live-score-controls'),minus=E('button','score-step'),plus=E('button','score-step'),input=manualScoreInput(player);
    name.textContent=player.name||'Unnamed';hint.textContent='Score is editable';minus.textContent='−'+step;plus.textContent='+'+step;minus.setAttribute('aria-label','Subtract '+step+' from '+name.textContent);plus.setAttribute('aria-label','Add '+step+' to '+name.textContent);minus.onclick=()=>changePlayerScore(player,-step);plus.onclick=()=>changePlayerScore(player,step);identity.append(name,hint);controls.append(minus,input,plus);card.append(avatar,identity,controls);box.append(card);
  }
}
const openClueBeforeLiveScores=openClue;
openClue=async function(category,clue){await openClueBeforeLiveScores(category,clue);await renderDialogScores()};
renderScores();

let categoryNamesFixed=false,hasByfMoment=state.categories.some(c=>c.name==='MynameisByf Moment');
state.categories=state.categories.filter(c=>{if(c.name!=='MynameisByf Momento')return true;if(!hasByfMoment){c.name='MynameisByf Moment';hasByfMoment=true;categoryNamesFixed=true;return true}categoryNamesFixed=true;return false});
if(categoryNamesFixed){save();renderGame()}


// --- Background playlist from /vibing ---
const backgroundAudio=new Audio();
let backgroundTracks=[],backgroundIndex=Math.max(0,Number(state.backgroundIndex)||0);
backgroundAudio.volume=Number.isFinite(Number(state.backgroundVolume))?Number(state.backgroundVolume):0.35;
backgroundAudio.addEventListener('ended',()=>playBackgroundAt(backgroundIndex+1));
backgroundAudio.addEventListener('play',renderBackgroundControls);
backgroundAudio.addEventListener('pause',renderBackgroundControls);
function safeVibingUrl(file){if(!file||file.includes('..')||file.startsWith('/'))return '';return 'vibing/'+file.split('/').map(encodeURIComponent).join('/')}
async function loadVibingPlaylist(){
  try{const response=await fetch('vibing/playlist.json',{cache:'no-store'});if(!response.ok)throw new Error();const data=await response.json();backgroundTracks=(Array.isArray(data.tracks)?data.tracks:[]).map(item=>typeof item==='string'?{file:item,title:item.replace(/\.[^.]+$/,'')}:{file:item.file,title:item.title||item.file?.replace(/\.[^.]+$/,'')}).filter(item=>safeVibingUrl(item.file));if(backgroundIndex>=backgroundTracks.length)backgroundIndex=0}
  catch(_){backgroundTracks=[]}
  renderBackgroundControls();renderVibingPlaylist();
}
async function playBackgroundAt(index){
  if(!backgroundTracks.length)return;backgroundIndex=(index+backgroundTracks.length)%backgroundTracks.length;state.backgroundIndex=backgroundIndex;save();const track=backgroundTracks[backgroundIndex],url=safeVibingUrl(track.file);if(backgroundAudio.dataset.file!==track.file){backgroundAudio.src=url;backgroundAudio.dataset.file=track.file}
  const clueAudio=document.querySelector('#clue-audio');if(clueAudio&&!clueAudio.paused)clueAudio.pause();
  try{await backgroundAudio.play()}catch(_){}renderBackgroundControls();
}
function toggleBackground(){if(backgroundAudio.paused)playBackgroundAt(backgroundIndex);else backgroundAudio.pause()}
function setBackgroundVolume(value){backgroundAudio.volume=Number(value);state.backgroundVolume=backgroundAudio.volume;save();renderBackgroundControls()}
function buildBackgroundControls(container){
  container.innerHTML='';container.classList.toggle('empty',!backgroundTracks.length);
  const previous=E('button','bg-control-button'),play=E('button','bg-control-button'),next=E('button','bg-control-button'),info=E('div','bg-track-info'),title=E('span','bg-track-label'),count=E('small','bg-track-count'),volume=E('input','bg-volume');
  previous.textContent='‹';play.textContent=backgroundAudio.paused?'▶':'Ⅱ';next.textContent='›';previous.setAttribute('aria-label','Previous background track');play.setAttribute('aria-label',backgroundAudio.paused?'Play background music':'Pause background music');next.setAttribute('aria-label','Next background track');
  const track=backgroundTracks[backgroundIndex];title.textContent=track?track.title:'No vibing tracks';count.textContent=track?(backgroundIndex+1)+' / '+backgroundTracks.length:'Add files to /vibing';volume.type='range';volume.min='0';volume.max='1';volume.step='0.05';volume.value=backgroundAudio.volume;volume.setAttribute('aria-label','Background music volume');
  previous.disabled=play.disabled=next.disabled=!track;previous.onclick=()=>playBackgroundAt(backgroundIndex-1);play.onclick=toggleBackground;next.onclick=()=>playBackgroundAt(backgroundIndex+1);volume.oninput=e=>setBackgroundVolume(e.target.value);info.append(title,count);container.append(previous,play,next,info,volume);
}
function renderBackgroundControls(){document.querySelectorAll('.bg-controls').forEach(buildBackgroundControls)}
function renderVibingPlaylist(){
  const box=document.querySelector('#vibing-playlist');if(!box)return;box.innerHTML='';if(!backgroundTracks.length){const empty=E('div','vibing-empty');empty.textContent='No tracks yet. Put audio files in the vibing folder and rebuild playlist.json.';box.append(empty);return}
  backgroundTracks.forEach((track,index)=>{const row=E('div','vibing-track'),number=E('span','vibing-track-index'),text=E('div'),title=E('div','vibing-track-title'),file=E('div','vibing-track-file'),preview=E('button','bg-control-button');number.textContent=String(index+1).padStart(2,'0');title.textContent=track.title;file.textContent=track.file;preview.textContent='▶';preview.setAttribute('aria-label','Play '+track.title);preview.onclick=()=>playBackgroundAt(index);text.append(title,file);row.append(number,text,preview);box.append(row)})
}
const editorBeforeVibing=renderEditor;
renderEditor=function(){editorBeforeVibing();renderVibingPlaylist()};
document.querySelector('#refresh-vibing').onclick=loadVibingPlaylist;
document.querySelector('#clue-audio').addEventListener('play',()=>{if(!backgroundAudio.paused)backgroundAudio.pause()});
renderBackgroundControls();loadVibingPlaylist();


// --- Additional category modes ---
MODE_INFO.madeup={label:'My source / reveal'};
MODE_INFO.finalshape={label:'Enact the final shape'};
const modeQuestionBeforeExtras=modeQuestion;
modeQuestion=function(mode){
  if(mode==='madeup')return 'Write the claim or statement here.';
  if(mode==='finalshape')return 'Describe what the players must do.';
  return modeQuestionBeforeExtras(mode);
};
const clueEditorBeforeExtras=clueEditor;
clueEditor=function(category,clue){
  if(category.mode!=='madeup'&&category.mode!=='finalshape')return clueEditorBeforeExtras(category,clue);
  const row=E('div','clue-edit mode-'+category.mode),value=E('input'),description=E('textarea'),remove=E('button','remove');
  value.type='number';value.step=200;value.value=clue.value;description.value=clue.question;description.placeholder=category.mode==='madeup'?'Claim or statement…':'Challenge instructions…';remove.textContent='×';
  value.oninput=e=>{clue.value=Number(e.target.value);save()};description.oninput=e=>{clue.question=e.target.value;save()};
  remove.onclick=async()=>{await mediaDelete(clue.answerImageId);category.clues=category.clues.filter(item=>item.id!==clue.id);save();renderCats()};
  if(category.mode==='finalshape'){description.classList.add('wide-clue-text');row.append(value,description,remove);return row}
  const answer=E('textarea');answer.value=clue.answer;answer.placeholder='Revealed answer…';answer.oninput=e=>{clue.answer=e.target.value;save()};
  const answerImage=mediaPicker('Answer image','image/*',clue.answerImageId,async file=>{if(clue.answerImageId)await mediaDelete(clue.answerImageId);clue.answerImageId=await mediaPut(file);save('Answer image added');renderCats()},async()=>{await mediaDelete(clue.answerImageId);delete clue.answerImageId;save();renderCats()});
  row.append(value,description,answer,remove,answerImage);return row;
};
const openClueBeforeExtraModes=openClue;
openClue=async function(category,clue){
  await openClueBeforeExtraModes(category,clue);
  if(category.mode==='finalshape'){
    document.querySelector('#answer-box').classList.add('hidden');
    document.querySelector('#reveal').classList.add('hidden');
    document.querySelector('#finish').classList.remove('hidden');
    const label=E('span','challenge-label');label.id='challenge-label';label.textContent='Challenge — award points using the live scoreboard';
    document.querySelector('#clue-question').insertAdjacentElement('beforebegin',label);
  }else document.querySelector('#challenge-label')?.remove();
};
const closeClueBeforeExtraModes=closeClue;
closeClue=function(used){document.querySelector('#challenge-label')?.remove();closeClueBeforeExtraModes(used)};
function ensureExtraCategories(){
  const wanted=[
    ['My source is I made it the fuck up','madeup'],
    ['Enact the final shape','finalshape']
  ];
  let changed=false;
  wanted.forEach(([name,mode])=>{let category=state.categories.find(item=>item.name.toLowerCase()===name.toLowerCase());if(category){if(category.mode!==mode){category.mode=mode;changed=true}}else{state.categories.push(newModeCategory(name,mode));changed=true}});
  if(changed)save();
}
const renderGameBeforeSixCategories=renderGame;
renderGame=function(){const count=state.categories.filter(c=>c.name.trim()&&c.clues.length).length;document.querySelector('#board').style.setProperty('--category-count',count);renderGameBeforeSixCategories()};
ensureExtraCategories();renderGame();


// --- Improved seekable background music timeline ---
function formatPlaybackTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return '0:00';const whole=Math.floor(seconds),minutes=Math.floor(whole/60),remainder=String(whole%60).padStart(2,'0');return minutes+':'+remainder}
function updateBackgroundProgress(){
  const duration=Number.isFinite(backgroundAudio.duration)?backgroundAudio.duration:0,current=Number.isFinite(backgroundAudio.currentTime)?backgroundAudio.currentTime:0,progress=duration?Math.min(100,current/duration*100):0;
  document.querySelectorAll('.bg-seek').forEach(seek=>{seek.max=duration||1;seek.value=current;seek.style.setProperty('--seek-progress',progress+'%')});
  document.querySelectorAll('.bg-time-current').forEach(label=>label.textContent=formatPlaybackTime(current));
  document.querySelectorAll('.bg-time-duration').forEach(label=>label.textContent=formatPlaybackTime(duration));
}
buildBackgroundControls=function(container){
  container.innerHTML='';container.classList.toggle('empty',!backgroundTracks.length);
  const previous=E('button','bg-control-button'),play=E('button','bg-control-button'),next=E('button','bg-control-button'),info=E('div','bg-track-info'),title=E('span','bg-track-label'),count=E('small','bg-track-count'),volume=E('input','bg-volume');
  previous.textContent='‹';play.textContent=backgroundAudio.paused?'▶':'Ⅱ';next.textContent='›';previous.setAttribute('aria-label','Previous background track');play.setAttribute('aria-label',backgroundAudio.paused?'Play background music':'Pause background music');next.setAttribute('aria-label','Next background track');
  const track=backgroundTracks[backgroundIndex];title.textContent=track?track.title:'No vibing tracks';count.textContent=track?(backgroundIndex+1)+' / '+backgroundTracks.length:'Add files to /vibing';volume.type='range';volume.min='0';volume.max='1';volume.step='0.05';volume.value=backgroundAudio.volume;volume.setAttribute('aria-label','Background music volume');
  previous.disabled=play.disabled=next.disabled=!track;previous.onclick=()=>playBackgroundAt(backgroundIndex-1);play.onclick=toggleBackground;next.onclick=()=>playBackgroundAt(backgroundIndex+1);volume.oninput=e=>setBackgroundVolume(e.target.value);info.append(title,count);
  const seekRow=E('div','bg-seek-row'),current=E('span','bg-time bg-time-current'),seek=E('input','bg-seek'),duration=E('span','bg-time bg-time-duration');seek.type='range';seek.min='0';seek.max=Number.isFinite(backgroundAudio.duration)?backgroundAudio.duration:1;seek.step='0.1';seek.value=backgroundAudio.currentTime||0;seek.disabled=!track;seek.setAttribute('aria-label','Background music position');seek.oninput=e=>{if(Number.isFinite(backgroundAudio.duration)){backgroundAudio.currentTime=Number(e.target.value);updateBackgroundProgress()}};seekRow.append(current,seek,duration);
  container.append(previous,play,next,info,volume,seekRow);updateBackgroundProgress();
};
backgroundAudio.addEventListener('timeupdate',updateBackgroundProgress);
backgroundAudio.addEventListener('loadedmetadata',updateBackgroundProgress);
backgroundAudio.addEventListener('durationchange',updateBackgroundProgress);
renderBackgroundControls();
