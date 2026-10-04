
(() => {
'use strict';
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rand(0,a.length-1)];

const pack=window.KA_PACK;
if(!pack){ document.body.innerHTML='<h1 style="color:white;padding:30px">找不到 pack.js</h1>'; return; }

const useDb = !!window.KA_DB?.configured;
const packGrade = Number((pack.gradeLabel||'1').match(/\d+/)?.[0]||1);
const packSubject = ({'數學':'math','國語':'chinese','英文':'english','生活':'life','自然':'science','社會':'social'})[pack.subjectLabel] || pack.subjectLabel || 'unknown';

const LS='ka_'+pack.id;
const defaultProgress={exp:0,coins:0,tickets:0,mastery:0,achievementPoints:0,battles:0,bossWins:0,achievements:[],stats:{attempted:0,firstCorrect:0,finalCorrect:0,rescueSuccess:0,magicCorrect:0}};
let progress=load();
let state=null,currentQuestion=null,attempt=1;

function load(){try{return {...defaultProgress,...JSON.parse(localStorage.getItem(LS)||'{}')}}catch(e){return structuredClone(defaultProgress)}}
function save(){localStorage.setItem(LS,JSON.stringify(progress));renderProgress()}
async function loadRemoteProgress(){
  if(!useDb) return;
  const session = await KA_DB.getSession();
  if(!session){
    alert('請先登入知識學院。');
    location.href='../../../../index.html';
    return;
  }
  try{
    const profile=await KA_DB.getMyProfile();
    const ticket=await KA_DB.getTicket(packGrade,packSubject);
    const up=await KA_DB.getUnitProgress(pack.id);
    progress.exp=Number(profile?.exp||0);
    progress.coins=Number(profile?.coins||0);
    progress.tickets=Number(ticket||0);
    if(up) progress.mastery=Number(up.mastery||0);
  }catch(e){console.warn('讀取遠端進度失敗',e)}
}
async function syncRewards(expGain,coinGain,mastery=null,ticketDelta=0,result=null){
  if(!useDb) return;
  try{
    if(expGain||coinGain) await KA_DB.addRewards(expGain,coinGain);
    if(ticketDelta) await KA_DB.addTicket(packGrade,packSubject,ticketDelta);
    if(mastery!==null) await KA_DB.saveUnitProgress(pack.id,packGrade,packSubject,pack.unitLabel,mastery);
    if(result) await KA_DB.saveGameResult(result);
    const p=await KA_DB.getMyProfile();
    progress.exp=Number(p.exp||progress.exp); progress.coins=Number(p.coins||progress.coins);
    progress.tickets=await KA_DB.getTicket(packGrade,packSubject);
  }catch(e){
    console.error('同步 Supabase 失敗',e);
    alert('成績已完成，但同步 Supabase 失敗：'+e.message);
  }
}
function renderProgress(){
  $('packTitle').textContent=pack.title;
  $('packSub').textContent=`${pack.gradeLabel}｜${pack.subjectLabel}｜${pack.unitLabel}`;
  $('exp').textContent=progress.exp;$('coins').textContent=progress.coins;$('tickets').textContent=progress.tickets;
  $('mastery').textContent=progress.mastery;$('masteryBar').style.width=clamp(progress.mastery,0,100)+'%';
  $('bossBtn').disabled=progress.tickets<pack.ticketCost;
  $('bossReq').textContent=progress.tickets>=pack.ticketCost?'✅ 入場券足夠，可以挑戰！':`需要 🎟️ ×${pack.ticketCost}（目前 ${progress.tickets}）`;
}
const audio={ctx:null,musicOn:true,sfxOn:true,timer:null,step:0};
function ensureAudio(){if(!audio.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)audio.ctx=new A()}if(audio.ctx?.state==='suspended')audio.ctx.resume();return audio.ctx}
function tone(f,d=.1,type='square',v=.04,delay=0){if(!audio.sfxOn)return;const c=ensureAudio();if(!c)return;const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d)}
function sfx(n){if(n==='ok'){tone(660,.08);tone(880,.12,'square',.04,.08)}else if(n==='bad'){tone(180,.12,'sawtooth');tone(130,.16,'sawtooth',.03,.08)}else if(n==='guard'){tone(440,.06,'triangle');tone(660,.09,'triangle',.035,.07)}else if(n==='reward'){tone(523,.08,'triangle');tone(659,.08,'triangle',.035,.08);tone(784,.16,'triangle',.035,.16)}}
function musicTick(){if(!audio.musicOn)return;const c=ensureAudio();if(!c)return;const ns=[261.63,329.63,392,329.63,293.66,349.23,440,349.23],i=audio.step++%ns.length,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=ns[i];g.gain.value=.018;g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.3)}
function startMusic(){if(!audio.musicOn)return;stopMusic();musicTick();audio.timer=setInterval(musicTick,380)}
function stopMusic(){if(audio.timer){clearInterval(audio.timer);audio.timer=null}}

