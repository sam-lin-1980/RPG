window.KA_PACK={
id:"g2_life_basic",
title:"2年級生活 RPG",
gradeLabel:"2年級",
subjectLabel:"生活",
unitLabel:"預設題庫（可整包替換）",
mobName:"生活史萊姆",
mobIcon:"🌱",
bossName:"生活魔王",
bossIcon:"🐲",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"過馬路時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["看號誌", "看號誌"], ["直接跑", "直接跑"], ["閉眼睛", "閉眼睛"]]}],check:v=>v.x==="看號誌"}),
  magic:()=>({label:"✨ 魔法",prompt:"過馬路時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["看號誌", "看號誌"], ["直接跑", "直接跑"], ["閉眼睛", "閉眼睛"]]}],check:v=>v.x==="看號誌"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"這個敘述正確嗎？",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"過馬路時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["看號誌", "看號誌"], ["直接跑", "直接跑"], ["閉眼睛", "閉眼睛"]]}],check:v=>v.x==="看號誌"})
}
};