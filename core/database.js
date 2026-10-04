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
  getLeaderboard,getAchievementLeaderboard
};
})();