function qByType(type){
  const f=pack.generators[type]||pack.generators.normal;
  return f({rand,pick,clamp});
}
function renderQ(q){
  currentQuestion=q;attempt=1;$('qtype').textContent=q.label;$('question').textContent=q.prompt;$('answer').innerHTML='';
  for(const inp of q.inputs){
    if(inp.kind==='number'||inp.kind==='text'){
      const e=document.createElement('input');e.dataset.key=inp.key;e.type=inp.kind==='number'?'number':'text';e.placeholder=inp.placeholder||'?';$('answer').appendChild(e)
    }else if(inp.kind==='reorder'){
      const wrap=document.createElement('div');
      wrap.style.width='100%';

      const picked=document.createElement('div');
      picked.className='option-grid';
      picked.style.marginBottom='12px';
      picked.dataset.reorderKey=inp.key;
      picked.dataset.value='';

      const bank=document.createElement('div');
      bank.className='option-grid';

      const items=(inp.items||[]).map((label,idx)=>({id:String(idx),label}));
      for(const item of items){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='option-card';
        btn.textContent=item.label;
        btn.dataset.itemId=item.id;
        btn.onclick=()=>{
          const clone=btn.cloneNode(true);
          clone.onclick=()=>{
            bank.appendChild(btn);
            clone.remove();
            const vals=[...picked.querySelectorAll('.option-card')].map(x=>x.textContent);
            picked.dataset.value=JSON.stringify(vals);
          };
          picked.appendChild(clone);
          btn.remove();
          const vals=[...picked.querySelectorAll('.option-card')].map(x=>x.textContent);
          picked.dataset.value=JSON.stringify(vals);
        };
        bank.appendChild(btn);
      }

      const clear=document.createElement('button');
      clear.type='button';
      clear.className='btn secondary';
      clear.textContent='清空重排';
      clear.style.marginTop='10px';
      clear.onclick=()=>{
        const chosen=[...picked.querySelectorAll('.option-card')];
        chosen.forEach(c=>{
          const id=c.dataset.itemId;
          const original=document.createElement('button');
          original.type='button';
          original.className='option-card';
          original.textContent=c.textContent;
          original.dataset.itemId=id;
          original.onclick=()=>{
            const clone=original.cloneNode(true);
            clone.onclick=()=>{
              bank.appendChild(original);
              clone.remove();
              const vals=[...picked.querySelectorAll('.option-card')].map(x=>x.textContent);
              picked.dataset.value=JSON.stringify(vals);
            };
            picked.appendChild(clone);
            original.remove();
            const vals=[...picked.querySelectorAll('.option-card')].map(x=>x.textContent);
            picked.dataset.value=JSON.stringify(vals);
          };
          bank.appendChild(original);
          c.remove();
        });
        picked.dataset.value='[]';
      };

      wrap.appendChild(picked);
      wrap.appendChild(bank);
      wrap.appendChild(clear);
      $('answer').appendChild(wrap);
    }else{
      const h=document.createElement('div');h.className='option-grid';h.dataset.choiceKey=inp.key;h.dataset.value='';
      for(const [value,label] of inp.options){const b=document.createElement('button');b.type='button';b.className='option-card';b.textContent=label;b.onclick=()=>{h.dataset.value=value;h.querySelectorAll('.option-card').forEach(x=>x.classList.toggle('selected',x===b))};h.appendChild(b)}
      $('answer').appendChild(h)
    }
  }
  $('submit').style.display='inline-block';$('msg').className='msg';$('msg').textContent='請作答。第一次答對為 100% 效果。';updateUI()
}
function readAns(){
  const v={};
  $('answer').querySelectorAll('[data-key]').forEach(e=>v[e.dataset.key]=e.value);
  $('answer').querySelectorAll('[data-choice-key]').forEach(e=>v[e.dataset.choiceKey]=e.dataset.value);
  $('answer').querySelectorAll('[data-reorder-key]').forEach(e=>{
    try{v[e.dataset.reorderKey]=JSON.parse(e.dataset.value||'[]')}catch(_){v[e.dataset.reorderKey]=[]}
  });
  return v
}
function updateUI(){
  if(!state)return;$('php').textContent=`${state.playerHp}/100`;$('phpbar').style.width=state.playerHp+'%';$('mp').textContent=`${state.mp}/100`;$('mpbar').style.width=state.mp+'%';
  $('ehp').textContent=`${Math.max(0,state.enemyHp)}/${state.enemyMax}`;$('ehpbar').style.width=clamp(state.enemyHp/state.enemyMax*100,0,100)+'%';
  $('turns').textContent=state.attempted;$('first').textContent=state.firstCorrect;$('final').textContent=state.finalCorrect;$('score').textContent=state.attempted?Math.round(state.finalCorrect/state.attempted*100):0;
  document.querySelectorAll('[data-skill]').forEach(b=>{
    const s=b.dataset.skill;
    b.disabled = !!currentQuestion
      || state.phase!=='player'
      || (s==='magic'&&state.mp<40)
      || (s==='ultimate'&&state.mp<100);
  })
}
function startMob(){
  startMusic();state={mode:'mob',playerHp:100,mp:0,enemyHp:100,enemyMax:100,attempted:0,firstCorrect:0,finalCorrect:0,qIndex:0,pending:null};
  $('menu').style.display='none';$('arena').classList.add('active');$('skills').style.display='none';$('battleTitle').textContent=`👾 ${pack.mobName}`;$('enemyIcon').textContent=pack.mobIcon;$('enemyName').textContent=pack.mobName;nextMob()
}
function nextMob(){if(state.qIndex>=10){finishMob();return}state.qIndex++;const r=Math.random(),type=r<.58?'normal':r<.8?'magic':'defense';state.pending=type;renderQ(qByType(type))}
async function startBoss(){
  if(progress.tickets<pack.ticketCost)return;
  progress.tickets-=pack.ticketCost;save();
  if(useDb){ try{ await KA_DB.setTicket(packGrade,packSubject,progress.tickets); }catch(e){ alert('扣除入場券失敗：'+e.message); return; } }
  startMusic();
  state={mode:'boss',playerHp:100,mp:0,enemyHp:220,enemyMax:220,attempted:0,firstCorrect:0,finalCorrect:0,pending:null,phase:'player'};
  $('menu').style.display='none';$('arena').classList.add('active');$('skills').style.display='flex';$('battleTitle').textContent=`👑 ${pack.bossName}`;$('enemyIcon').textContent=pack.bossIcon;$('enemyName').textContent=pack.bossName;
  currentQuestion=null;state.phase='player';$('qtype').textContent='你的回合';$('question').textContent='選擇技能';$('answer').innerHTML='';$('submit').style.display='none';$('msg').textContent='Boss戰採 1攻1防：你攻擊一次，Boss 反擊一次，再回到你。';updateUI()
}
function chooseSkill(s){
  if(currentQuestion || state.phase!=='player')return;
  if(s==='magic')state.mp-=40;if(s==='ultimate')state.mp-=100;state.pending=s;renderQ(qByType(s))
}
function submit(){
  if(!currentQuestion || !state) return;

  const values=readAns();
  const ok=currentQuestion.check(values);
  const isBossDefense = state.mode==='boss' && state.phase==='boss' && state.pending==='defense';

  // -----------------------------
  // Boss 回合：玩家只做一次防禦題
  // -----------------------------
  if(isBossDefense){
    if(ok){
      state.attempted++;
      state.finalCorrect++;
      progress.stats.attempted++;
      progress.stats.finalCorrect++;

      const full = attempt===1;
      if(full){
        state.firstCorrect++;
        progress.stats.firstCorrect++;
      }else{
        progress.stats.rescueSuccess++;
      }

      const mpGain = full ? 20 : 10;
      state.mp=clamp(state.mp+mpGain,0,100);

      sfx('guard');
      $('msg').className='msg good';
      $('msg').innerHTML=`🛡️ 防禦成功！Boss 攻擊被擋下。 🔵 MP +${mpGain}`;

      currentQuestion=null;
      $('submit').style.display='none';

      // 關鍵：Boss 回合結束後只回到玩家回合，不再自動呼叫 bossDefense()
      state.phase='player';
      state.pending=null;
      $('qtype').textContent='⚔️ 你的回合';
      $('question').textContent='請選擇攻擊技能';
      $('answer').innerHTML='';
      updateUI();
      return;
    }

    if(attempt===1){
      attempt=2;
      sfx('bad');
      $('msg').className='msg bad';
      $('msg').innerHTML='❌ 第一次防禦判斷錯誤。還有一次補判機會。';
      return;
    }

    // 第二次防禦也失敗：Boss 傷害一次，然後回玩家回合
    state.attempted++;
    progress.stats.attempted++;
    state.playerHp=Math.max(0,state.playerHp-10);

    sfx('bad');
    $('msg').className='msg bad';
    $('msg').innerHTML='💥 防禦失敗！Boss 攻擊一次，玩家 HP -10。';

    currentQuestion=null;
    $('submit').style.display='none';
    updateUI();

    if(state.playerHp<=0){
      setTimeout(()=>finishBoss(),500);
      return;
    }

    state.phase='player';
    state.pending=null;
    $('qtype').textContent='⚔️ 你的回合';
    $('question').textContent='請選擇攻擊技能';
    $('answer').innerHTML='';
    updateUI();
    return;
  }

  // -----------------------------
  // 玩家回合：只處理一次攻擊題
  // -----------------------------
  if(ok){
    state.attempted++;
    state.finalCorrect++;
    progress.stats.attempted++;
    progress.stats.finalCorrect++;

    const full = attempt===1;
    if(full){
      state.firstCorrect++;
      progress.stats.firstCorrect++;
    }else{
      progress.stats.rescueSuccess++;
    }

    if(state.pending==='magic') progress.stats.magicCorrect++;

    const base = state.mode==='boss'
      ? ({normal:20,magic:40,ultimate:70}[state.pending]||20)
      : 10;

    const dmg=Math.round(base*(full?1:.5));
    state.enemyHp=Math.max(0,state.enemyHp-dmg);

    if(state.mode==='boss' && state.pending==='normal'){
      state.mp=clamp(state.mp+20,0,100);
    }

    sfx('ok');
    $('msg').className='msg good';
    $('msg').innerHTML=`✅ 攻擊成功！造成 <b>${dmg}</b> 傷害。`;

    currentQuestion=null;
    $('submit').style.display='none';
    updateUI();

    if(state.mode==='mob'){
      setTimeout(()=>nextMob(),600);
      return;
    }

    if(state.enemyHp<=0){
      setTimeout(()=>finishBoss(),600);
      return;
    }

    // 關鍵：玩家攻擊結束後，只進入一次 Boss 防禦回合
    state.phase='boss';
    setTimeout(()=>bossDefense(),600);
    return;
  }

  if(attempt===1){
    attempt=2;
    sfx('bad');
    $('msg').className='msg bad';
    $('msg').innerHTML='❌ 第一次答案不正確。還有一次補答；補答成功效果為 50%。';
    return;
  }

  // 玩家攻擊題第二次也錯：攻擊力0，但仍然輪到 Boss 一次
  state.attempted++;
  progress.stats.attempted++;
  sfx('bad');

  $('msg').className='msg bad';
  $('msg').innerHTML='❌ 第二次仍錯，本回合攻擊力為 0。';

  currentQuestion=null;
  $('submit').style.display='none';
  updateUI();

  if(state.mode==='mob'){
    setTimeout(()=>nextMob(),600);
    return;
  }

  state.phase='boss';
  setTimeout(()=>bossDefense(),600);
}

