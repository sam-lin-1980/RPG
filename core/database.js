(() => {
'use strict';

const cfg = window.KA_CONFIG || {};
const urlOk = typeof cfg.SUPABASE_URL === 'string' &&
  cfg.SUPABASE_URL.startsWith('https://') &&
  cfg.SUPABASE_URL.includes('.supabase.co');
const keyOk = typeof cfg.SUPABASE_KEY === 'string' &&
  cfg.SUPABASE_KEY.startsWith('sb_publishable_');
const sdkOk = typeof window.supabase !== 'undefined';

let client = null;
try {
  if (sdkOk && urlOk && keyOk) {
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  }
} catch (e) {
  console.error('Supabase init failed', e);
}

function requireClient(){
  if(!client) throw new Error('Supabase 尚未設定，請修改根目錄 config.js。');
  return client;
}
function playerEmail(loginId){
  const id = String(loginId||'').trim().toLowerCase();
  if(!/^[a-z0-9._-]{3,24}$/.test(id)){
    throw new Error('玩家 ID 請使用 3～24 個英文字母、數字、._-');
  }
  return `${id}@knowledge-academy.invalid`;
}
async function signUp(loginId,password,nickname){
  const db=requireClient();
  if(String(password||'').length<6) throw new Error('密碼至少 6 個字元。');
  const email=playerEmail(loginId);
  const cleanNick=String(nickname||'').trim();
  if(cleanNick.length<1 || cleanNick.length>20) throw new Error('暱稱請輸入 1～20 個字。');

  const {data,error}=await db.auth.signUp({
    email,password,
    options:{data:{login_id:String(loginId).trim().toLowerCase(),nickname:cleanNick}}
  });
  if(error) throw error;

  // 若 Supabase 關閉 Confirm email，這裡會直接有 session。
  if(data.user){
    const profile = {
      user_id:data.user.id,
      login_id:String(loginId).trim().toLowerCase(),
      nickname:cleanNick,
      grade_level:1,
      grade_percent:0,
      exp:0,
      coins:0,
      achievement_points:0
    };
    const {error:pe}=await db.from('player_profiles').upsert(profile,{onConflict:'user_id'});
    if(pe) console.warn('profile create:', pe);
  }
  return data;
}
async function signIn(loginId,password){
  const db=requireClient();
  const email=playerEmail(loginId);
  const {data,error}=await db.auth.signInWithPassword({email,password});
  if(error) throw error;
  await ensureProfile(data.user);
  return data;
}
async function signOut(){
  const db=requireClient();
  const {error}=await db.auth.signOut();
  if(error) throw error;
}
async function getSession(){
  if(!client) return null;
  const {data,error}=await client.auth.getSession();
  if(error) throw error;
  return data.session||null;
}
async function getCurrentUser(){
  const s=await getSession();
  return s?.user||null;
}
async function ensureProfile(user){
  if(!client || !user) return null;
  const {data:existing,error:e1}=await client.from('player_profiles').select('*').eq('user_id',user.id).maybeSingle();
  if(e1) throw e1;
  if(existing) return existing;

  const meta=user.user_metadata||{};
  const row={
    user_id:user.id,
    login_id:meta.login_id||'player',
    nickname:meta.nickname||meta.login_id||'玩家',
    grade_level:1,grade_percent:0,exp:0,coins:0,achievement_points:0
  };
  const {data,error}=await client.from('player_profiles').insert(row).select().single();
  if(error) throw error;
  return data;
}
async function getMyProfile(){
  const user=await getCurrentUser();
  if(!user) return null;
  return await ensureProfile(user);
}
async function updateMyProfile(patch){
  const db=requireClient();
  const user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const allowed=[
    'nickname','grade_level','grade_percent','exp','coins','achievement_points',
    'equipped_hair','equipped_head','equipped_body','equipped_weapon','equipped_accessory','equipped_pet'
  ];
  const payload={updated_at:new Date().toISOString()};
  for(const k of allowed) if(k in patch) payload[k]=patch[k];
  const {data,error}=await db.from('player_profiles').update(payload).eq('user_id',user.id).select().single();
  if(error) throw error;
  return data;
}
async function addRewards(expGain,coinGain){
  const p=await getMyProfile();
  if(!p) throw new Error('尚未登入。');
  return updateMyProfile({
    exp:Number(p.exp||0)+Number(expGain||0),
    coins:Number(p.coins||0)+Number(coinGain||0)
  });
}
async function getTicket(grade,subject){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const {data,error}=await db.from('boss_tickets').select('amount')
    .eq('user_id',user.id).eq('grade',grade).eq('subject',subject).maybeSingle();
  if(error) throw error;
  return data?.amount||0;
}
async function setTicket(grade,subject,amount){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const row={user_id:user.id,grade,subject,amount:Math.max(0,Math.floor(Number(amount)||0)),updated_at:new Date().toISOString()};
  const {data,error}=await db.from('boss_tickets').upsert(row,{onConflict:'user_id,grade,subject'}).select().single();
  if(error) throw error;
  return data.amount;
}
async function addTicket(grade,subject,delta){
  const now=await getTicket(grade,subject);
  return setTicket(grade,subject,now+delta);
}
async function getUnitProgress(gameId){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const {data,error}=await db.from('unit_progress').select('*')
    .eq('user_id',user.id).eq('game_id',gameId).maybeSingle();
  if(error) throw error;
  return data||null;
}
async function saveUnitProgress(gameId,grade,subject,unitId,mastery){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const row={user_id:user.id,game_id:gameId,grade,subject,unit_id:unitId,mastery:Math.max(0,Math.min(100,Math.round(mastery))),updated_at:new Date().toISOString()};
  const {data,error}=await db.from('unit_progress').upsert(row,{onConflict:'user_id,game_id'}).select().single();
  if(error) throw error;
  try{ await recalculateGradeProgress(grade); }catch(e){ console.warn('grade progress recalc:',e); }
  return data;
}
async function saveGameResult(r){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');
  const row={...r,user_id:user.id};
  const {data,error}=await db.from('game_results').insert(row).select().single();
  if(error) throw error;
  return data;
}

const GRADE_CORE_UNITS={
  1:[
    {game_id:'g1_math_addition10',subject:'math',subject_label:'數學',unit_label:'10以內加法'},
    {game_id:'g1_math_subtraction10',subject:'math',subject_label:'數學',unit_label:'10以內減法'},
    {game_id:'g1_chinese_basic',subject:'chinese',subject_label:'國語',unit_label:'字詞與句子'},
    {game_id:'g1_english_basic',subject:'english',subject_label:'英文',unit_label:'字母與基礎單字'},
    {game_id:'g1_life_basic',subject:'life',subject_label:'生活',unit_label:'生活常識與安全'}
  ]
};

async function getGradeProgress(grade=1){
  const db=requireClient(), user=await getCurrentUser();
  if(!user) throw new Error('尚未登入。');

  const goals=GRADE_CORE_UNITS[Number(grade)]||[];
  if(!goals.length){
    return {grade:Number(grade),percent:0,subjects:[],units:[],suggestion:'此年級的進度規則尚未設定。'};
  }

  const {data,error}=await db.from('unit_progress').select('game_id,subject,unit_id,mastery')
    .eq('user_id',user.id).eq('grade',Number(grade));
  if(error) throw error;

  const byId=new Map((data||[]).map(r=>[r.game_id,r]));
  const units=goals.map(g=>{
    const r=byId.get(g.game_id);
    const mastery=Math.max(0,Math.min(100,Number(r?.mastery||0)));
    // 熟練度 80 分即視為此核心單元完成 100%；未達 80 依比例累積。
    const completion=Math.min(100,Math.round(mastery/80*100));
    return {...g,mastery,completion,passed:mastery>=80};
  });

  const percent=Math.round(units.reduce((s,u)=>s+u.completion,0)/units.length);

  const subjectOrder=[
    ['math','數學'],['chinese','國語'],['english','英文'],['life','生活']
  ];
  const subjects=subjectOrder.map(([subject,label])=>{
    const list=units.filter(u=>u.subject===subject);
    if(!list.length) return null;
    const mastery=Math.round(list.reduce((s,u)=>s+u.mastery,0)/list.length);
    return {subject,label,mastery,status:mastery<70?'red':mastery<80?'yellow':'green'};
  }).filter(Boolean);

  const weakSubjects=subjects.filter(s=>s.mastery<80).sort((a,b)=>a.mastery-b.mastery);
  const weakUnits=units.filter(u=>u.mastery<70).sort((a,b)=>a.mastery-b.mastery);

  let suggestion='✅ 各科目前都已達 80 分，可繼續完成剩餘核心單元。';
  if(weakSubjects.length){
    const a=weakSubjects[0], b=weakSubjects[1];
    suggestion=`🎯 目前最需要加強：${a.label} ${a.mastery}分`;
    if(b) suggestion+=`、${b.label} ${b.mastery}分`;
    suggestion+='。先把較弱科目提升到 80 分。';
  }else if(weakUnits.length){
    const u=weakUnits[0];
    suggestion=`🎯 建議先加強：${u.subject_label}｜${u.unit_label} ${u.mastery}分。`;
  }else if(percent>=100){
    suggestion='🏆 一年級核心學習進度已達 100%。';
  }

  return {grade:Number(grade),percent,subjects,units,suggestion};
}

async function recalculateGradeProgress(grade=1){
  const detail=await getGradeProgress(grade);
  const profile=await getMyProfile();
  if(profile && Number(profile.grade_level)===Number(grade) && Number(profile.grade_percent)!==detail.percent){
    await updateMyProfile({grade_percent:detail.percent});
  }
  return detail;
}

async function getLeaderboard(limit=20){
  const db=requireClient();
  const {data,error}=await db.from('player_profiles')
    .select('user_id,nickname,grade_level,grade_percent,exp,achievement_points,equipped_hair,equipped_head,equipped_body,equipped_weapon,equipped_accessory,equipped_pet')
    .order('grade_level',{ascending:false})
    .order('grade_percent',{ascending:false})
    .order('exp',{ascending:false})
    .limit(limit);
  if(error) throw error;
  return data||[];
}
async function getAchievementLeaderboard(limit=20){
  const db=requireClient();
  const {data,error}=await db.from('player_profiles')
    .select('user_id,nickname,grade_level,grade_percent,exp,achievement_points,equipped_hair,equipped_head,equipped_body,equipped_weapon,equipped_accessory,equipped_pet')
    .order('achievement_points',{ascending:false})
    .order('grade_level',{ascending:false})
    .limit(limit);
  if(error) throw error;
  return data||[];
}

window.KA_DB={
  configured:!!client,urlOk,keyOk,sdkOk,client,
  signUp,signIn,signOut,getSession,getCurrentUser,getMyProfile,updateMyProfile,addRewards,
  getTicket,setTicket,addTicket,getUnitProgress,saveUnitProgress,saveGameResult,
  getGradeProgress,recalculateGradeProgress,
  getLeaderboard,getAchievementLeaderboard
};
})();