async function finishMob(){
  const sc=Math.round(state.finalCorrect/state.attempted*100),fc=Math.round(state.firstCorrect/state.attempted*100),pass=sc>=80;
  const eg=pass?Math.round(60+sc*.4):20,cg=pass?20+Math.floor(sc/10):8;progress.exp+=eg;progress.coins+=cg;progress.battles++;if(pass)progress.tickets++;
  progress.mastery=Math.max(progress.mastery,Math.min(100,Math.round(sc*.6+fc*.4)));
  save();
  await syncRewards(eg,cg,progress.mastery,pass?1:0,{
    game_id:pack.id,grade:packGrade,subject:packSubject,unit_id:pack.unitLabel,
    score:sc,first_correct_rate:fc,final_correct_rate:sc,
    exp_earned:eg,coins_earned:cg,boss:false,completed:pass
  });
  save();
  showResult(pass?'🎉 小怪討伐成功':'📘 練習完成',`最終成績：<b>${sc}</b><br>首次答對率：${fc}%<br>⭐ EXP +${eg}<br>💰 金幣 +${cg}<br>${pass?'🎟️ 入場券 +1':'未達80分，本次沒有入場券'}`)
}
async function finishBoss(){
  const sc=state.attempted?Math.round(state.finalCorrect/state.attempted*100):0,fc=state.attempted?Math.round(state.firstCorrect/state.attempted*100):0,pass=state.enemyHp<=0&&sc>=80&&state.playerHp>0;
  if(pass){progress.exp+=250;progress.coins+=100;progress.bossWins++;progress.mastery=Math.max(progress.mastery,Math.round((sc+fc)/2))}
  save();
  await syncRewards(pass?250:0,pass?100:0,progress.mastery,0,{
    game_id:pack.id,grade:packGrade,subject:packSubject,unit_id:pack.unitLabel,
    score:sc,first_correct_rate:fc,final_correct_rate:sc,
    exp_earned:pass?250:0,coins_earned:pass?100:0,boss:true,completed:pass
  });
  save();
  showResult(pass?'👑 Boss 討伐成功':'⚔️ Boss 挑戰結束',`最終成績：<b>${sc}</b><br>首次答對率：${fc}%<br>${pass?'⭐ EXP +250<br>💰 金幣 +100':'通關條件：擊敗 Boss 且成績 ≥80'}`)
}
function showResult(t,b){stopMusic();sfx('reward');$('resultTitle').textContent=t;$('resultBody').innerHTML=b;$('overlay').classList.add('show')}
function closeResult(){stopMusic();$('overlay').classList.remove('show');$('arena').classList.remove('active');$('menu').style.display='grid';state=null;currentQuestion=null;renderProgress()}

$('mobBtn').onclick=startMob;$('bossBtn').onclick=startBoss;$('submit').onclick=submit;$('closeResult').onclick=closeResult;
document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>chooseSkill(b.dataset.skill));
$('quit').onclick=()=>{if(confirm('確定離開戰鬥？')){stopMusic();$('arena').classList.remove('active');$('menu').style.display='grid';state=null;currentQuestion=null}};
$('musicBtn').onclick=()=>{audio.musicOn=!audio.musicOn;$('musicBtn').textContent=audio.musicOn?'🎵 音樂：開':'🎵 音樂：關';audio.musicOn&&state?startMusic():stopMusic()};
$('sfxBtn').onclick=()=>{audio.sfxOn=!audio.sfxOn;$('sfxBtn').textContent=audio.sfxOn?'🔊 音效：開':'🔇 音效：關'};
document.addEventListener('pointerdown',ensureAudio,{once:true});
(async()=>{
  try{await loadRemoteProgress();}catch(e){console.warn(e)}
  renderProgress();
})();
})();